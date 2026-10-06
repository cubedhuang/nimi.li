import { redirect } from '@sveltejs/kit';

import { getLanguages } from '$lib/server/fetch';
import { negotiateLanguage } from '$lib/server/language';
import {
	SETTINGS_COOKIE,
	SETTINGS_COOKIE_OPTIONS,
	htmlAppearanceAttributes,
	createSettings
} from '$lib/settings';

export async function handle({ event, resolve }) {
	let langParam: string | null = null;
	try {
		langParam = event.url.searchParams.get('lang');
	} catch {
		// weird hack. sveltekit runs the hook on every page during build even
		// if not prerendered.
	}
	if (langParam) {
		event.cookies.set('lang', langParam, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
			httpOnly: false,
			sameSite: 'lax'
		});

		const url = new URL(event.url);
		url.searchParams.delete('lang');
		throw redirect(302, url.href);
	}

	const languages = await getLanguages(event);

	let cookieLang = event.cookies.get('lang');
	if (cookieLang !== undefined && !Object.hasOwn(languages, cookieLang)) {
		event.cookies.delete('lang', { path: '/' });
		cookieLang = undefined;
	}
	event.locals.lang =
		cookieLang ??
		negotiateLanguage(
			event.request.headers.get('accept-language'),
			languages
		) ??
		'en';

	const settingsCookie = event.cookies.get(SETTINGS_COOKIE);
	if (settingsCookie !== undefined) {
		event.cookies.set(
			SETTINGS_COOKIE,
			settingsCookie,
			SETTINGS_COOKIE_OPTIONS
		);
	}
	const settings = createSettings(settingsCookie);

	// crazy hack to get the attributes onto the html
	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('<html', `<html ${htmlAppearanceAttributes(settings)}`)
	});
}
