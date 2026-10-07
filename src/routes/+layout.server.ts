import { getLanguages } from '#lib/server/fetch.js';
import { SETTINGS_COOKIE } from '#lib/settings/index.js';

export async function load({ cookies, fetch, locals }) {
	const languages = await getLanguages({ fetch });

	return {
		lang: locals.lang,
		languages,
		settingsCookie: cookies.get(SETTINGS_COOKIE)
	};
}
