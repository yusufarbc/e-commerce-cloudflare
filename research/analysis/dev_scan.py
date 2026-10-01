"""Rule-development loop on the dev split only (preregistration §5, M4).

Runs an Opengrep/Semgrep binary over the dev corpus files listed in
ground_truth.csv -- never over held-out files -- and scores the result.

    python -m analysis.dev_scan --engine path/to/opengrep [--rules rules/edge] [--intrafile]
"""
from __future__ import annotations

import argparse
import subprocess
import tempfile
from pathlib import Path

from . import groundtruth, match, normalize


def dev_files() -> list[str]:
    return sorted({c.file for c in groundtruth.load() if c.split == "dev" and c.origin == "injected"})


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--engine", required=True, help="opengrep or semgrep executable")
    ap.add_argument("--rules", default="rules/edge")
    ap.add_argument("--intrafile", action="store_true", help="Opengrep --taint-intrafile")
    args = ap.parse_args(argv)

    files = dev_files()
    config = "custom-intrafile" if args.intrafile else "custom"
    with tempfile.TemporaryDirectory() as tmp:
        sarif = Path(tmp) / f"{config}.sarif"
        cmd = [args.engine, "scan", "--config", args.rules, "--sarif", "--output", str(sarif), "--quiet"]
        if args.intrafile:
            cmd.append("--taint-intrafile")
        cmd += [str(groundtruth.CORPUS / f) for f in files]
        subprocess.run(cmd, check=False)
        findings, broken = normalize.collect(Path(tmp))
        if broken:
            raise SystemExit(f"unreadable SARIF: {broken}")

    cases = [c for c in groundtruth.load() if c.split == "dev" and c.origin == "injected"]
    outcomes = match.score(cases, findings, [config])
    arms = ["ctrl", "express", "hono", "event"]
    pairs = sorted({c.pair_id for c in cases})
    det = {(o.pair_id, o.arm): o.outcome for o in outcomes if o.variant == "vuln"}
    print(f"{config}: {len(files)} dev files scanned")
    for p in pairs:
        print(f"  {p}: " + " ".join(f"{a}={'T' if det.get((p, a)) == 'TP' else '.'}" for a in arms))
    for o in outcomes:
        if o.outcome == "FP":
            print(f"  FP {o.case_id} {o.matched_rules}")
    m = match.metrics(outcomes)
    print(f"  TP={m['TP']} FN={m['FN']} FP={m['FP']} TN={m['TN']}")
    for a in arms:
        k = sum(det.get((p, a)) == "TP" for p in pairs)
        print(f"  recall[{a}] = {k}/{len(pairs)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
