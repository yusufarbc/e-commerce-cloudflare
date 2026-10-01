import json
import tempfile
import unittest
from pathlib import Path

from analysis import groundtruth, match, normalize, stats
from analysis.groundtruth import Case


def case(case_id, variant, sink_line, cwe="CWE-89", file="cases/X/a.js", arm="hono"):
    return Case(case_id, "X", cwe, arm, "http", variant, file, sink_line,
                "dev", "injected", "intra", "n", "")


def finding(line, cwes=(89,), file="cases/X/a.js", rule="r", config="tool"):
    return normalize.Finding(config, rule, tuple(cwes), file, line)


def outcome_of(c, findings, tolerance=3):
    return match.score([c], findings, ["tool"], tolerance)[0].outcome


class MatchingRules(unittest.TestCase):
    def test_exact_line_and_family_is_tp(self):
        self.assertEqual(outcome_of(case("v", "vuln", 10), [finding(10)]), "TP")

    def test_tolerance_boundary(self):
        c = case("v", "vuln", 10)
        self.assertEqual(outcome_of(c, [finding(13)]), "TP")
        self.assertEqual(outcome_of(c, [finding(7)]), "TP")
        self.assertEqual(outcome_of(c, [finding(14)]), "FN")
        self.assertEqual(outcome_of(c, [finding(13)], tolerance=0), "FN")

    def test_wrong_cwe_family_is_fn(self):
        self.assertEqual(outcome_of(case("v", "vuln", 10), [finding(10, cwes=(79,))]), "FN")

    def test_family_member_counts(self):
        self.assertEqual(outcome_of(case("v", "vuln", 10), [finding(10, cwes=(943,))]), "TP")

    def test_other_file_does_not_count(self):
        self.assertEqual(outcome_of(case("v", "vuln", 10), [finding(10, file="cases/X/b.js")]), "FN")

    def test_finding_in_fixed_file_is_fp(self):
        self.assertEqual(outcome_of(case("f", "fixed", None), [finding(3)]), "FP")

    def test_unrelated_cwe_in_fixed_file_is_tn(self):
        self.assertEqual(outcome_of(case("f", "fixed", None), [finding(3, cwes=(400,))]), "TN")

    def test_cwe_less_finding_in_fixed_file_is_fp(self):
        self.assertEqual(outcome_of(case("f", "fixed", None), [finding(3, cwes=())]), "FP")

    def test_duplicate_findings_count_once(self):
        outcomes = match.score([case("v", "vuln", 10)], [finding(10), finding(11, rule="r2")], ["tool"])
        self.assertEqual(len(outcomes), 1)
        self.assertEqual(outcomes[0].outcome, "TP")
        self.assertEqual(outcomes[0].matched_rules, "r;r2")

    def test_metrics(self):
        cs = [case("v1", "vuln", 10), case("v2", "vuln", 10, file="cases/X/b.js"),
              case("f1", "fixed", None, file="cases/X/c.js")]
        m = match.metrics(match.score(cs, [finding(10), finding(1, file="cases/X/c.js")], ["tool"]))
        self.assertEqual((m["TP"], m["FN"], m["FP"], m["TN"]), (1, 1, 1, 0))
        self.assertEqual(m["recall"], 0.5)
        self.assertEqual(m["precision"], 0.5)


class SarifParsing(unittest.TestCase):
    def write(self, name, payload):
        d = Path(self.tmp.name)
        p = d / name
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(payload), encoding="utf-8")
        return p

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()

    def tearDown(self):
        self.tmp.cleanup()

    def test_codeql_style_tags_and_uri(self):
        p = self.write("codeql/javascript.sarif", {"runs": [{
            "tool": {"driver": {"name": "CodeQL"}, "extensions": [{"rules": [
                {"id": "js/sql-injection", "properties": {"tags": ["security", "external/cwe/cwe-089"]}}]}]},
            "results": [{"ruleId": "js/sql-injection", "locations": [{"physicalLocation": {
                "artifactLocation": {"uri": "research/corpus/cases/X/a.js"},
                "region": {"startLine": 8}}}]}]}]})
        [f] = normalize.parse_sarif(p, overrides=[])
        self.assertEqual((f.config, f.cwes, f.file, f.line), ("codeql", (89,), "cases/X/a.js", 8))

    def test_semgrep_style_cwe_text_and_override(self):
        p = self.write("gitleaks.sarif", {"runs": [{
            "tool": {"driver": {"rules": [{"id": "generic-api-key"}]}},
            "results": [{"ruleId": "generic-api-key", "locations": [{"physicalLocation": {
                "artifactLocation": {"uri": "corpus/organic/snapshot/wrangler.toml"},
                "region": {"startLine": 14}}}]}]}]})
        import re
        [f] = normalize.parse_sarif(p, overrides=[("gitleaks", re.compile(".*"), 798)])
        self.assertEqual((f.cwes, f.file), ((798,), "organic/snapshot/wrangler.toml"))


class GroundTruth(unittest.TestCase):
    def test_repository_ground_truth_is_valid(self):
        self.assertEqual(groundtruth.validate(groundtruth.load()), [])

    def test_platform_sink_mismatch_is_reported(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "p").mkdir()
            texts = {"e": "x = sink(a) // SINK\n", "h": "x = sink(a) // SINK\n", "q": "  x = sink(a) // SINK\n"}
            for name, text in texts.items():
                (root / "p" / f"{name}.js").write_text(text, encoding="utf-8")
                (root / "p" / f"{name}f.js").write_text("ok\n", encoding="utf-8")
            (root / "p" / "k.js").write_text("y = lib(a) // SINK\n", encoding="utf-8")
            (root / "p" / "kf.js").write_text("ok\n", encoding="utf-8")
            arms = {"ctrl": "k", "express": "e", "hono": "h", "event": "q"}
            cases = []
            for arm, stem in arms.items():
                cases.append(Case(f"{arm}-v", "P", "CWE-89", arm, "http", "vuln", f"p/{stem}.js", 1,
                                  "dev", "injected", "intra", "n", ""))
                cases.append(Case(f"{arm}-f", "P", "CWE-89", arm, "http", "fixed", f"p/{stem}f.js", None,
                                  "dev", "injected", "intra", "n", ""))
            errors = groundtruth.validate(cases, corpus=root)
            self.assertTrue(any("platform sink lines differ" in e for e in errors), errors)

    def test_missing_arm_is_reported(self):
        cases = [c for c in groundtruth.load() if not (c.pair_id == "C001" and c.arm == "ctrl")]
        self.assertTrue(any("missing arms" in e for e in groundtruth.validate(cases)))


class Statistics(unittest.TestCase):
    def test_mcnemar_exact_known_values(self):
        self.assertEqual(stats.mcnemar_exact(0, 0), 1.0)
        self.assertAlmostEqual(stats.mcnemar_exact(6, 0), 0.03125)
        self.assertAlmostEqual(stats.mcnemar_exact(5, 1), 0.21875)

    def test_wilson_bounds(self):
        lo, hi = stats.wilson(0, 10)
        self.assertEqual(lo, 0.0)
        self.assertAlmostEqual(hi, 0.2775, places=3)

    def test_paired_counts(self):
        r = stats.paired([True, True, False, True], [True, False, False, False])
        self.assertEqual((r.both, r.only_first, r.only_second, r.neither), (1, 2, 0, 1))
        self.assertIsNone(r.odds_ratio)
        lo, hi = r.diff_ci
        self.assertLessEqual(lo, r.diff)
        self.assertGreaterEqual(hi, r.diff)


if __name__ == "__main__":
    unittest.main()
