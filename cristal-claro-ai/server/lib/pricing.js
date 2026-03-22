/**
 * Dynamic price estimation for Cristal Claro window cleaning.
 * Base: €5 per window. Adjustments: +20% (3+ floors), +15% (extension pole).
 * Minimum job: €30.
 */

const BASE_PER_WINDOW = 5;
const MIN_JOB = 30;

/**
 * @param {object} opts
 * @param {number} opts.windows
 * @param {'ground'|'low'|'high'} opts.heightCategory - planta baja | 1-2 pisos | 3+ pisos
 * @param {boolean} opts.needsPole
 * @returns {{ estimate: number, breakdown: string }}
 */
export function estimatePrice({ windows, heightCategory, needsPole }) {
  const w = Math.max(0, Number(windows) || 0);
  let price = w * BASE_PER_WINDOW;

  if (heightCategory === 'high') {
    price *= 1.2;
  }
  if (needsPole) {
    price *= 1.15;
  }

  const estimate = Math.max(Math.round(price * 100) / 100, MIN_JOB);

  const parts = [`${w} ventanas × ${BASE_PER_WINDOW}€`];
  if (heightCategory === 'high') parts.push('+20% altura (3+ pisos)');
  if (needsPole) parts.push('+15% pértiga');
  parts.push(`mínimo ${MIN_JOB}€`);

  return {
    estimate,
    breakdown: parts.join(' · '),
  };
}

export { BASE_PER_WINDOW, MIN_JOB };
