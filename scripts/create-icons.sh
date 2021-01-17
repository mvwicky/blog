#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

info() {
  local now
  now=$(date "+%Y-%m-%d %H:%M:%S")
  printf "\r  [ \033[00;34m%s\033[0m ] %s\n" "$now" "$1"
}

has() {
  type "$1" &>/dev/null
}

create_icon() {
  local src=${1:-}
  local out=${2:-}
  local sz=${3:-}
  if [[ ! -f $src ]]; then
    echo "No source passed"
    return 1
  fi
  if [[ -z $out ]]; then
    echo "No output passed"
    return 1
  fi
  if [[ -z $sz ]]; then
    echo "No size passed"
    return 1
  fi
  gm convert "$src" -resize "${sz}x${sz}" "$out"
  local iconhash
  iconhash=$(md5sum "$out" | cut -d ' ' -f 1)
  info "$out $iconhash"

}

if ! has gm; then
  echo "graphicsmagick required"
  exit 1
fi

default_src_file=${ICON_SOURCE_FILE:-'assets/img/icons/trident.svg'}
default_out_dir=${ICON_OUTPUT_DIR:-'assets/img/icons/touch'}
src_file=${1:-$default_src_file}
out_dir=${2:-$default_out_dir}

if [[ ! -f $src_file ]]; then
  echo "Source file $src_file not found"
  exit 1
fi

info "Source File: $src_file"
info "Output Dir:  $out_dir"
echo ""

sizes=(32 77 96 128 192 256 384 512 1024)
for size in "${sizes[@]}"; do
  out_file="$out_dir/icon-${size}.png"
  create_icon "$src_file" "$out_file" "$size"
done
