type CacheEntry<T> = {
	value: T;
	expiresAt: number;
	staleUntil: number;
};

export class TTLCache<T> {
	private readonly store = new Map<string, CacheEntry<T>>();

	public constructor(
		private readonly ttlMs: number,
		private readonly staleTtlMs: number,
	) {}

	public getFresh(key: string): T | undefined {
		const entry = this.getEntry(key);
		if (!entry) {
			return undefined;
		}

		if (Date.now() <= entry.expiresAt) {
			return entry.value;
		}

		return undefined;
	}

	public getStale(key: string): T | undefined {
		const entry = this.getEntry(key);
		if (!entry) {
			return undefined;
		}

		const now = Date.now();
		if (now > entry.expiresAt && now <= entry.staleUntil) {
			return entry.value;
		}

		return undefined;
	}

	public set(key: string, value: T): void {
		const now = Date.now();
		this.store.set(key, {
			value,
			expiresAt: now + this.ttlMs,
			staleUntil: now + this.ttlMs + this.staleTtlMs,
		});
	}

	private getEntry(key: string): CacheEntry<T> | undefined {
		const entry = this.store.get(key);
		if (!entry) {
			return undefined;
		}

		if (Date.now() > entry.staleUntil) {
			this.store.delete(key);
			return undefined;
		}

		return entry;
	}
}