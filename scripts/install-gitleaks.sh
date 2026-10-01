#!/usr/bin/env sh
# Installs the Gitleaks version CI uses into .tools/ (gitignored), verified by SHA-256.
# The pre-commit hook runs this binary; usage: sh scripts/install-gitleaks.sh
set -eu

VERSION=8.30.1
ROOT=$(git rev-parse --show-toplevel)
DEST="$ROOT/.tools"

case "$(uname -s)" in
  Linux*) os=linux ;;
  Darwin*) os=darwin ;;
  MINGW*|MSYS*|CYGWIN*) os=windows ;;
  *) echo "Unsupported OS: $(uname -s)" >&2; exit 1 ;;
esac
case "$(uname -m)" in
  x86_64|amd64) arch=x64 ;;
  arm64|aarch64) arch=arm64 ;;
  *) echo "Unsupported CPU: $(uname -m)" >&2; exit 1 ;;
esac

case "$os-$arch" in
  linux-x64)     sum=551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb ;;
  linux-arm64)   sum=e4a487ee7ccd7d3a7f7ec08657610aa3606637dab924210b3aee62570fb4b080 ;;
  darwin-x64)    sum=dfe101a4db2255fc85120ac7f3d25e4342c3c20cf749f2c20a18081af1952709 ;;
  darwin-arm64)  sum=b40ab0ae55c505963e365f271a8d3846efbc170aa17f2607f13df610a9aeb6a5 ;;
  windows-x64)   sum=d29144deff3a68aa93ced33dddf84b7fdc26070add4aa0f4513094c8332afc4e ;;
  windows-arm64) sum=b95f5e4f5c425cedca7ee203d9afd29597e692c4924a12ed42f970537c72cc0f ;;
esac

if [ "$os" = windows ]; then ext=zip; bin=gitleaks.exe; else ext=tar.gz; bin=gitleaks; fi
asset="gitleaks_${VERSION}_${os}_${arch}.${ext}"
mkdir -p "$DEST"
tmp="$DEST/$asset"

curl --fail --location --silent --show-error \
  "https://github.com/gitleaks/gitleaks/releases/download/v$VERSION/$asset" --output "$tmp"

if command -v sha256sum >/dev/null 2>&1; then
  actual=$(sha256sum "$tmp" | cut -d' ' -f1)
else
  actual=$(shasum -a 256 "$tmp" | cut -d' ' -f1)
fi
if [ "$actual" != "$sum" ]; then
  rm -f "$tmp"
  echo "Checksum mismatch for $asset" >&2
  exit 1
fi

if [ "$ext" = zip ]; then
  unzip -o -q "$tmp" "$bin" -d "$DEST"
else
  tar -xzf "$tmp" -C "$DEST" "$bin"
fi
rm -f "$tmp"
"$DEST/$bin" version
