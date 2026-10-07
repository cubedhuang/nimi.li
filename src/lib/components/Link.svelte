<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	const { children, href, ...props }: HTMLAnchorAttributes = $props();
</script>

<a
	{href}
	target={!href || href.startsWith('/') || href.startsWith('#')
		? undefined
		: '_blank'}
	rel="noopener noreferrer"
	class="link"
	{...props}
>
	{@render children?.()}
</a>
