class LocalStorage {
  get<T>(key: string): T | null {
    if (typeof key !== 'string') {
      return null as T;
    }
    const value = localStorage.getItem(key);
    if (value) {
      let result: T | null = null;
      try {
        result = JSON.parse(value) as T;
      } catch (error) {
        result = value as T;
      }
      return result;
    } else {
      return null;
    }
  }
  set<T>(key: string, value: T) {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }
  remove(key: string) {
    if (typeof key !== 'string') {
      return;
    }
    localStorage.removeItem(key);
  }
}
export const local = new LocalStorage();
