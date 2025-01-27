import { error, redirect } from '@sveltejs/kit';

export const prerender = 'auto';

export async function load({ params, parent }) {
	if (params.phrase.includes(' ')) {
		redirect(301, params.phrase.replaceAll(' ', '-'));
	}

	const { phrases } = await parent();
	const phrase = phrases[params.phrase.replaceAll('-', ' ')];

	if (!phrase) {
		error(404, 'Phrase not found');
	}

	const entries = Object.entries(phrases);
	const index = entries.findIndex(([key]) => phrase.compound === key);

	return {
		phrase,
		previous: entries[index - 1]?.[1],
		next: entries[index + 1]?.[1]
	};
}
