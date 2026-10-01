"""Turn scanner SARIF reports into one flat finding table.

Each SARIF file is one *configuration* (tool + rule set), named after the
file stem, e.g. semgrep-default.sarif -> "semgrep-default",
codeql/javascript.sarif -> "codeql".
"""
from __future__ import annotations

import csv
import json
import re
from dataclasses import dataclass
from pathlib import Path

CWE_IN_TEXT = re.compile(r"cwe[-_/ ]?0*(\d+)", re.IGNORECASE)
CWE_MAP = Path(__file__).with_name("cwe_map.csv")

# Reports that describe the whole repository rather than the corpus.
NON_CORPUS_CONFIGS = {"osv-scanner", "trivy-vuln"}


@dataclass(frozen=True)
class Finding:
    config: str
    rule_id: str
    cwes: tuple[int, ...]
    file: str          # relative to corpus/, or "" when outside it
    line: int | None


def config_name(sarif_path: Path) -> str:
    return "codeql" if sarif_path.parent.name == "codeql" else sarif_path.stem


def corpus_relative(uri: str) -> str:
    uri = uri.replace("\\", "/")
    marker = "serverless-sast-study/corpus/"
    if marker in uri:
        return uri.split(marker, 1)[1]
    if uri.startswith("corpus/"):
        return uri[len("corpus/"):]
    return ""


def load_cwe_overrides(path: Path = CWE_MAP) -> list[tuple[str, re.Pattern[str], int]]:
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as fh:
        return [(r["config"], re.compile(r["rule_regex"]), int(r["cwe"])) for r in csv.DictReader(fh)]


def _rule_cwes(rule: dict) -> set[int]:
    props = rule.get("properties", {}) or {}
    texts = list(props.get("tags", []) or [])
    cwe_prop = props.get("cwe")
    if isinstance(cwe_prop, list):
        texts += cwe_prop
    elif cwe_prop:
        texts.append(str(cwe_prop))
    found = set()
    for t in texts:
        found.update(int(m) for m in CWE_IN_TEXT.findall(str(t)))
    return found


def _rules_by_id(run: dict) -> dict[str, dict]:
    tool = run.get("tool", {})
    rules = {}
    for component in [tool.get("driver", {})] + list(tool.get("extensions", []) or []):
        for rule in component.get("rules", []) or []:
            rules[rule.get("id", "")] = rule
    return rules


def parse_sarif(path: Path, overrides=None) -> list[Finding]:
    overrides = load_cwe_overrides() if overrides is None else overrides
    config = config_name(path)
    data = json.loads(path.read_text(encoding="utf-8"))
    findings: list[Finding] = []
    for run in data.get("runs", []):
        rules = _rules_by_id(run)
        for res in run.get("results", []) or []:
            rule_id = res.get("ruleId") or res.get("rule", {}).get("id", "")
            cwes = _rule_cwes(rules.get(rule_id, {}))
            cwes.update(int(m) for m in CWE_IN_TEXT.findall(json.dumps(res.get("properties", {}))))
            for cfg, pattern, cwe in overrides:
                if cfg == config and pattern.search(rule_id):
                    cwes.add(cwe)
            locs = res.get("locations") or [{}]
            phys = locs[0].get("physicalLocation", {})
            uri = phys.get("artifactLocation", {}).get("uri", "")
            line = phys.get("region", {}).get("startLine")
            findings.append(Finding(config, rule_id, tuple(sorted(cwes)), corpus_relative(uri), line))
    return findings


def collect(artifact_dir: Path) -> tuple[list[Finding], dict[str, str]]:
    """Parse every corpus-scoped SARIF report under one run's artifact directory.

    Returns (findings, broken) where broken maps config -> parse error. A broken
    report is a tool failure, not "no findings", and must not be scored.
    """
    findings: list[Finding] = []
    broken: dict[str, str] = {}
    for path in sorted(artifact_dir.rglob("*.sarif")):
        config = config_name(path)
        if config in NON_CORPUS_CONFIGS:
            continue
        try:
            findings.extend(parse_sarif(path))
        except (json.JSONDecodeError, UnicodeDecodeError) as exc:
            broken[config] = f"{type(exc).__name__}: {exc}"
    return findings, broken


def write_csv(findings: list[Finding], path: Path) -> None:
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["config", "rule_id", "cwes", "file", "line"])
        for f in findings:
            w.writerow([f.config, f.rule_id, ";".join(map(str, f.cwes)), f.file, f.line or ""])
