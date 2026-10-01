"""Load and validate corpus/ground_truth.csv.

Run as a check:  python -m analysis.groundtruth
"""
from __future__ import annotations

import csv
import sys
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path

STUDY = Path(__file__).resolve().parents[1]
CORPUS = STUDY / "corpus"
GROUND_TRUTH = CORPUS / "ground_truth.csv"

COLUMNS = [
    "case_id", "pair_id", "cwe", "arm", "source_type", "variant", "file",
    "sink_line", "split", "origin", "complexity", "ts_types", "notes",
]
ALLOWED = {
    "arm": {"ctrl", "express", "hono", "event", "organic"},
    "source_type": {"http", "queue", "cron", "r2", "webhook", "config"},
    "variant": {"vuln", "fixed"},
    "split": {"dev", "heldout"},
    "origin": {"injected", "organic", "external"},
    "complexity": {"intra", "inter", "na"},
    "ts_types": {"y", "n"},
}
# Injected pairs must carry every arm so the paired comparisons exist (preregistration §3).
REQUIRED_INJECTED_ARMS = {"ctrl", "express", "hono", "event"}
PLATFORM_ARMS = {"express", "hono", "event"}  # share the platform sink; ctrl swaps the library
SINK_MARKER = "// SINK"


@dataclass(frozen=True)
class Case:
    case_id: str
    pair_id: str
    cwe: str
    arm: str
    source_type: str
    variant: str
    file: str
    sink_line: int | None
    split: str
    origin: str
    complexity: str
    ts_types: str
    notes: str

    @property
    def cwe_id(self) -> int:
        return int(self.cwe.split("-")[1])


def load(path: Path = GROUND_TRUTH) -> list[Case]:
    with path.open(newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        if reader.fieldnames != COLUMNS:
            raise ValueError(f"unexpected columns: {reader.fieldnames}")
        rows = list(reader)
    cases = []
    for row in rows:
        sink = row["sink_line"].strip()
        cases.append(Case(**{**row, "sink_line": int(sink) if sink else None}))
    return cases


def validate(cases: list[Case], corpus: Path = CORPUS) -> list[str]:
    """Return a list of human-readable problems; empty means valid."""
    errors: list[str] = []
    seen: set[str] = set()
    by_pair: dict[str, list[Case]] = defaultdict(list)

    for c in cases:
        where = f"{c.case_id}:"
        if c.case_id in seen:
            errors.append(f"{where} duplicate case_id")
        seen.add(c.case_id)
        by_pair[c.pair_id].append(c)

        for field, allowed in ALLOWED.items():
            if getattr(c, field) not in allowed:
                errors.append(f"{where} {field}={getattr(c, field)!r} not in {sorted(allowed)}")
        if not c.cwe.startswith("CWE-") or not c.cwe[4:].isdigit():
            errors.append(f"{where} malformed cwe {c.cwe!r}")

        path = corpus / c.file
        if not path.is_file():
            errors.append(f"{where} file not found: {c.file}")
            continue
        if c.variant == "vuln":
            if c.sink_line is None:
                errors.append(f"{where} vuln case needs sink_line")
                continue
            lines = path.read_text(encoding="utf-8").splitlines()
            if not 1 <= c.sink_line <= len(lines):
                errors.append(f"{where} sink_line {c.sink_line} outside file ({len(lines)} lines)")
            elif c.origin in ("injected", "external") and SINK_MARKER not in lines[c.sink_line - 1]:
                errors.append(f"{where} line {c.sink_line} lacks '{SINK_MARKER}' marker")
        elif c.sink_line is not None:
            errors.append(f"{where} fixed case must not have sink_line")

    for pair_id, members in by_pair.items():
        splits = {m.split for m in members}
        if len(splits) > 1:
            errors.append(f"{pair_id}: mixed splits {sorted(splits)}")
        if members[0].origin not in ("injected", "external"):
            continue
        arms: dict[str, set[str]] = defaultdict(set)
        for m in members:
            arms[m.arm].add(m.variant)
        missing = REQUIRED_INJECTED_ARMS - arms.keys()
        if missing:
            errors.append(f"{pair_id}: missing arms {sorted(missing)}")
        for arm, variants in arms.items():
            if variants != {"vuln", "fixed"}:
                errors.append(f"{pair_id}/{arm}: needs both vuln and fixed, has {sorted(variants)}")
        if len({m.cwe for m in members}) > 1:
            errors.append(f"{pair_id}: arms disagree on CWE")
        # Preregistration §3: the sink line is byte-identical across platform arms.
        sinks = {}
        for m in members:
            if m.variant == "vuln" and m.arm in PLATFORM_ARMS and m.sink_line:
                path = corpus / m.file
                if path.is_file():
                    lines = path.read_text(encoding="utf-8").splitlines()
                    if m.sink_line <= len(lines):
                        sinks[m.arm] = lines[m.sink_line - 1]
        if len(set(sinks.values())) > 1:
            errors.append(f"{pair_id}: platform sink lines differ across {sorted(sinks)}")
    return errors


def main() -> int:
    cases = load()
    errors = validate(cases)
    for e in errors:
        print(f"ERROR {e}")
    pairs = {c.pair_id for c in cases}
    print(f"{len(cases)} cases, {len(pairs)} pairs, {len(errors)} errors")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
