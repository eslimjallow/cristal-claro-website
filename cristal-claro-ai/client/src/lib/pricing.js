/** Mirrors server pricing for instant client-side estimate display */

const BASE = 5;
const MIN = 30;

export function estimatePrice({ windows, heightCategory, needsPole }) {
  const w = Math.max(0, Number(windows) || 0);
  let price = w * BASE;
  if (heightCategory === 'high') price *= 1.2;
  if (needsPole) price *= 1.15;
  const estimate = Math.max(Math.round(price * 100) / 100, MIN);
  return estimate;
}
