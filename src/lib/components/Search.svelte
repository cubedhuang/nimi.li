<script lang="ts">
	import { onMount } from 'svelte';

	import XMark from './icons/XMark.svelte';

	interface Props {
		placeholder: string;
		value: string;
	}

	let { placeholder, value = $bindable('') }: Props = $props();

	let div: HTMLDivElement;
	let searchBar: HTMLInputElement;
	let stick = $state(false);

	onMount(() => {
		searchBar?.focus();

		const observer = new IntersectionObserver(
			([e]) => (stick = e.intersectionRatio < 1),
			{ threshold: [1] }
		);
		observer.observe(div);

		return () => observer.disconnect();
	});
</script>

<svelte:window
	onkeydown={e => {
		if (e.ctrlKey || e.metaKey || e.altKey) {
			return;
		}

		if (searchBar === document.activeElement && e.key === 'Escape') {
			value = '';
			searchBar.blur();
		} else if (/^[a-z]$/i.test(e.key)) {
			searchBar.focus();
		}
	}}
/>

<div
	bind:this={div}
	class="content full sticky -top-px z-10 -mb-2 -mt-2 box-content pb-2 pt-[9px] transition
		{!stick ? 'bg-transparent' : 'bg-card shadow-md ring-1 ring-border'}"
>
	<div class="flex items-center gap-1">
		<input
			type="search"
			{placeholder}
			bind:value
			bind:this={searchBar}
			class="focusable w-96 max-w-full cursor-auto px-4 py-2 placeholder:text-muted"
		/>

		{#if value}
			<button
				class="interactable shrink-0 p-2"
				onclick={() => {
					value = '';
					searchBar.focus();
				}}
				aria-label="clear search"
			>
				<XMark />
			</button>
		{/if}
	</div>
</div>

<style lang="postcss">
	input[type='search']::-webkit-search-decoration,
	input[type='search']::-webkit-search-cancel-button,
	input[type='search']::-webkit-search-results-button,
	input[type='search']::-webkit-search-results-decoration {
		@apply hidden;
	}
</style>
