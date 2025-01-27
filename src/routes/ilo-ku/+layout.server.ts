import type { CompoundData } from '$lib/types';

export const prerender = true;

export async function load({ fetch }) {
	return {
		phrases: (await fetch('/internal/api/nimi-ku').then(res =>
			res.json()
		)) as CompoundData
	};
}
