import type { Action } from 'svelte/action';

const events = ['click', 'mousedown', 'touchstart'] as const;

export const outclick: Action<
	HTMLElement,
	undefined,
	{ onoutclick: () => void }
> = (node) => {
	const handleClick = (event: MouseEvent | TouchEvent) => {
		if (!node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent('outclick'));
		}
	};

	for (const event of events) {
		document.addEventListener(event, handleClick, true);
	}

	return {
		destroy() {
			for (const event of events) {
				document.removeEventListener(event, handleClick, true);
			}
		}
	};
};
