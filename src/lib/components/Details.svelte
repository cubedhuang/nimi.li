<script lang="ts" generics="T">
	/* eslint no-undef: off */

	import type { Snippet } from 'svelte';

	import { flyAndScale } from '$lib/transitions';

	interface Props {
		value: T | null;
		key: (value: T) => string;
		padding?: boolean;
		children: Snippet<[T]>;
	}

	let {
		value = $bindable(),
		key,
		padding = true,
		children
	}: Props = $props();
</script>

<svelte:window
	onkeydown={e => {
		if (e.key === 'Escape') value = null;
	}}
/>

{#if value}
	<div
		class="fixed bottom-0 right-0 z-20 w-full md:top-0 md:w-0"
		transition:flyAndScale|local={{ y: 16, start: 0.975 }}
	>
		{#key key(value)}
			<div
				transition:flyAndScale|local={{ y: 16, start: 0.975 }}
				class="absolute bottom-0 left-0 right-0 max-h-[75vh] overflow-y-auto border-t border-contrast bg-card shadow-md
					md:bottom-4 md:left-auto md:right-4 md:max-h-[min(40rem,100vh-2rem)] md:w-144 md:rounded-lg md:border"
				class:p-6={padding}
			>
				{@render children(value)}
			</div>
		{/key}
	</div>
{/if}
