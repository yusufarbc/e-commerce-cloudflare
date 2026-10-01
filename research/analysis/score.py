"""Score one downloaded experiment artifact against ground truth.

    python -m analysis.score --artifact <dir> [--out <dir>] [--tolerance 3]

Writes findings.csv, outcomes.csv and metrics.csv (per config, per arm) to --out
(default: <artifact>/derived). Held-out rows are scored only with --heldout,
so they cannot be looked at by accident before rules are frozen.
"""
from __future__ import annotations

import argparse
import csv
from collections import defaultdict
from pathlib import Path

from . import groundtruth, match, normalize


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--artifact", type=Path, required=True)
    ap.add_argument("--out", type=Path)
    ap.add_argument("--tolerance", type=int, default=match.DEFAULT_TOLERANCE)
    ap.add_argument("--heldout", action="store_true",
                    help="include held-out cases (only after rules-frozen-v1)")
    args = ap.parse_args(argv)

    cases = groundtruth.load()
    problems = groundtruth.validate(cases)
    if problems:
        raise SystemExit("ground truth invalid:\n  " + "\n  ".join(problems))
    split = {"dev", "heldout"} if args.heldout else {"dev"}
    cases = [c for c in cases if c.split in split]

    findings, broken = normalize.collect(args.artifact)
    for config, error in broken.items():
        print(f"WARNING {config}: unreadable report, excluded from scoring ({error})")
    configs = sorted({f.config for f in findings} |
                     {normalize.config_name(p) for p in args.artifact.rglob("*.sarif")}
                     - normalize.NON_CORPUS_CONFIGS - broken.keys())
    outcomes = match.score(cases, findings, configs, args.tolerance)

    out = args.out or args.artifact / "derived"
    out.mkdir(parents=True, exist_ok=True)
    normalize.write_csv(findings, out / "findings.csv")
    match.write_csv(outcomes, out / "outcomes.csv")

    groups: dict[tuple[str, str], list[match.Outcome]] = defaultdict(list)
    for o in outcomes:
        groups[(o.config, o.arm)].append(o)
        groups[(o.config, "ALL")].append(o)
    with (out / "metrics.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["config", "arm", "TP", "FN", "FP", "TN", "recall", "precision", "f1", "fpr"])
        for (config, arm), group in sorted(groups.items()):
            m = match.metrics(group)
            w.writerow([config, arm] + [m[k] if m[k] is not None else "" for k in
                                        ("TP", "FN", "FP", "TN", "recall", "precision", "f1", "fpr")])
    print(f"{len(findings)} findings, {len(outcomes)} outcomes -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
