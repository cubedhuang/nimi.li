import { getContext, setContext } from 'svelte';

import { browser } from '$app/environment';

import type { UsageCategory } from '@kulupu-linku/sona/utils';

import { usageCategories } from '$lib/util';

import {
	applyAppearance,
	fonts,
	themes,
	type Font,
	type Theme
} from './appearance.svelte';
import { parseSettingsCookie, writeSettingsCookie } from './cookie';

export const sortingMethods = [
	'alphabetical',
	'recognition',
	'combined'
] as const;
export type SortingMethod = (typeof sortingMethods)[number];

export const sitelenModes = ['pona', 'sitelen', 'jelo', 'emosi'] as const;
export type SitelenMode = (typeof sitelenModes)[number];

export const viewModes = ['normal', 'detailed', 'compact', 'glyphs'] as const;
export type ViewMode = (typeof viewModes)[number];

export const screenWidths = ['full', 'large'] as const;
export type ScreenWidth = (typeof screenWidths)[number];

type Definition<T> = {
	key: string;
	initial: T;
	validate: (value: T) => boolean;
};

function define<T>(
	key: string,
	initial: T,
	validate: (value: T) => boolean
): Definition<T> {
	return { key, initial, validate };
}

const isBoolean = (value: boolean) => typeof value === 'boolean';
const isNumber = (value: number) => typeof value === 'number';
const isTheme = (value: Theme) => themes.includes(value);

const definitions = {
	baseTheme: define<Theme>('base-theme', 'light', isTheme),
	darkTheme: define<Theme>('dark-theme', 'dark', isTheme),
	lightTheme: define<Theme>('light-theme', 'light', isTheme),
	systemTheme: define<boolean>('system-theme', true, isBoolean),
	font: define<Font>('font', 'font-sans', (value) => fonts.includes(value)),

	categories: define(
		'categories',
		usageCategories
			.filter((category) => category !== 'sandbox')
			.map((category) => ({
				name: category as UsageCategory,
				shown: ['core', 'common'].includes(category)
			})),
		(value) =>
			Array.isArray(value) &&
			value.length === usageCategories.length - 1 &&
			value.every(
				(category) =>
					usageCategories.includes(category?.name) &&
					typeof category?.shown === 'boolean'
			) &&
			value.some(({ shown }) => shown)
	),
	sortingMethod: define<SortingMethod>('sortingMethod', 'combined', (value) =>
		sortingMethods.includes(value)
	),
	sitelenMode: define<SitelenMode>('sitelenMode', 'pona', (value) =>
		sitelenModes.includes(value)
	),
	viewMode: define<ViewMode>('viewMode', 'normal', (value) =>
		viewModes.includes(value)
	),
	screenWidth: define<ScreenWidth>('screenWidth', 'large', (value) =>
		screenWidths.includes(value)
	),
	autoplay: define<boolean>('autoplay', false, isBoolean),

	// shown theme picker on second time opening
	nthTime: define<number>('nth-time', 0, isNumber),
	// TODO: update key in 2027
	surveyBannerShown: define<boolean>('survey-2026-shown', true, isBoolean)
};

type Definitions = typeof definitions;
export type Settings = {
	[K in keyof Definitions]: Definitions[K] extends Definition<infer T>
		? T
		: never;
};

// TODO: remove this after a while. this change was made 2026-09-13. remove
// after maybe a month or two
function readLegacyStorage(key: string): unknown {
	const storageKey = `nimi.li:${key}`;
	try {
		const json = localStorage.getItem(storageKey);
		localStorage.removeItem(storageKey);
		return json === null ? undefined : JSON.parse(json);
	} catch {
		return undefined;
	}
}

function readSettings(cookie: string | undefined): Settings {
	const values = parseSettingsCookie(cookie);
	const migrate = browser && cookie === undefined;
	const settings: Record<string, unknown> = {};

	for (const [name, { key, initial, validate }] of Object.entries(
		definitions
	)) {
		let value =
			values[key] ?? (migrate ? readLegacyStorage(key) : undefined);
		try {
			if (!validate(value as never)) value = initial;
		} catch {
			value = initial;
		}
		settings[name] = value;
	}

	return settings as Settings;
}

function toCookieValues(settings: Settings): Record<string, unknown> {
	const values: Record<string, unknown> = {};

	for (const [name, { key, initial }] of Object.entries(definitions)) {
		const value = settings[name as keyof Settings];

		// leave defaults out to keep the cookie small
		if (JSON.stringify(value) !== JSON.stringify(initial)) {
			values[key] = value;
		}
	}

	return values;
}

export function createSettings(cookie: string | undefined): Settings {
	const settings = $state(readSettings(cookie));

	if (browser) {
		$effect(() => {
			writeSettingsCookie(toCookieValues($state.snapshot(settings)));
		});
		applyAppearance(settings);
	}

	return settings;
}

const SETTINGS_CONTEXT = Symbol('settings');

export function initSettings(cookie: string | undefined): Settings {
	const settings = createSettings(cookie);
	setContext(SETTINGS_CONTEXT, settings);
	return settings;
}

export function getSettings(): Settings {
	return getContext(SETTINGS_CONTEXT);
}
