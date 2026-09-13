import { getContext, setContext } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';

import { browser } from '$app/environment';

import type { UsageCategory } from '@kulupu-linku/sona/utils';

import { usageCategories } from '$lib/util';

import { createAppearance } from './appearance';
import { parseSettingsCookie, writeSettingsCookie } from './cookie';

export { SETTINGS_COOKIE, SETTINGS_COOKIE_OPTIONS } from './cookie';
export {
	htmlAppearanceAttributes,
	fonts,
	isDarkTheme,
	themes,
	type Font,
	type Theme
} from './appearance';

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

const isBoolean = (value: boolean) => typeof value === 'boolean';

export type Setting = <T>(
	key: string,
	initialValue: T,
	validator: (value: T) => boolean
) => Writable<T>;

export type Settings = ReturnType<typeof createSettings>;

export function createSettings(cookie: string | undefined) {
	const cookieValues = parseSettingsCookie(cookie);
	const stores: {
		key: string;
		store: Writable<unknown>;
		initialValue: unknown;
	}[] = [];

	function writeCookie() {
		const values: Record<string, unknown> = {};
		for (const { key, store, initialValue } of stores) {
			const value = get(store);
			// leave defaults out to keep the cookie small
			if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
				values[key] = value;
			}
		}
		writeSettingsCookie(values);
	}

	function setting<T>(
		key: string,
		initialValue: T,
		validator: (value: T) => boolean
	): Writable<T> {
		let value = cookieValues[key] ?? readLegacyStorage(key);
		try {
			if (!validator(value as T)) value = initialValue;
		} catch {
			value = initialValue;
		}

		const { subscribe, set } = writable(value as T);
		const store: Writable<T> = {
			subscribe,
			set(value) {
				set(value);
				writeCookie();
			},
			update(fn) {
				store.set(fn(get(store)));
			}
		};

		stores.push({ key, store, initialValue });
		return store;
	}

	// TODO: remove this after a while. this change was made 2026-09-13. remove
	// after maybe a month or two
	function readLegacyStorage(key: string): unknown {
		if (!browser || cookie !== undefined) return undefined;

		const storageKey = `nimi.li:${key}`;
		try {
			const json = localStorage.getItem(storageKey);
			localStorage.removeItem(storageKey);
			return json === null ? undefined : JSON.parse(json);
		} catch {
			return undefined;
		}
	}

	const settings = {
		...createAppearance(setting),

		categories: setting(
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
		sortingMethod: setting<SortingMethod>(
			'sortingMethod',
			'combined',
			(value) => sortingMethods.includes(value)
		),
		sitelenMode: setting<SitelenMode>('sitelenMode', 'pona', (value) =>
			sitelenModes.includes(value)
		),
		viewMode: setting<ViewMode>('viewMode', 'normal', (value) =>
			viewModes.includes(value)
		),
		screenWidth: setting<ScreenWidth>('screenWidth', 'large', (value) =>
			screenWidths.includes(value)
		),
		autoplay: setting('autoplay', false, isBoolean),
		// shown theme picker on second time opening
		nthTime: setting('nth-time', 0, (value) => typeof value === 'number'),
		// TODO: update key in 2027
		surveyBannerShown: setting('survey-2026-shown', true, isBoolean)
	};

	if (browser) {
		writeCookie();
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
