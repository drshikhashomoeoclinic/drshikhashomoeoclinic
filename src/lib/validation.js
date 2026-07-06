export const required = (value) => String(value || '').trim().length > 1;
export const isPhone = (value) => /^[+0-9\s-]{8,18}$/.test(String(value || '').trim());
export const isEmail = (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function sanitizePayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, typeof value === 'string' ? value.trim().slice(0, 2000) : value])
  );
}

export function canSubmit(lastSubmitAt, minDelay = 30000) {
  return !lastSubmitAt || Date.now() - lastSubmitAt > minDelay;
}
