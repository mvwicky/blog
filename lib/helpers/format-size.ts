const UNITS = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
const FMT = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 3,
  style: "decimal",
});

export function formatSize(n: number, fmt: Intl.NumberFormat = FMT): string {
  const isNeg = n < 0;
  const prefix = isNeg ? "-" : "";
  if (isNeg) {
    n = -n;
  }
  if (n < 1) {
    return `${prefix}${fmt.format(n)} ${UNITS[0]}`;
  }
  const exp = Math.min(Math.floor(Math.log10(n) / 3), UNITS.length - 1);
  n = n / 1000 ** exp;
  const unit = UNITS[exp];
  return `${prefix}${fmt.format(n)} ${unit}`;
}
