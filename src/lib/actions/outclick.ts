import type { Action } from 'svelte/action';

export const outclick: Action<
	HTMLElement,
	undefined,
	{ onoutclick: () => void }
> = node => {
	const handleClick = (event: MouseEvent | TouchEvent) => {
		if (!node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent('outclick'));
		}
	};

	document.addEventListener('click', handleClick, true);
	document.addEventListener('touchstart', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
			document.removeEventListener('touchstart', handleClick, true);
		}
	};
};
