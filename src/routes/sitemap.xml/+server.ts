import type { LocalizedWord } from '@kulupu-linku/sona';
import { client } from '@kulupu-linku/sona/client';
import type { UsageCategory } from '@kulupu-linku/sona/utils';
import { text } from '@sveltejs/kit';
import { PUBLIC_BASE_URL } from '$env/static/public';
import type { CompoundData } from '$lib/types.js';

export async function GET({ fetch }) {
	const [words, languages, compounds] = [
		await client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v1.words.$get({ query: { lang: 'en' } })
			.then((res) => res.json()),
		await client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v1.languages.$get({})
			.then((res) => res.json()),
		(await fetch('/internal/api/nimi-ku').then((res) =>
			res.json()
		)) as CompoundData
	];

	return text(
		render(
			Object.values(words),
			Object.keys(languages),
			Object.keys(compounds)
		),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}

const priorities: Record<UsageCategory, number> = {
	core: 0.8,
	common: 0.6,
	uncommon: 0.4,
	obscure: 0.3,
	sandbox: 0.2
};

const render = (
	words: LocalizedWord[],
	languages: string[],
	compounds: string[]
) =>
	`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://nimi.li/</loc><priority>1.0</priority></url>
<url><loc>https://nimi.li/luka-pona</loc><priority>0.9</priority></url>
<url><loc>https://nimi.li/ilo-ku</loc><priority>0.9</priority></url>
<url><loc>https://nimi.li/sandbox</loc><priority>0.9</priority></url>
<url><loc>https://nimi.li/about</loc><priority>0.9</priority></url>
${words
	.map((word) => {
		const priority = priorities[word.usage_category];
		return `<url><loc>https://nimi.li/${word.id}</loc><priority>${priority.toFixed(1)}</priority></url>`;
	})
	.join('\n')}
${compounds
	.map((compound) => {
		return `<url><loc>https://nimi.li/ilo-ku/${compound.replaceAll(' ', '-')}</loc><priority>0.7</priority></url>`;
	})
	.join('\n')}
${languages
	.flatMap((lang) => {
		if (lang === 'en') return [];
		return words.map((word) => {
			const priority = priorities[word.usage_category] / 10;
			return `<url><loc>https://nimi.li/${word.id}/${lang}</loc><priority>${priority.toFixed(2)}</priority></url>`;
		});
	})
	.join('\n')}
</urlset>`;
