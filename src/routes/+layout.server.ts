import { getLanguages } from '$lib/server/fetch';

export async function load({ cookies, fetch, locals, platform }) {
	const languages = await getLanguages({ fetch, platform });
	if (!languages[locals.lang]) {
		cookies.set('lang', 'en', {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
			httpOnly: false,
			sameSite: 'lax'
		});
		locals.lang = 'en';
	}

	return { lang: locals.lang, languages };
}
