export const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadFromLocalStorage = <T>(key: string, fallback: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
};
