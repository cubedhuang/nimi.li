<script lang="ts">
	import { slide } from 'svelte/transition';

	import type { LocalizedWord } from '@kulupu-linku/sona';
	import type { Book } from '@kulupu-linku/sona/utils';

	import { outclick } from '$lib/actions/outclick';
	import {
		azWordSort,
		bookColors,
		categoryColors,
		combinedWordSort,
		recognitionWordSort
	} from '$lib/util';
	import { filter } from '$lib/search';
	import {
		categories,
		language,
		sitelenMode,
		sortingMethod,
		viewMode
	} from '$lib/stores';
	import { flyAndScale } from '$lib/transitions';

	import ColoredCheckbox from '$lib/components/ColoredCheckbox.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import Search from '$lib/components/Search.svelte';
	import Select from '$lib/components/Select.svelte';
	import SelectLanguage from '$lib/components/SelectLanguage.svelte';
	import WordDetails from '$lib/components/WordDetails.svelte';
	import WordView from '$lib/components/WordView.svelte';

	const { data } = $props();

	let moreOptions = $state(false);

	let search = $state('');
	let selectedWord = $state<LocalizedWord | null>(null);

	let books = $state(
		Object.keys(bookColors).map(book => ({
			name: book as Book,
			shown: true
		}))
	);

	let fetchedTranslations = $state(['en']);

	async function fetchTranslation(lang: string) {
		const words = (await fetch(`/internal/api/linku?lang=${lang}`).then(
			res => res.json()
		)) as Record<string, LocalizedWord>;

		for (const word of Object.values(words)) {
			data.words[word.id].translations[lang] = word.translations[lang];
		}

		fetchedTranslations.push(lang);

		// forces invalidation
		$language = '';
		$language = lang;
	}

	const words = $derived(Object.values(data.words));

	const shownCategories = $derived(
		$categories
			.filter(category => category.shown)
			.map(category => category.name)
	);

	const shownBooks = $derived(
		books.filter(book => book.shown).map(book => book.name)
	);

	const genericSorter = $derived(
		$sortingMethod === 'alphabetical'
			? azWordSort
			: $sortingMethod === 'recognition'
				? recognitionWordSort
				: combinedWordSort
	);

	function genericFilter(word: LocalizedWord) {
		return (
			shownCategories.includes(word.usage_category) &&
			shownBooks.includes(word.book)
		);
	}

	const genericFilteredWords = $derived(
		words.filter(genericFilter).sort(genericSorter)
	);

	const filteredWords = $derived(
		filter(genericFilteredWords, search, $language)
	);

	const missingDefinitions = $derived(
		$language !== 'en' &&
			fetchedTranslations.includes($language) &&
			genericFilteredWords.some(
				word =>
					!word.translations[$language]?.definition ||
					word.translations[$language].definition ===
						word.translations.en.definition
			)
	);

	$effect(() => {
		if (!fetchedTranslations.includes($language)) {
			fetchTranslation($language);
		}
	});
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

<p class="alert mt-4 p-4 leading-relaxed">
	The 2025
	<a
		href="https://linku.la/wile"
		target="_blank"
		rel="noopener noreferrer"
		class="link items-center"
	>
		Linku word usage survey<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 16 16"
			fill="currentColor"
			class="ml-1 inline-block size-4 -translate-y-0.5"
		>
			<path
				d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z"
			/>
			<path
				d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z"
			/>
		</svg>
	</a>
	and the new
	<a
		href="https://linku.la/wile-glyphs"
		target="_blank"
		rel="noopener noreferrer"
		class="link items-center"
	>
		Linku <i>sitelen pona</i> glyph survey<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 16 16"
			fill="currentColor"
			class="ml-1 inline-block size-4 -translate-y-0.5"
		>
			<path
				d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z"
			/>
			<path
				d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z"
			/>
		</svg>
	</a>
	are now open! <strong>nimi.li</strong> relies on kulupu Linku to describe the
	community's usage of words. Please take the survey to help improve the dictionary!
</p>

<div class="mt-4 flex flex-wrap gap-1">
	{#each $categories as category}
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
				transition:flyAndScale|local={{ y: -4 }}
				use:outclick
				onoutclick={() => {
					// delay to make clicking on the button also close
					requestAnimationFrame(() => {
						moreOptions = false;
					});
				}}
				class="bg-card absolute top-full z-10 mt-2 hidden w-max flex-wrap gap-1 rounded-lg border-2 p-2 shadow-md
					md:flex"
			>
				{#each books as book}
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
		class="border-contrast bg-card mt-2 flex items-start justify-between gap-2 rounded-lg border-2 p-2
			md:hidden"
		transition:slide
	>
		<div class="flex flex-wrap gap-1">
			{#each books as book}
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
			class="interactable shrink-0 p-0.5"
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

<div class="mt-2 flex flex-wrap gap-1">
	<Select
		name="View"
		options={[
			{ label: 'Normal View', value: 'normal' },
			{ label: 'Detailed View', value: 'detailed' },
			{ label: 'List View', value: 'compact' },
			{ label: 'Glyph View', value: 'glyphs' }
		]}
		bind:value={$viewMode}
	/>

	<Select
		name="Sorting Method"
		options={[
			{ label: 'Sort A-Z by Usage', value: 'combined' },
			{ label: 'Sort by Usage', value: 'recognition' },
			{ label: 'Sort Alphabetically', value: 'alphabetical' }
		]}
		bind:value={$sortingMethod}
	/>

	<SelectLanguage
		languages={data.languages}
		onchange={lang => {
			if (fetchedTranslations.includes(lang)) {
				$language = lang;
			} else {
				fetchTranslation(lang);
			}
		}}
	/>

	<Select
		name="sitelen type"
		options={[
			{ label: 'sitelen pona', value: 'pona' },
			{ label: 'sitelen sitelen', value: 'sitelen' },
			{ label: 'sitelen jelo', value: 'jelo' },
			{ label: 'sitelen Emosi', value: 'emosi' }
		]}
		bind:value={$sitelenMode}
	/>
</div>

{#if missingDefinitions}
	<p class="mt-2">
		<strong>o sona a!</strong>
		{data.languages[$language].name.tok ??
			data.languages[$language].name.en}
		la sona pi nimi ale li lon ala. toki Inli li lon nimi ni.
	</p>
	<p>
		<strong>Warning!</strong>
		Some words are missing {data.languages[$language].name.en} translations.
		These are replaced with English translations.
	</p>
{/if}

<p class="text-muted mt-2">
	{filteredWords.length} / {genericFilteredWords.length}
</p>

<Search placeholder="o alasa..." bind:value={search} />

<WordView
	words={filteredWords}
	onselect={word => {
		if (selectedWord?.id === word.id) selectedWord = null;
		else selectedWord = word;
	}}
/>

<WordDetails
	bind:word={selectedWord}
	lipamanka={data.lipamanka[selectedWord?.id ?? '']}
	onrefer={referred => {
		if (!filteredWords.some(word => word.word === referred)) {
			search = '';

			$categories = $categories.map(category => ({
				...category,
				shown:
					category.shown ||
					category.name === data.words[referred].usage_category
			}));
			books = books.map(book => ({
				...book,
				shown: book.shown || book.name === data.words[referred].book
			}));
		}
	}}
/>
