import { getKu } from '#lib/server/fetch.js';

export async function load({ fetch }) {
	return {
		phrases: await getKu({ fetch })
	};
}
