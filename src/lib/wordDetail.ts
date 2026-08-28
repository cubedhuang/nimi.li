import type { WordDetail } from './types';

const cache: Record<string, WordDetail> = {};
const pending: Record<string, Promise<WordDetail | null>> = {};

export function getCachedWordDetail(id: string): WordDetail | undefined {
	return cache[id];
}

export function loadWordDetail(id: string): Promise<WordDetail | null> {
	const cached = cache[id];
	if (cached) {
		return Promise.resolve(cached);
	}

	return (
		pending[id] ??
		(pending[id] = fetch(`/internal/api/word/${id}`)
			.then((res) =>
				res.ok ? (res.json() as Promise<WordDetail>) : null
			)
			.then((data) => {
				if (data) cache[id] = data;
				return data;
			})
			.catch(() => null)
			.finally(() => {
				delete pending[id];
			}))
	);
}
