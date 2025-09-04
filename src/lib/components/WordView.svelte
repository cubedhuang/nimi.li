<script lang="ts">
	import type { Language, LocalizedWord } from '@kulupu-linku/sona';

	import { filter } from '$lib/search';
	import {
		language,
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
	import SelectLanguage from './SelectLanguage.svelte';

	import WordGlyphEntry from './word-view/WordGlyphEntry.svelte';
	import WordEntry from './word-view/WordEntry.svelte';
	import WordSpace from './word-view/WordSpace.svelte';
	import WordSpaceDetailed from './word-view/WordSpaceDetailed.svelte';
	import Search from './Search.svelte';
	import WordDetails from './WordDetails.svelte';

	interface Props {
		search?: string;
		words: LocalizedWord[];
		lipamanka?: Record<string, string>;
		languages: Record<string, Language>;
		sortingMethod?: SortingMethod;
		revealWord: (word: string) => void;
		isSandbox?: boolean;
	}

	let {
		search = $bindable(''),
		words = $bindable(),
		lipamanka,
		languages,
		sortingMethod = $bindable('alphabetical'),
		revealWord,
		isSandbox
	}: Props = $props();

	let selectedWord = $state<LocalizedWord | null>(null);

	function selectWord(word: LocalizedWord) {
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

	let fetchedTranslations = $state(['en']);

	async function fetchTranslation(lang: string) {
		const url = isSandbox
			? `/internal/api/sandbox?lang=${lang}`
			: `/internal/api/linku?lang=${lang}`;

		const newWords = (await fetch(url).then((res) => res.json())) as Record<
			string,
			LocalizedWord
		>;

		for (const word of words) {
			word.translations[lang] = newWords[word.id]?.translations[lang];
		}

		fetchedTranslations.push(lang);
		$language = lang;
	}

	$effect(() => {
		if (!fetchedTranslations.includes($language)) {
			fetchTranslation($language);
		}
	});

	const missingDefinitions = $derived(
		$language !== 'en' &&
			fetchedTranslations.includes($language) &&
			words.some(
				(word) =>
					!word.translations[$language]?.definition ||
					word.translations[$language].definition ===
						word.translations.en.definition
			)
	);

	const sortedWords = $derived(words.toSorted(genericSorter));
	const filteredWords = $derived(filter(sortedWords, search, $language));
</script>

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
		class="w-40 shrink-0"
	/>

	<Select
		name="Sorting Method"
		options={[
			!isSandbox
				? { label: 'Sort A-Z by Usage', value: 'combined' }
				: null,
			{ label: 'Sort Alphabetically', value: 'alphabetical' },
			{ label: 'Sort by Usage', value: 'recognition' }
		].filter((o) => o !== null)}
		bind:value={sortingMethod}
		class="w-48 shrink-0"
	/>

	<SelectLanguage
		{languages}
		onchange={(lang) => {
			fetchTranslation(lang);
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
		class="w-40 shrink-0"
	/>
</div>

{#if missingDefinitions}
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
{/if}

<p class="mt-2 text-muted">
	{filteredWords.length} / {words.length}
</p>

<Search placeholder="o alasa..." bind:value={search} />

{#if $viewMode === 'compact'}
	<div class="mt-4 grid">
		{#each filteredWords as word (word.id)}
			<WordEntry {word} onclick={() => selectWord(word)} />
		{/each}
	</div>
{:else if $viewMode === 'glyphs'}
	<div class="mt-4 grid grid-cols-fill-28 gap-1">
		{#each filteredWords as word (word.id)}
			<WordGlyphEntry {word} onclick={() => selectWord(word)} />
		{/each}
	</div>
{:else if $viewMode === 'detailed'}
	<div class="mt-4 grid grid-cols-fill-96 gap-2">
		{#each filteredWords as word (word.id)}
			<WordSpaceDetailed {word} onclick={() => selectWord(word)} />
		{/each}
	</div>
{:else}
	<div class="mt-4 grid grid-cols-fill-64 gap-2">
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
		if (!filteredWords.some((word) => word.word === referred)) {
			search = '';

			revealWord(referred);
		}
	}}
/>
