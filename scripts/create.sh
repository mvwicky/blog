#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

default_src_file='src/img/icons/trident.svg'
default_out_dir='src/img/icons/touch'
src_file=${ICON_SOURCE_FILE:-$default_src_file}
out_dir=${ICON_OUTPUT_DIR:-$default_out_dir}

echo "Source File: $src_file"
echo "Output Dir:  $out_dir"

sizes=(96 128 192 256 384 512)
for size in "${sizes[@]}"; do
  out_file="$out_dir/icon-${size}.png"
  inkscape -o "$out_file" -w "$size" -h "$size" "$src_file"
  echo "$out_file"
done
