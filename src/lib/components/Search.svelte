<script lang="ts">
	import { onMount } from 'svelte';

	import MagnifyingGlassIcon from './icons/MagnifyingGlassIcon.svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		placeholder: string;
		value: string;
		count: number;
		total: number;
	}

	let { placeholder, value = $bindable(''), count, total }: Props = $props();

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
	onkeydown={(e) => {
		if (e.ctrlKey || e.metaKey || e.altKey) {
			return;
		}

		if (searchBar === document.activeElement && e.key === 'Escape') {
			value = '';
			searchBar.blur();
		} else if (
			e.key === '/' ||
			(/^[a-z]$/i.test(e.key) && document.activeElement === document.body)
		) {
			if (e.key === '/') {
				e.preventDefault();
			}
			searchBar.focus();
		}
	}}
/>

<div
	bind:this={div}
	class="content full sticky -top-px -mt-2 box-content border-b-2 pt-2.25 pb-1.5
		{!stick
		? 'border-transparent bg-transparent'
		: 'z-50 border-border bg-background shadow-md'}"
>
	<div class="relative">
		<MagnifyingGlassIcon
			class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
			aria-hidden="true"
		/>

		<input
			type="search"
			{placeholder}
			bind:value
			bind:this={searchBar}
			class="w-full focusable cursor-auto py-2 pl-10 placeholder:text-muted
			{value ? 'pr-26' : 'pr-20'}"
		/>

		<div
			class="absolute top-1/2 right-3 flex -translate-y-1/2 items-center"
		>
			<span class="pointer-events-none text-muted select-none">
				{count} / {total}
			</span>

			{#if value}
				<button
					transition:slide={{ axis: 'x', duration: 150 }}
					class="ml-1 cursor-pointer rounded p-0.5 text-muted transition-colors hv:text-foreground"
					onclick={() => {
						value = '';
						searchBar.focus();
					}}
					aria-label="clear search"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="size-4"
					>
						<path
							d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"
						/>
					</svg>
				</button>
			{/if}
		</div>
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
