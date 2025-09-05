<script lang="ts">
	import { slide } from 'svelte/transition';

	import type { LocalizedWord } from '@kulupu-linku/sona';
	import type { Book } from '@kulupu-linku/sona/utils';

	import { outclick } from '$lib/actions/outclick';
	import { bookColors, categoryColors } from '$lib/util';
	import { categories, sortingMethod } from '$lib/stores';
	import { flyAndScale } from '$lib/transitions';

	import ColoredCheckbox from '$lib/components/ColoredCheckbox.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import WordView from '$lib/components/WordView.svelte';

	const { data } = $props();

	let moreOptions = $state(false);

	let search = $state('');

	let books = $state(
		Object.keys(bookColors).map((book) => ({
			name: book as Book,
			shown: true
		}))
	);

	const words = $derived(Object.values(data.words));

	const shownCategories = $derived(
		$categories
			.filter((category) => category.shown)
			.map((category) => category.name)
	);

	const shownBooks = $derived(
		books.filter((book) => book.shown).map((book) => book.name)
	);

	function genericFilter(word: LocalizedWord) {
		return (
			shownCategories.includes(word.usage_category) &&
			shownBooks.includes(word.book)
		);
	}

	const genericFilteredWords = $derived(words.filter(genericFilter));
</script>

<Meta
	title="nimi.li | Toki Pona Dictionary"
	description="Comprehensive Toki Pona dictionary with interactive search, detailed word information, and multiple writing systems."
	url="https://nimi.li/"
/>

<h1 class="text-4xl">nimi.li</h1>

<p class="mt-2">
	<b>nimi.li</b> is an interactive Toki Pona dictionary. Click on a word to read
	more!
</p>

<div
	use:outclick
	onoutclick={() => {
		moreOptions = false;
	}}
	class="mb-2"
>
	<div class="mt-4 flex flex-wrap gap-1">
		{#each $categories as category (category.name)}
			<ColoredCheckbox
				bind:checked={category.shown}
				label={category.name[0].toUpperCase() + category.name.slice(1)}
				color={categoryColors[category.name]}
			/>
		{/each}

		<div class="relative flex justify-center">
			<button
				onclick={() => {
					moreOptions = !moreOptions;
				}}
				class="interactable p-0.5 md:block"
				class:hidden={moreOptions}
				aria-label="more options"
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
						d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
					/>
				</svg>
			</button>

			{#if moreOptions}
				<div
					transition:flyAndScale={{ y: -4 }}
					class="absolute top-full z-10 mt-2 hidden w-max flex-wrap gap-1 rounded-lg border-2 bg-card p-2 shadow-md
						md:flex"
				>
					{#each books as book (book.name)}
						<ColoredCheckbox
							bind:checked={book.shown}
							label={book.name === 'none'
								? 'no book'
								: `nimi ${book.name}`}
							color={bookColors[book.name]}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	{#if moreOptions}
		<div
			class="mt-2 flex items-start justify-between gap-1 rounded-lg border-2 bg-card p-2
				md:hidden"
			transition:slide
		>
			<div class="flex flex-wrap gap-1">
				{#each books as book (book.name)}
					<ColoredCheckbox
						bind:checked={book.shown}
						label={book.name === 'none'
							? 'no book'
							: `nimi ${book.name}`}
						color={bookColors[book.name]}
					/>
				{/each}
			</div>

			<button
				onclick={() => {
					moreOptions = false;
				}}
				class="shrink-0 interactable p-0.5"
				aria-label="close options"
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
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	{/if}
</div>

<WordView
	bind:search
	words={genericFilteredWords}
	lipamanka={data.lipamanka}
	languages={data.languages}
	bind:sortingMethod={$sortingMethod}
	revealWord={(referred) => {
		$categories = $categories.map((category) => ({
			...category,
			shown:
				category.shown ||
				category.name === data.words[referred].usage_category
		}));
		books = books.map((book) => ({
			...book,
			shown: book.shown || book.name === data.words[referred].book
		}));
	}}
/>
