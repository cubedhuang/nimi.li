<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	const { src, ...props }: HTMLImgAttributes = $props();

	let img: HTMLImageElement;

	// https://svelte.dev/docs/svelte/runtime-warnings#Client-warnings-hydration_attribute_changed
	// fixes a weird svelte hydration issue where `src` isn't updated
	// between the server-sent html and the client-side hydrated component,
	// by forcing the src to change on page load if the new one is different
	$effect(() => {
		if (
			src !== undefined &&
			src !== null &&
			img.getAttribute('src') !== src
		) {
			img.setAttribute('src', src);
		}
	});
</script>

<!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -- the rule only knows about compile-time warnings -->
<!-- svelte-ignore hydration_attribute_changed -->
<img bind:this={img} {src} {...props} />
