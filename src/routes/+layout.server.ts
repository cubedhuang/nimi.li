import { getLanguages } from '$lib/server/fetch';
import { SETTINGS_COOKIE } from '$lib/settings';

export async function load({ cookies, fetch, locals, platform }) {
	const languages = await getLanguages({ fetch, platform });

	return {
		lang: locals.lang,
		languages,
		settingsCookie: cookies.get(SETTINGS_COOKIE)
	};
}
