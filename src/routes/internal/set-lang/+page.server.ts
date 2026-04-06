import type { Actions } from './$types';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const lang = data.get('lang');

		if (typeof lang === 'string') {
			cookies.set('lang', lang, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365,
				httpOnly: false,
				sameSite: 'lax'
			});
		}
	}
} satisfies Actions;
