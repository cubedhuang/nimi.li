import { client } from '@kulupu-linku/sona/client';
import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { combinedWordSort } from '$lib/util';
import { distance } from 'fastest-levenshtein';

export async function load({ fetch, params, setHeaders }) {
	if (params.language === 'en') {
		redirect(301, `/${params.nimi}`);
	}

	const [data, lukaPona, lipamanka] = await Promise.all([
		client({ fetch, baseUrl: PUBLIC_BASE_URL }).v1.words.$get({
			query: { lang: params.language ?? 'en' }
		}),
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v1.luka_pona.signs.$get({
				query: { lang: params.language ?? 'en' }
			})
			.then((res) => res.json()),
		fetch('/internal/api/lipamanka').then((res) => res.json()) as Promise<
			Record<string, string>
		>
	]);

	if (!data.ok) {
		error(404, { message: 'Language not found' });
	}

	const wordData = await data.json();

	const word = wordData[params.nimi];
	const words = Object.values(wordData);

	if (!word) {
		const sandbox = await client({ fetch })
			.v1.sandbox.$get({ query: {} })
			.then((res) => res.json());

		const sandboxWords = Object.values(sandbox);
		const sandboxWord = sandbox[params.nimi];
		const index = sandboxWords.indexOf(sandboxWord);

		if (sandboxWord) {
			if (params.language) {
				redirect(301, `/${params.nimi}`);
			}

			setHeaders({ 'Cache-Control': 's-maxage=3600' });

			return {
				word: sandboxWord,
				next:
					index === sandboxWords.length - 1
						? undefined
						: sandboxWords[index + 1].id,
				previous: index === 0 ? undefined : sandboxWords[index - 1].id
			};
		}

		const closest = words
			.map(({ word }) => ({
				word,
				distance: distance(word, params.nimi)
			}))
			.filter(
				({ word, distance }) =>
					distance < 3 || word.startsWith(params.nimi)
			)
			.sort((a, b) => a.distance - b.distance)
			.slice(0, 10)
			.map(({ word }) => word);

		if (params.nimi.length >= 10) {
			if (params.nimi.length >= 10) closest.pop();
			closest.push('kijetesantakalu');
		}

		error(404, {
			message: 'Not found',
			closest
		});
	}

	const sortedWords = words.sort(combinedWordSort);
	const index = sortedWords.indexOf(word);

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return {
		word,
		signs: Object.values(lukaPona).filter(
			(word) => params.nimi === word.definition
		),
		lipamanka: lipamanka[params.nimi],
		next:
			index === words.length - 1 ? undefined : sortedWords[index + 1].id,
		previous: index === 0 ? undefined : sortedWords[index - 1].id
	};
}
