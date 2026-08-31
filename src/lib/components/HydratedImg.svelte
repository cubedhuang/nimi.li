<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	let { src, ...props }: HTMLImgAttributes & { src: string | undefined } =
		$props();

	// https://svelte.dev/docs/svelte/runtime-warnings#Client-warnings-hydration_attribute_changed
	// fixes a weird svelte hydration issue where `src` isn't updated
	// between the server-sent html and the client-side hydrated component,
	// by forcing the src to change on page load
	if (typeof window !== 'undefined') {
		// eslint-disable-next-line svelte/no-unused-svelte-ignore -- for some reason the rule is ignored both ways
		// svelte-ignore state_referenced_locally
		const initial = src;
		src = undefined;
		$effect(() => {
			src = initial;
		});
	}
</script>

<img {src} {...props} />
