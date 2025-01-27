import type { Language, LocalizedWord, Word } from '@kulupu-linku/sona';
import type { Book, UsageCategory } from '@kulupu-linku/sona/utils';

export const normalize = (str: string) =>
	str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim();

export const usageCategories = [
	'core',
	'common',
	'uncommon',
	'obscure',
	'sandbox'
] as const satisfies UsageCategory[];

export const categoryColors: Record<UsageCategory, string> = {
	core: 'bg-emerald-400 darkish:bg-emerald-600',
	common: 'bg-sky-400 darkish:bg-sky-600',
	uncommon: 'bg-yellow-400 darkish:bg-yellow-600',
	obscure: 'bg-fuchsia-400 darkish:bg-fuchsia-600',
	sandbox: 'bg-gray-400 darkish:bg-gray-600'
};

export const categoryTextColors: Record<UsageCategory, string> = {
	core: 'text-emerald-600 darkish:text-emerald-400',
	common: 'text-sky-600 darkish:text-sky-400',
	uncommon: 'text-yellow-600 darkish:text-yellow-400',
	obscure: 'text-fuchsia-600 darkish:text-fuchsia-400',
	sandbox: 'text-gray-600 darkish:text-gray-300'
};

export const bookColors: Record<Book, string> = {
	pu: categoryColors.core,
	'ku suli': categoryColors.common,
	'ku lili': categoryColors.uncommon,
	none: categoryColors.obscure
};

export const categoryIndex = Object.fromEntries(
	usageCategories.map((category, index) => [category, index] as const)
) as Record<UsageCategory, number>;

export function azWordSort(a: LocalizedWord, b: LocalizedWord) {
	return a.word.toLowerCase().localeCompare(b.word.toLowerCase());
}

export function recognitionWordSort(a: LocalizedWord, b: LocalizedWord) {
	const result = getWordRecognition(b) - getWordRecognition(a);

	if (result === 0) return azWordSort(a, b);
	return result;
}

export function combinedWordSort(a: LocalizedWord, b: LocalizedWord) {
	if (a.usage_category === b.usage_category) return azWordSort(a, b);
	return categoryIndex[a.usage_category] - categoryIndex[b.usage_category];
}

export function sortLanguages(languages: Record<string, Language>) {
	return Object.entries(languages).map(([id, language]) => ({
		...language,
		id
	}));
}

export function getTranslation<
	T extends { translations: Record<string, unknown> }
>(word: T, $language: string): T['translations'][string] {
	// @ts-expect-error this is fine
	return word.translations[$language] ?? word.translations.en;
}

export function getShortWordEtymologies(
	word: LocalizedWord,
	$language: string
) {
	const translation = getTranslation(word, $language);

	return word.etymology
		.map(({ word: sourceWord, alt }, index) => {
			const { definition, language } = translation.etymology[index];

			let output = '';

			if (index !== 0 || word.source_language.startsWith('multiple')) {
				output += language + ' ';
			}

			if (sourceWord) {
				output += sourceWord + ' ';
			}

			if (alt) {
				output += alt + ' ';
			}

			if (definition) {
				output += `‘${definition}’`;
			}

			return output.trim();
		})
		.join(', ');
}

export function getWordRecognition(word: LocalizedWord) {
	const dates = Object.keys(word.usage).sort();

	if (dates.length === 0) return -1;

	const latest = dates[dates.length - 1];

	return Number(word.usage[latest]);
}

export function getWordDisplayRecognition(word: LocalizedWord) {
	const recognition = getWordRecognition(word);
	if (recognition === -1) return 'unknown';
	return `${recognition}%`;
}

export function getUsageCategoryFromPercent(percent: number): UsageCategory {
	if (percent >= 90) return 'core';
	if (percent >= 60) return 'common';
	if (percent >= 30) return 'uncommon';
	if (percent >= 2) return 'obscure';
	return 'sandbox';
}

export function getWordLink(id: string, $language: string | undefined) {
	if (!$language || $language === 'en') return `/${id}`;

	return `/${id}/${$language}`;
}

export function getUcsur(word: Word) {
	if (!word.representations?.ucsur) return '';

	return String.fromCodePoint(
		parseInt(word.representations.ucsur?.slice(2) ?? '', 16)
	);
}
