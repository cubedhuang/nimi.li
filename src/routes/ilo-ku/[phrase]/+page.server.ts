import { error } from '@sveltejs/kit';

export const prerender = true;

export async function load({ params, parent }) {
	const { phrases } = await parent();

	const phrase = phrases[params.phrase.replace(/-/g, ' ')];

	const entries = Object.entries(phrases);
	const index = entries.findIndex(([key]) => phrase.compound === key);

	if (index === -1) {
		return error(404, 'Not found');
	}

	return {
		phrase,
		previous: entries[index - 1]?.[1],
		next: entries[index + 1]?.[1]
	};
}
