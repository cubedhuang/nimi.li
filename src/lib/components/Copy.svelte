<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	interface Props {
		value: string;
	}

	const { value }: Props = $props();

	let copied = $state(false);

	// ESLint doesn't recognize NodeJS.Timeout
	// eslint-disable-next-line no-undef
	let timeout = $state<NodeJS.Timeout | undefined>();
</script>

<button
	class="relative flex interactable justify-center overflow-visible p-1"
	aria-label="copy ucsur"
	onclick={() => {
		navigator.clipboard.writeText(value);

		copied = true;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			copied = false;
		}, 300);
	}}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="h-6 w-6"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
		/>
	</svg>

	{#if copied}
		<div
			in:fly={{ y: 4, duration: 150 }}
			out:fade={{ duration: 150 }}
			class="absolute bottom-full z-10 mb-1 w-max text-xs"
		>
			copied!
		</div>
	{/if}
</button>
