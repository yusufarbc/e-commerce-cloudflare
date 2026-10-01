"""Small-sample statistics from the preregistration, stdlib only.

Larger models (Cochran's Q, GLMM) are added once the corpus exists.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

Z95 = 1.959963984540054


def wilson(successes: int, n: int, z: float = Z95) -> tuple[float, float]:
    """Wilson score interval for a proportion."""
    if n == 0:
        return (math.nan, math.nan)
    p = successes / n
    denom = 1 + z * z / n
    centre = (p + z * z / (2 * n)) / denom
    half = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / denom
    return (max(0.0, centre - half), min(1.0, centre + half))


@dataclass(frozen=True)
class PairedResult:
    n_pairs: int
    both: int        # a: detected in both arms
    only_first: int  # b: detected only in the first (reference) arm
    only_second: int # c: detected only in the second arm
    neither: int     # d
    p_exact: float
    odds_ratio: float | None  # b / c
    diff: float               # p_first - p_second
    diff_ci: tuple[float, float]


def mcnemar_exact(b: int, c: int) -> float:
    """Two-sided exact McNemar p-value (binomial test on discordant pairs)."""
    n = b + c
    if n == 0:
        return 1.0
    k = min(b, c)
    tail = sum(math.comb(n, i) for i in range(k + 1)) / 2 ** n
    return min(1.0, 2 * tail)


def newcombe_paired(a: int, b: int, c: int, d: int, z: float = Z95) -> tuple[float, float]:
    """Newcombe (1998) method 10 CI for a difference of paired proportions."""
    n = a + b + c + d
    if n == 0:
        return (math.nan, math.nan)
    p1, p2 = (a + b) / n, (a + c) / n
    l1, u1 = wilson(a + b, n, z)
    l2, u2 = wilson(a + c, n, z)
    diff = p1 - p2
    prod = (a + b) * (c + d) * (a + c) * (b + d)
    num = a * d - b * c
    if num > 0:  # continuity correction applies only to positive association
        num = max(0.0, num - n / 2)
    phi = num / math.sqrt(prod) if prod else 0.0
    dl = math.sqrt(max(0.0, (p1 - l1) ** 2 - 2 * phi * (p1 - l1) * (u2 - p2) + (u2 - p2) ** 2))
    du = math.sqrt(max(0.0, (u1 - p1) ** 2 - 2 * phi * (u1 - p1) * (p2 - l2) + (p2 - l2) ** 2))
    return (max(-1.0, diff - dl), min(1.0, diff + du))


def paired(first: list[bool], second: list[bool]) -> PairedResult:
    """Compare detection in two arms over the same pairs (same order)."""
    if len(first) != len(second):
        raise ValueError("arms must cover the same pairs")
    a = sum(x and y for x, y in zip(first, second))
    b = sum(x and not y for x, y in zip(first, second))
    c = sum(y and not x for x, y in zip(first, second))
    d = len(first) - a - b - c
    n = len(first)
    diff = ((a + b) - (a + c)) / n if n else math.nan
    return PairedResult(n, a, b, c, d, mcnemar_exact(b, c),
                        (b / c) if c else None, diff, newcombe_paired(a, b, c, d))
