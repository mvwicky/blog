#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

xargs_cmd='xargs'
if type gxargs &>/dev/null; then
  xargs_cmd='gxargs'
fi

# inkscape -o touch/<filename> -w <width> -h <height> <input-name>

src_file='src/img/icons/trident.svg'
out_dir='src/img/icons/touch'
out_tpl="$out_dir/icon-{}.png"

sizes=(96 128 192 256 384 512)
# dpis=(36 72 96 192 300)
# printf '%s\000' "${dpis[@]}" | "$xargs_cmd" -t -0 -I'{}' inkscape -o "$out_tpl" -d '{}' ./trident.svg
printf '%s\000' "${sizes[@]}" | "$xargs_cmd" -t -0 -I'{}' inkscape -o "$out_tpl" -w '{}' -h '{}' "$src_file"
