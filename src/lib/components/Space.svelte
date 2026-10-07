<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	const {
		children,
		href,
		...props
	}: HTMLAnchorAttributes & { href: string } = $props();
</script>

<a
	{href}
	class="relative interactable overflow-hidden p-4 text-left transition hover:scale-[1.02]"
	{...props}
	onclick={(e) => {
		e.preventDefault();
		if (props.onclick) {
			props.onclick(e);
		}
	}}
	tabindex="0"
>
	{@render children?.()}
</a>
