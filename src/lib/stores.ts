import { writable, get, type Writable } from 'svelte/store';

import { browser } from '$app/environment';

import { usageCategories } from './util';
import type { UsageCategory } from '@kulupu-linku/sona/utils';

function persisted<T>(
	key: string,
	initialValue: T,
	validator?: (value: T) => boolean
): Writable<T> {
	key = `nimi.li:${key}`;

	const { subscribe, set, update } = writable(initialValue);

	if (browser) {
		const json = localStorage.getItem(key);

		if (json !== null) {
			let parsed: T | null;

			try {
				parsed = JSON.parse(json);
			} catch {
				parsed = null;
			}

			if (parsed !== null && (!validator || validator(parsed))) {
				set(parsed);
			}
		}
	}

	return {
		subscribe,
		set(value: T) {
			if (browser) {
				localStorage.setItem(key, JSON.stringify(value));
			}
			set(value);
		},
		update
	};
}

export const themes = [
	'light',
	'orange',
	'dark',
	'stone',
	'pink',
	'purple',
	'blue',
	'green',
	'red',
	'emerald',
	'dim',
	'indigo'
] as const;
export type Theme = (typeof themes)[number];
export const baseTheme = persisted<Theme>('base-theme', 'light', value =>
	themes.includes(value)
);
export const darkTheme = persisted<Theme>('dark-theme', 'dark', value =>
	themes.includes(value)
);
export const lightTheme = persisted<Theme>('light-theme', 'light', value =>
	themes.includes(value)
);
export const systemTheme = persisted<boolean>('system-theme', true);

export function isDarkTheme(theme: Theme): boolean {
	const darkThemes: Theme[] = [
		'dark',
		'stone',
		'red',
		'emerald',
		'dim',
		'indigo'
	]

	return darkThemes.includes(theme);
}

export const fonts = [
	'font-sans',
	'font-serif',
	'font-mono',
	'font-dyslexic',
	'font-atkinson'
] as const;
export type Font = (typeof fonts)[number];
export const font = persisted<Font>('font', 'font-sans', value =>
	fonts.includes(value)
);

function changeTheme(value: Theme) {
	if (document.documentElement.classList.contains(value)) {
		return;
	}

	document.documentElement.classList.add('no-transition');

	for (const theme of themes) {
		document.documentElement.classList.toggle(theme, value === theme);
	}

	// Force a reflow to make sure the transition is triggered
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	document.documentElement.offsetWidth;

	document.documentElement.classList.remove('no-transition');
}

if (browser) {
	baseTheme.subscribe(value => {
		if (!get(systemTheme)) {
			changeTheme(value);
		}
	});

	lightTheme.subscribe(value => {
		const isDark = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches;

		if (
			get(systemTheme) &&
			!isDark
		) {
			changeTheme(value);
		}
	});

	darkTheme.subscribe(value => {
		const isDark = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches;

		if (
			get(systemTheme) &&
			isDark
		) {
			changeTheme(value);
		}
	});

	systemTheme.subscribe(value => {
		const isDark = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches;

		if (value) {
			// when switching to system theme, transfer last picked color from baseTheme
			if (isDarkTheme(get(baseTheme))) {
				darkTheme.set(get(baseTheme));
			} else {
				lightTheme.set(get(baseTheme));
			}

			if (isDark) {
				changeTheme(get(darkTheme));
			} else {
				changeTheme(get(lightTheme));
			}
		} else {
			// when switching to single theme, make sure it's one of the two chosen system themes
			if (
				get(baseTheme) != get(darkTheme) && 
				get(baseTheme) != get(lightTheme)
			) {
				if (isDark) {
					baseTheme.set(get(darkTheme));
				} else {
					baseTheme.set(get(lightTheme));
				}
			}

			changeTheme(get(baseTheme));
		}
	});

	font.subscribe(value => {
		if (document.documentElement.classList.contains('value')) {
			return;
		}

		for (const font of fonts) {
			document.documentElement.classList.toggle(font, value === font);
		}
	});
}

export const categories = persisted(
	'categories',
	usageCategories
		.filter(u => u !== 'sandbox')
		.map(category => ({
			name: category as UsageCategory,
			shown: ['core', 'common'].includes(category)
		})),
	value =>
		value.some(({ shown }) => shown) &&
		value.length === usageCategories.length - 1
);

export const sortingMethod = persisted<
	'alphabetical' | 'recognition' | 'combined'
>('sortingMethod', 'combined');

export const language = persisted(
	'language',
	'en',
	lang => lang !== 'eng' // removes Definition Rework language
);

export const sitelenMode = persisted<'pona' | 'sitelen' | 'jelo' | 'emosi'>(
	'sitelenMode',
	'pona'
);

export const viewMode = persisted<'normal' | 'detailed' | 'compact' | 'glyphs'>(
	'viewMode',
	'normal'
);

export const screenWidth = persisted<'full' | 'large'>('screenWidth', 'large');

export const autoplay = persisted('autoplay', false);
