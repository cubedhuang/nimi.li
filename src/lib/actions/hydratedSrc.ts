import type { Action } from 'svelte/action';

/**
 * fixes a weird svelte hydration issue where `src` isn't updated
 * between the server-sent html and the client-side hydrated component,
 * by forcing the src to change on page load
 */
export const hydratedSrc: Action<HTMLImageElement, string | undefined> = (
	node,
	src
) => {
	function sync(value: string | undefined) {
		if (value !== undefined && node.getAttribute('src') !== value) {
			node.setAttribute('src', value);
		}
	}
	sync(src);
	return { update: sync };
};
