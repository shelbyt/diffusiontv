export function formatNumber(num: number): string {
  if (num <= 5000) {
    return num.toString();
  } else if (num < 10000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return (num / 1000000).toFixed(1) + 'M';
  }
}
