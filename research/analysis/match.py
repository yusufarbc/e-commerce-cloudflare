"""Score findings against ground truth (preregistration §4).

TP  vuln case, finding in the same file within ±tolerance of sink_line and
    in the same CWE family.
FN  vuln case without such a finding.
FP  fixed case with a finding in the same file and CWE family, or with a
    finding that carries no CWE at all (cannot be ruled out).
TN  fixed case without such a finding.
"""
from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path

from .groundtruth import Case
from .normalize import Finding

DEFAULT_TOLERANCE = 3

# Families are deliberately narrow and fixed before scoring.
CWE_FAMILIES: list[set[int]] = [
    {89, 564, 943},            # SQL / data query injection
    {78, 77, 88},              # OS command injection
    {94, 95, 96},              # code injection / eval
    {22, 23, 36, 73},          # path traversal / external path control
    {918},                     # SSRF
    {79, 80, 116},             # XSS / output encoding
    {639, 862, 863, 285, 306}, # authorization / missing authentication
    {347, 345},                # signature verification
    {798, 259, 321, 1392},     # hard-coded credentials
    {942, 346},                # permissive CORS / origin validation
]


def family(cwe: int) -> frozenset[int]:
    for fam in CWE_FAMILIES:
        if cwe in fam:
            return frozenset(fam)
    return frozenset({cwe})


def same_family(case_cwe: int, finding_cwes: tuple[int, ...]) -> bool:
    fam = family(case_cwe)
    return any(c in fam for c in finding_cwes)


@dataclass(frozen=True)
class Outcome:
    config: str
    case_id: str
    pair_id: str
    arm: str
    source_type: str
    variant: str
    split: str
    outcome: str  # TP | FN | FP | TN
    matched_rules: str


def score(cases: list[Case], findings: list[Finding], configs: list[str],
          tolerance: int = DEFAULT_TOLERANCE) -> list[Outcome]:
    by_file: dict[tuple[str, str], list[Finding]] = {}
    for f in findings:
        by_file.setdefault((f.config, f.file), []).append(f)

    outcomes = []
    for config in configs:
        for c in cases:
            in_file = by_file.get((config, c.file), [])
            if c.variant == "vuln":
                hits = [f for f in in_file
                        if f.line is not None and abs(f.line - c.sink_line) <= tolerance
                        and same_family(c.cwe_id, f.cwes)]
                label = "TP" if hits else "FN"
            else:
                hits = [f for f in in_file if not f.cwes or same_family(c.cwe_id, f.cwes)]
                label = "FP" if hits else "TN"
            rules = ";".join(sorted({h.rule_id for h in hits}))
            outcomes.append(Outcome(config, c.case_id, c.pair_id, c.arm, c.source_type,
                                    c.variant, c.split, label, rules))
    return outcomes


def metrics(outcomes: list[Outcome]) -> dict[str, float | int | None]:
    n = {k: sum(o.outcome == k for o in outcomes) for k in ("TP", "FN", "FP", "TN")}
    tp, fn, fp, tn = n["TP"], n["FN"], n["FP"], n["TN"]
    recall = tp / (tp + fn) if tp + fn else None
    precision = tp / (tp + fp) if tp + fp else None
    f1 = (2 * precision * recall / (precision + recall)
          if precision and recall else (0.0 if precision == 0 or recall == 0 else None))
    fpr = fp / (fp + tn) if fp + tn else None
    return {**n, "recall": recall, "precision": precision, "f1": f1, "fpr": fpr}


def write_csv(outcomes: list[Outcome], path: Path) -> None:
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(Outcome.__dataclass_fields__.keys())
        for o in outcomes:
            w.writerow([getattr(o, k) for k in Outcome.__dataclass_fields__])
