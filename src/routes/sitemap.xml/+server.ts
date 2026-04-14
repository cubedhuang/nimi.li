import type { Word } from '@kulupu-linku/sona';
import type { UsageCategory } from '@kulupu-linku/sona/utils';
import { text } from '@sveltejs/kit';
import { getKu, getWords } from '$lib/server/fetch.js';

export async function GET({ fetch, platform }) {
	const [words, compounds] = [
		getWords({ fetch, platform, lang: 'en' }),
		getKu({ fetch, platform })
	];

	return text(render(Object.values(words), Object.keys(compounds)), {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}

const priorities: Record<UsageCategory, number> = {
	core: 0.8,
	common: 0.6,
	uncommon: 0.4,
	obscure: 0.3,
	sandbox: 0.2
};

const render = (words: Word[], compounds: string[]) =>
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
</urlset>`;
