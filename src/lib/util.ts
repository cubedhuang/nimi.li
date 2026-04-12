import type { Language, Word } from '@kulupu-linku/sona';
import type { UsageCategory } from '@kulupu-linku/sona/utils';

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

export const categoryBackgroundColors: Record<UsageCategory, string> = {
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

export const categoryIndex = Object.fromEntries(
	usageCategories.map((category, index) => [category, index] as const)
) as Record<UsageCategory, number>;

export function azWordSort(a: Word, b: Word) {
	return a.word.toLowerCase().localeCompare(b.word.toLowerCase());
}

export function recognitionWordSort(a: Word, b: Word) {
	const result = getWordRecognition(b) - getWordRecognition(a);

	if (result === 0) return azWordSort(a, b);
	return result;
}

export function combinedWordSort(a: Word, b: Word) {
	if (a.usage_category === b.usage_category) return azWordSort(a, b);
	return categoryIndex[a.usage_category] - categoryIndex[b.usage_category];
}

export function sortLanguages(languages: Record<string, Language>) {
	return Object.entries(languages).map(([id, language]) => ({
		...language,
		id
	}));
}

export function getWordRecognition(word: Word) {
	return word.usage['2025-09'] ?? -1;
}

export function getWordDisplayRecognition(word: Word) {
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

export function getUcsur(word: Word) {
	if (!word.representations?.ucsur) return '';

	return String.fromCodePoint(
		parseInt(word.representations.ucsur?.slice(2) ?? '', 16)
	);
}
