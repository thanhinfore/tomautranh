const STORAGE_KEY = 'tomautranh-session-v1';
const FAVORITES_KEY = 'tomautranh-favorites-v1';

export function saveSession(session) {
  try {
    const serialized = JSON.stringify(session);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Lưu session thất bại', error);
    return false;
  }
}

export function loadSession() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Không thể tải session', error);
    return null;
  }
}

export function saveFavorites(colors) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(colors));
}

export function loadFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}
