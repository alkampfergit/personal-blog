#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLS_DIR="$ROOT_DIR/.tools/hugo"
VERSION="${HUGO_VERSION:-0.148.1}"
ARCH="$(uname -m)"
OS="$(uname -s)"

case "$OS" in
  Darwin)
    PLATFORM="darwin"
    ;;
  Linux)
    PLATFORM="linux"
    ;;
  *)
    echo "Unsupported OS: $OS" >&2
    exit 1
    ;;
esac

case "$ARCH" in
  arm64)
    if [[ "$PLATFORM" == "darwin" ]]; then
      ARCHIVE_ARCH="universal"
    else
      ARCHIVE_ARCH="arm64"
    fi
    ;;
  x86_64)
    if [[ "$PLATFORM" == "darwin" ]]; then
      ARCHIVE_ARCH="universal"
    else
      ARCHIVE_ARCH="amd64"
    fi
    ;;
  *)
    echo "Unsupported architecture: $ARCH" >&2
    exit 1
    ;;
esac

ARCHIVE_NAME="hugo_extended_${VERSION}_${PLATFORM}-${ARCHIVE_ARCH}.tar.gz"
DOWNLOAD_URL="https://github.com/gohugoio/hugo/releases/download/v${VERSION}/${ARCHIVE_NAME}"
INSTALL_DIR="$TOOLS_DIR/$VERSION"
TARGET_BIN="$INSTALL_DIR/hugo"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

if [[ -x "$TARGET_BIN" ]]; then
  echo "Hugo Extended ${VERSION} already installed at $TARGET_BIN"
  "$TARGET_BIN" version
  exit 0
fi

mkdir -p "$INSTALL_DIR"

echo "Downloading $DOWNLOAD_URL"
curl -fL "$DOWNLOAD_URL" -o "$TMP_DIR/hugo.tar.gz"
tar -xzf "$TMP_DIR/hugo.tar.gz" -C "$TMP_DIR"
install -m 0755 "$TMP_DIR/hugo" "$TARGET_BIN"

echo "Installed Hugo Extended ${VERSION} at $TARGET_BIN"
"$TARGET_BIN" version
