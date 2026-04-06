import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	const langParam = event.url.searchParams.get('lang');
	if (langParam) {
		event.cookies.set('lang', langParam, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
			httpOnly: false,
			sameSite: 'lax'
		});

		const url = new URL(event.url);
		url.searchParams.delete('lang');
		throw redirect(302, url.pathname + url.search);
	}

	const lang =
		event.cookies.get('lang') ??
		event.request.headers
			.get('accept-language')
			?.split(',')[0]
			?.slice(0, 2) ??
		'en';

	event.locals.lang = lang;

	return resolve(event);
}
