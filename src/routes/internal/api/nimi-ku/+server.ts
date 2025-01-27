import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { Compound, CompoundData } from '$lib/types';

import glyphs from './glyphs.json';

export const prerender = true;

function parseData(raw: string): CompoundData {
	const regex = /^(.+?): \["?(.+?)"?\]/gm;

	return Object.fromEntries(
		[...raw.matchAll(regex)].map(match => {
			const [, compound, rawUses] = match;

			const uses = Object.fromEntries(
				rawUses.split(', ').map(rawUse => {
					const parts = rawUse.split(' ');
					const end = parts.pop() ?? '';
					const count = parseInt(
						end.endsWith('"') ? end.slice(0, -1) : end
					);
					const use = parts.join(' ');

					return [use, count];
				})
			);

			let matches: string[];

			if (compound.includes(' ')) {
				const regex = new RegExp(
					`^${compound
						.split(' ')
						.map(w => `${w}[0-9]?`)
						.join('[-\\^\\*]')}$`,
					'g'
				);

				matches = glyphs.filter(glyph => glyph.match(regex));
			} else {
				matches = [compound];
			}

			const data: [string, Compound] = [compound, { compound, uses }];

			if (matches.length) data[1].glyphs = matches;

			return data;
		})
	);
}

export async function GET({ fetch, setHeaders }) {
	if (dev) {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	}

	const pages = [
		'https://tokipona.org/compounds.txt',
		'https://tokipona.org/nimi_pu.txt',
		'https://tokipona.org/nimi_pi_pu_ala.txt'
	];

	const datas = await Promise.all(
		pages.map(page => fetch(page).then(res => res.text()))
	).then(rawDatas => rawDatas.map(parseData));

	const data: CompoundData = datas.reduce((acc, data) => {
		for (const [compound, compoundData] of Object.entries(data)) {
			if (acc[compound]) {
				acc[compound].uses = {
					...acc[compound].uses,
					...compoundData.uses
				};
			} else {
				acc[compound] = compoundData;
			}
		}

		return acc;
	}, {});

	setHeaders({ 'Cache-Control': 's-maxage=31536000' });

	return json(data);
}
