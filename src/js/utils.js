export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function hexToRgba(hex) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const length = normalized.length;
  if (length === 3) {
    const r = (bigint >> 8) & 0xf;
    const g = (bigint >> 4) & 0xf;
    const b = bigint & 0xf;
    return [r * 17, g * 17, b * 17, 255];
  }
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b, 255];
}

export function rgbaEquals(a, b, tolerance = 0) {
  return (
    Math.abs(a[0] - b[0]) <= tolerance &&
    Math.abs(a[1] - b[1]) <= tolerance &&
    Math.abs(a[2] - b[2]) <= tolerance &&
    Math.abs(a[3] - b[3]) <= tolerance
  );
}

export function getPointerPosition(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX ?? event.touches?.[0]?.clientX) - rect.left) * (canvas.width / rect.width);
  const y = ((event.clientY ?? event.touches?.[0]?.clientY) - rect.top) * (canvas.height / rect.height);
  return { x, y };
}

export function debounce(fn, delay = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function formatPercentage(value) {
  return `${Math.round(value)}%`;
}
