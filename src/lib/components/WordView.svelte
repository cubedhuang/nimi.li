<script lang="ts">
	import { tick } from 'svelte';
	import type { Word } from '@kulupu-linku/sona';

	import { focusFirstElement } from '$lib/actions/focusFirstElement';
	import { filter } from '$lib/search';
	import {
		categories,
		sitelenMode,
		type SortingMethod,
		viewMode
	} from '$lib/stores';
	import {
		azWordSort,
		recognitionWordSort,
		combinedWordSort
	} from '$lib/util';

	import Select from './Select.svelte';

	import WordGlyphEntry from './word-view/WordGlyphEntry.svelte';
	import WordEntry from './word-view/WordEntry.svelte';
	import WordSpace from './word-view/WordSpace.svelte';
	import WordSpaceDetailed from './word-view/WordSpaceDetailed.svelte';
	import Search from './Search.svelte';
	import WordDetails from './WordDetails.svelte';
	import { outclick } from '$lib/actions/outclick';
	import type { Book } from '@kulupu-linku/sona/utils';
	import { flyAndScale } from '$lib/transitions';
	import { slide } from 'svelte/transition';
	import PillToggle from './PillToggle.svelte';
	import EllipsisHorizontalIconMicro from './icons/EllipsisHorizontalIconMicro.svelte';
	import ViewColumnsIconMicro from './icons/ViewColumnsIconMicro.svelte';
	import BarsArrowDownIconMicro from './icons/BarsArrowDownIconMicro.svelte';
	import PencilIconMicro from './icons/PencilIconMicro.svelte';

	interface Props {
		search?: string;
		words: Word[];
		books?: { name: Book; shown: boolean }[];
		lipamanka?: Record<string, string>;
		sortingMethod?: SortingMethod;
		revealWord: (word: string) => void;
		isSandbox?: boolean;
	}

	let {
		search = $bindable(''),
		words = $bindable(),
		books = $bindable(),
		lipamanka,
		sortingMethod = $bindable('alphabetical'),
		revealWord,
		isSandbox
	}: Props = $props();

	const shownCategories = $derived(
		$categories
			.filter((category) => category.shown)
			.map((category) => category.name)
	);

	const shownBooks = $derived(
		books?.filter((book) => book.shown).map((book) => book.name)
	);

	function genericFilter(word: Word) {
		return (
			shownCategories.includes(word.usage_category) &&
			(!shownBooks || shownBooks.includes(word.book))
		);
	}

	const genericFilteredWords = $derived(
		isSandbox ? words : words.filter(genericFilter)
	);

	let moreOptions = $state(false);
	let selectedWord = $state<Word | null>(null);

	function selectWord(word: Word) {
		if (selectedWord?.id === word.id) selectedWord = null;
		else selectedWord = word;
	}

	const genericSorter = $derived(
		sortingMethod === 'alphabetical'
			? azWordSort
			: sortingMethod === 'recognition'
				? recognitionWordSort
				: combinedWordSort
	);

	// TODO: restore missing definitions alert

	const sortedWords = $derived(genericFilteredWords.toSorted(genericSorter));
	const filteredWords = $derived(filter(sortedWords, search));
</script>

<Search
	placeholder="o alasa..."
	bind:value={search}
	count={filteredWords.length}
	total={genericFilteredWords.length}
/>

<div class="mb-2 flex flex-wrap gap-2">
	{#if !isSandbox}
		<div
			use:outclick
			onoutclick={() => {
				moreOptions = false;
			}}
			class="mr-auto"
		>
			<div class="flex flex-wrap gap-1">
				{#each $categories as category (category.name)}
					<PillToggle
						bind:checked={category.shown}
						label={category.name}
						category={category.name}
					/>
				{/each}

				<div class="relative flex justify-center">
					<button
						onclick={() => {
							moreOptions = !moreOptions;
						}}
						class="interactable p-1 sm:block"
						class:hidden={moreOptions}
						aria-label="more options"
					>
						<EllipsisHorizontalIconMicro />
					</button>

					{#if moreOptions}
						<div
							transition:flyAndScale={{ y: -4 }}
							class="absolute top-full z-10 mt-2 hidden w-max flex-wrap gap-1 rounded-lg border-2 bg-card p-2 shadow-md
								sm:flex"
						>
							{#each books as book (book.name)}
								<PillToggle
									bind:checked={book.shown}
									label={book.name === 'none'
										? 'no book'
										: `nimi ${book.name}`}
									category={book.name}
								/>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			{#if moreOptions}
				<div
					class="mt-2 flex items-start justify-between gap-1 rounded-lg border-2 bg-card p-2
						sm:hidden"
					transition:slide
				>
					<div class="flex flex-wrap gap-1">
						{#each books as book (book.name)}
							<PillToggle
								bind:checked={book.shown}
								label={book.name === 'none'
									? 'no book'
									: `nimi ${book.name}`}
								category={book.name}
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
	{/if}

	<div class="flex flex-wrap gap-1">
		<Select
			name="View"
			Icon={ViewColumnsIconMicro}
			options={[
				{ label: 'Grid', value: 'normal' },
				{ label: 'Detailed', value: 'detailed' },
				{ label: 'List', value: 'compact' },
				{ label: 'Glyphs', value: 'glyphs' }
			]}
			bind:value={$viewMode}
			class="w-36 shrink-0"
		/>

		<Select
			name="Sorting Method"
			Icon={BarsArrowDownIconMicro}
			options={[
				!isSandbox
					? { label: 'A-Z by Usage', value: 'combined' }
					: null,
				{ label: 'Alphabetical', value: 'alphabetical' },
				{ label: 'Usage', value: 'recognition' }
			].filter((o) => o !== null)}
			bind:value={sortingMethod}
			class="w-44 shrink-0"
		/>

		<Select
			name="sitelen type"
			Icon={PencilIconMicro}
			options={[
				{ label: 'sitelen pona', value: 'pona' },
				{ label: 'sitelen sitelen', value: 'sitelen' },
				{ label: 'sitelen jelo', value: 'jelo' },
				{ label: 'sitelen Emosi', value: 'emosi' }
			]}
			bind:value={$sitelenMode}
			class="w-44 shrink-0"
		/>
	</div>
</div>

<!-- {#if missingDefinitions}
	<p class="mt-2">
		<strong>o sona a!</strong>
		{languages[$language].name.tok ?? languages[$language].name.en}
		la sona pi nimi ale li lon ala. toki Inli li lon nimi ni.
	</p>
	<p>
		<strong>Warning!</strong>
		Some words are missing {languages[$language].name.en} translations. These
		are replaced with English translations.
	</p>
{/if} -->

{#if $viewMode === 'compact'}
	<div class="grid">
		{#each filteredWords as word (word.id)}
			<WordEntry {word} onclick={() => selectWord(word)} />
		{/each}
	</div>
{:else if $viewMode === 'glyphs'}
	<div class="grid grid-cols-fill-28 gap-1">
		{#each filteredWords as word (word.id)}
			<WordGlyphEntry {word} onclick={() => selectWord(word)} />
		{/each}
	</div>
{:else if $viewMode === 'detailed'}
	<div class="grid grid-cols-fill-96 gap-2">
		{#each filteredWords as word (word.id)}
			<WordSpaceDetailed {word} onclick={() => selectWord(word)} />
		{/each}
	</div>
{:else}
	<div class="grid grid-cols-fill-64 gap-2">
		{#each filteredWords as word (word.id)}
			<WordSpace {word} onclick={() => selectWord(word)} />
		{/each}
	</div>
{/if}

{#if !filteredWords.length}
	<p>wile sina la, nimi li lon ala!</p>
	<p class="text-muted">Your query didn't match any words!</p>
{/if}

<WordDetails
	bind:word={selectedWord}
	lipamanka={lipamanka?.[selectedWord?.id ?? '']}
	onrefer={(referred) => {
		if (!filteredWords.some((word) => word.id === referred)) {
			search = '';

			revealWord(referred);
		}
	}}
	onclose={async (id) => {
		if (!filteredWords.some((word) => word.id === id)) {
			search = '';
			revealWord(id);
			await tick();
		}
		let element = document.getElementById(id);
		if (element) {
			focusFirstElement(element);
		}
	}}
/>
