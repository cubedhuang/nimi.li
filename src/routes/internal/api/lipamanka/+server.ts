import { error, json } from '@sveltejs/kit';

export async function GET({ fetch, setHeaders }) {
	const rawText = await fetch('https://lipamanka.gay/essays/dictionary')
		.then(res => res.text())
		.catch(() => '');

	if (!rawText) {
		error(500, 'Failed to fetch data');
	}

	const re =
		/<details(?: open)?>\s*?<summary id="([^"]+)">.*?<\/summary>\s*([\s\S]*?)\s*<\/details>/g;

	const words: Record<string, string> = {};

	let match: RegExpExecArray | null;

	while ((match = re.exec(rawText))) {
		const [, word, definition] = match;

		if (word === 'mije-and-meli') {
			words['mije'] = words['meli'] = definition;
		}

		words[word] = definition;
	}

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return json(words);
}
