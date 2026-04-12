import { getKu } from '$lib/server/fetch.js';

export async function load({ fetch, platform }) {
	return {
		phrases: await getKu({ fetch, platform })
	};
}
