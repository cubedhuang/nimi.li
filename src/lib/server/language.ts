import { Languages } from '@kulupu-linku/sona';

function parseLocale(tag: string) {
	try {
		return new Intl.Locale(tag).maximize();
	} catch {
		return null;
	}
}

export function negotiateLanguage(
	header: string | null,
	languages: Languages
): string | null {
	if (!header) return null;

	const requested = header
		.split(',')
		.map((part) => {
			const [tag, ...params] = part.trim().split(';');
			const q = params.find((p) => p.trim().startsWith('q='));
			return { tag: tag.trim(), q: q ? Number(q.trim().slice(2)) : 1 };
		})
		.filter(({ tag, q }) => tag && tag !== '*' && q > 0)
		.sort((a, b) => b.q - a.q);

	const supported = Object.entries(languages).map(([id, { locale }]) => ({
		id,
		tag: locale.toLowerCase(),
		locale: parseLocale(locale)
	}));

	for (const { tag } of requested) {
		const exact = supported.find((s) => s.tag === tag.toLowerCase());
		if (exact) return exact.id;

		const locale = parseLocale(tag);
		if (!locale) continue;

		const sameScript = supported.find(
			(s) =>
				s.locale?.language === locale.language &&
				s.locale.script === locale.script
		);
		if (sameScript) return sameScript.id;

		const sameLanguage = supported.find(
			(s) => s.locale?.language === locale.language
		);
		if (sameLanguage) return sameLanguage.id;
	}

	return null;
}
