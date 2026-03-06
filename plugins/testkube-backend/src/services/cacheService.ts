type CacheItem<T = any> = {
  value: T;
  expiresAt: number;
};

type CacheService = {
  map: Map<string, CacheItem>;
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttl?: number): void;
};

const DEFAULT_CACHE_TTL = 1000 * 60 * 30; // 30 min

const CacheService = (): CacheService => ({
  map: new Map<string, CacheItem>(),
  get(key) {
    const item = this.map.get(key);

    if (!item) return null;

    if (item.expiresAt < Date.now()) {
      this.map.delete(key);
      return null;
    }

    return item.value;
  },
  set(key, value, ttl = DEFAULT_CACHE_TTL) {
    this.map.set(key, { value, expiresAt: Date.now() + ttl });
  },
});

export default CacheService;
