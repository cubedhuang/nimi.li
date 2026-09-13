import { untrack } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';

import type { Settings } from './settings.svelte';

export const themes = [
	'light',
	'orange',
	'amoled',
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

const darkThemes: Theme[] = [
	'amoled',
	'dark',
	'stone',
	'red',
	'emerald',
	'dim',
	'indigo'
];

export function isDarkTheme(theme: Theme): boolean {
	return darkThemes.includes(theme);
}

export const fonts = [
	'font-sans',
	'font-serif',
	'font-iosevka',
	'font-mono',
	'font-dyslexic',
	'font-atkinson'
] as const;
export type Font = (typeof fonts)[number];

function viewTransition(fn: () => void) {
	if (
		document.startViewTransition as
			| undefined
			| typeof document.startViewTransition
	) {
		document.startViewTransition(() => {
			fn();
		});
	} else {
		fn();
	}
}

function changeTheme(value: Theme) {
	if (document.documentElement.classList.contains(value)) {
		return;
	}

	viewTransition(() => {
		document.documentElement.classList.add('no-transition');

		for (const theme of themes) {
			document.documentElement.classList.toggle(theme, value === theme);
		}

		// Force a reflow to make sure no element-specific transitions are triggered
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		document.documentElement.offsetWidth;

		document.documentElement.classList.remove('no-transition');
	});
}

export function applyAppearance(settings: Settings) {
	const prefersDark = new MediaQuery('(prefers-color-scheme: dark)');

	$effect(() => {
		const system = settings.systemTheme;

		untrack(() => {
			if (system) {
				if (isDarkTheme(settings.baseTheme)) {
					settings.darkTheme = settings.baseTheme;
				} else {
					settings.lightTheme = settings.baseTheme;
				}
			} else if (
				settings.baseTheme !== settings.darkTheme &&
				settings.baseTheme !== settings.lightTheme
			) {
				settings.baseTheme = prefersDark.current
					? settings.darkTheme
					: settings.lightTheme;
			}
		});
	});

	$effect(() => {
		changeTheme(
			settings.systemTheme
				? prefersDark.current
					? settings.darkTheme
					: settings.lightTheme
				: settings.baseTheme
		);
	});

	$effect(() => {
		for (const font of fonts) {
			document.documentElement.classList.toggle(
				font,
				settings.font === font
			);
		}
	});
}

export function htmlAppearanceAttributes(settings: Settings): string {
	if (settings.systemTheme) {
		return `class="${settings.font}" data-light-theme="${settings.lightTheme}" data-dark-theme="${settings.darkTheme}"`;
	}
	return `class="${settings.font} ${settings.baseTheme}"`;
}
