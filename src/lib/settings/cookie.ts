import { browser } from '$app/environment';

export const SETTINGS_COOKIE = 'settings';

export const SETTINGS_COOKIE_OPTIONS = {
	path: '/',
	maxAge: 60 * 60 * 24 * 365,
	httpOnly: false,
	sameSite: 'lax'
} as const;

export function parseSettingsCookie(
	raw: string | undefined
): Record<string, unknown> {
	if (!raw) return {};

	try {
		const parsed: unknown = JSON.parse(raw);
		return parsed !== null && typeof parsed === 'object'
			? (parsed as Record<string, unknown>)
			: {};
	} catch {
		return {};
	}
}

export function writeSettingsCookie(values: Record<string, unknown>) {
	if (!browser) return;

	const { path, maxAge, sameSite } = SETTINGS_COOKIE_OPTIONS;
	document.cookie =
		`${SETTINGS_COOKIE}=${encodeURIComponent(JSON.stringify(values))}` +
		`; path=${path}; max-age=${maxAge}; samesite=${sameSite}`;
}
