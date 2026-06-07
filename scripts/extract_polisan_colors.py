from __future__ import annotations

import csv
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RENKLER_DIR = ROOT / "renkler"
OUTPUT_JSON = RENKLER_DIR / "polisan-renkler.json"
OUTPUT_CSV = RENKLER_DIR / "polisan-renkler.csv"
OUTPUT_IC_JSON = RENKLER_DIR / "polisan-ic-cephe-renkler.json"
OUTPUT_IC_CSV = RENKLER_DIR / "polisan-ic-cephe-renkler.csv"
OUTPUT_DIS_JSON = RENKLER_DIR / "polisan-dis-cephe-renkler.json"
OUTPUT_DIS_CSV = RENKLER_DIR / "polisan-dis-cephe-renkler.csv"

SECTION_PATTERN = re.compile(
    r'<button class="accordion-button(?: collapsed)?"[^>]*>\s*(?P<section>[^<]+)\s*</button>',
    re.S,
)

ITEM_PATTERN = re.compile(
    r'<div class="kartelaBox">\s*'
    r'<div class="kartelaColor">\s*'
    r'<div class="color" style="background-color:\s*(?P<hex>#[0-9a-fA-F]{6})"></div>\s*'
    r'</div>\s*'
    r'<strong class="d-block text-center">(?P<label>.*?)</strong>',
    re.S,
)

NAME_CHARS = re.compile(r'[A-Za-zÇĞİÖŞÜçğıöşü]')
WHITESPACE = re.compile(r'\s+')
CODE_ONLY = re.compile(r'^(?:\d+\s*/\s*)?(?:Cİ|CI|CD)\s*-\s*\d+$|^Cİ-\d+$|^CI-\d+$')


def normalize_label(label: str) -> str:
    label = html.unescape(label)
    label = re.sub(r'<.*?>', '', label)
    label = WHITESPACE.sub(' ', label)
    return label.strip()


def hex_to_rgb(hex_value: str) -> str:
    value = hex_value.lstrip('#')
    red = int(value[0:2], 16)
    green = int(value[2:4], 16)
    blue = int(value[4:6], 16)
    return f"{red}, {green}, {blue}"


def split_code_name(label: str) -> tuple[str, str]:
    patterns = [
        r'^(?P<code>\d+\s*/\s*Cİ-\d+)\s*(?P<name>.+)$',
        r'^(?P<code>\d+\s*Cİ-\d+)\s*(?P<name>.+)$',
        r'^(?P<code>Cİ-\d+)\s*/\s*(?P<name>.+)$',
        r'^(?P<code>Cİ-\d+)\s+(?P<name>.+)$',
        r'^(?P<code>\d+\s*/\s*CD\s*-\s*\d+)\s*(?P<name>.+)$',
        r'^(?P<code>\d+\s*/\s*CI\s*-\s*\d+)\s*(?P<name>.+)$',
        r'^(?P<code>\d+\s*Cİ\s*-\s*\d+)\s*(?P<name>.+)$',
    ]
    for pattern in patterns:
        match = re.match(pattern, label, re.S)
        if not match:
            continue
        code = match.group('code')
        code = WHITESPACE.sub(' ', code).replace(' / ', '/').replace('/ ', '/').replace(' /', '/').replace(' - ', '-').replace('  ', ' ').strip()
        name = match.group('name').strip()
        return code, name

    return '', label


def is_valid_name(code: str, name: str) -> bool:
    if not name:
        return False
    if not NAME_CHARS.search(name):
        return False
    if CODE_ONLY.match(name):
        return False
    if not code and re.fullmatch(r'(?:\d+\s*/\s*)?(?:Cİ|CI|CD)\s*-\s*\d+', name):
        return False
    return True


def main() -> None:
    results: list[dict[str, str]] = []

    for source in sorted(RENKLER_DIR.rglob('*.html')):
        html_text = source.read_text(encoding='utf-8', errors='ignore')

        section = ''
        current_kategori = ''

        section_matches = list(SECTION_PATTERN.finditer(html_text))
        item_matches = list(re.finditer(r'(?s)<div class="kartelaBox">.*?<div class="color" style="background-color:\s*(?P<hex>#[0-9a-fA-F]{6})"></div>.*?<strong class="d-block text-center">(?P<label>.*?)</strong>', html_text))

        markers: list[tuple[int, str, re.Match[str]]] = []
        for match in section_matches:
            markers.append((match.start(), 'section', match))
        for match in item_matches:
            markers.append((match.start(), 'item', match))

        markers.sort(key=lambda entry: entry[0])

        for _, kind, match in markers:
            if kind == 'section':
                section = normalize_label(match.group('section'))
                continue

            if section not in {'İç Cephe', 'Dış Cephe'}:
                continue

            label = normalize_label(match.group('label'))
            hex_value = match.group('hex').lower()
            code, name = split_code_name(label)
            if not is_valid_name(code, name):
                continue
            results.append(
                {
                    'section': section,
                    'kategoriId': current_kategori,
                    'code': code,
                    'name': name,
                    'hex': hex_value,
                    'rgb': hex_to_rgb(hex_value),
                    'sourceFile': source.relative_to(ROOT).as_posix(),
                }
            )

    deduped: list[dict[str, str]] = []
    seen: set[tuple[str, str, str]] = set()
    for item in results:
        key = (item['section'], item['name'], item['hex'])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(item)

    OUTPUT_JSON.write_text(json.dumps(deduped, ensure_ascii=False, indent=2), encoding='utf-8')

    with OUTPUT_CSV.open('w', encoding='utf-8', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=['section', 'kategoriId', 'code', 'name', 'hex', 'rgb', 'sourceFile'])
        writer.writeheader()
        writer.writerows(deduped)

    ic_items = [item for item in deduped if item['section'] == 'İç Cephe']
    dis_items = [item for item in deduped if item['section'] == 'Dış Cephe']

    OUTPUT_IC_JSON.write_text(json.dumps(ic_items, ensure_ascii=False, indent=2), encoding='utf-8')
    OUTPUT_DIS_JSON.write_text(json.dumps(dis_items, ensure_ascii=False, indent=2), encoding='utf-8')

    with OUTPUT_IC_CSV.open('w', encoding='utf-8', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=['section', 'kategoriId', 'code', 'name', 'hex', 'rgb', 'sourceFile'])
        writer.writeheader()
        writer.writerows(ic_items)

    with OUTPUT_DIS_CSV.open('w', encoding='utf-8', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=['section', 'kategoriId', 'code', 'name', 'hex', 'rgb', 'sourceFile'])
        writer.writeheader()
        writer.writerows(dis_items)

    print(f'Wrote {len(deduped)} colors to {OUTPUT_JSON}')
    print(f'Wrote {len(deduped)} colors to {OUTPUT_CSV}')
    print(f'Wrote {len(ic_items)} colors to {OUTPUT_IC_JSON}')
    print(f'Wrote {len(ic_items)} colors to {OUTPUT_IC_CSV}')
    print(f'Wrote {len(dis_items)} colors to {OUTPUT_DIS_JSON}')
    print(f'Wrote {len(dis_items)} colors to {OUTPUT_DIS_CSV}')


if __name__ == '__main__':
    main()
