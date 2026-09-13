import { get } from 'svelte/store';

import { browser } from '$app/environment';

import type { Setting } from '.';

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

function prefersDark() {
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

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

export function createAppearance(setting: Setting) {
	const isTheme = (value: Theme) => themes.includes(value);

	const baseTheme = setting<Theme>('base-theme', 'light', isTheme);
	const darkTheme = setting<Theme>('dark-theme', 'dark', isTheme);
	const lightTheme = setting<Theme>('light-theme', 'light', isTheme);
	const systemTheme = setting<boolean>(
		'system-theme',
		true,
		(value) => typeof value === 'boolean'
	);

	const font = setting<Font>('font', 'font-sans', (value) =>
		fonts.includes(value)
	);

	if (browser) {
		baseTheme.subscribe((value) => {
			if (!get(systemTheme)) {
				changeTheme(value);
			}
		});

		lightTheme.subscribe((value) => {
			if (get(systemTheme) && !prefersDark()) {
				changeTheme(value);
			}
		});

		darkTheme.subscribe((value) => {
			if (get(systemTheme) && prefersDark()) {
				changeTheme(value);
			}
		});

		systemTheme.subscribe((value) => {
			const isDark = prefersDark();

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

		font.subscribe((value) => {
			if (document.documentElement.classList.contains(value)) {
				return;
			}

			for (const font of fonts) {
				document.documentElement.classList.toggle(font, value === font);
			}
		});
	}

	return { baseTheme, darkTheme, lightTheme, systemTheme, font };
}

type Appearance = ReturnType<typeof createAppearance>;

export function htmlAppearanceAttributes(appearance: Appearance): string {
	const font = get(appearance.font);

	if (get(appearance.systemTheme)) {
		return `class="${font}" data-light-theme="${get(appearance.lightTheme)}" data-dark-theme="${get(appearance.darkTheme)}"`;
	}
	return `class="${font} ${get(appearance.baseTheme)}"`;
}
