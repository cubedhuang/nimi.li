<script lang="ts">
	import { onMount } from 'svelte';

	import type { LocalizedWord } from '@kulupu-linku/sona';

	import { goto } from '$app/navigation';

	import { filter } from '$lib/search';
	import { language, sitelenMode, viewMode } from '$lib/stores';
	import { azWordSort, recognitionWordSort } from '$lib/util';

	import Search from '$lib/components/Search.svelte';
	import Select from '$lib/components/Select.svelte';
	import SelectLanguage from '$lib/components/SelectLanguage.svelte';
	import WordDetails from '$lib/components/WordDetails.svelte';
	import WordView from '$lib/components/WordView.svelte';
	import Meta from '$lib/components/Meta.svelte';

	const { data } = $props();

	let search = $state('');
	let selectedWord = $state<LocalizedWord | null>(null);

	let sorter = $state(recognitionWordSort);

	let fetchedTranslations = $state(['en']);

	async function fetchTranslation(lang: string) {
		const words = (await fetch(`/internal/api/sandbox?lang=${lang}`).then(
			(res) => res.json()
		)) as Record<string, LocalizedWord>;

		for (const word of Object.values(words)) {
			data.words[word.id].translations[lang] = word.translations[lang];
		}

		fetchedTranslations.push(lang);
		fetchedTranslations = fetchedTranslations;

		$language = lang;
	}

	onMount(() => {
		fetchTranslation($language);
	});

	const words = $derived(Object.values(data.words));

	const sortedWords = $derived(words.sort(sorter).slice());

	const filteredWords = $derived(filter(sortedWords, search, $language));

	const missingDefinitions = $derived(
		$language !== 'en' &&
			fetchedTranslations.includes($language) &&
			sortedWords.some(
				(word) =>
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
	title="sandbox – nimi.li | Toki Pona Dictionary"
	description="Explore Linku's sandbox, a collection of experimental Toki Pona words."
	url="https://nimi.li/sandbox"
	keywords={['sandbox']}
/>

<h1 class="text-4xl">sandbox</h1>

<p class="mt-2 leading-relaxed">
	Explore Linku's <b>sandbox</b>, a collection of proposed words which are
	<em>not actively in use</em>. Some of these words are of value to the
	community as pieces of culture, essentially memes. Some reflect early drafts
	of Toki Pona. Many are one-off jokes, created and abandoned immediately.
</p>

<p class="mt-4 alert p-4 leading-relaxed">
	<strong>Warning!</strong>
	If you are a learner, <em>stick to the main dictionary</em>. These words
	will not help you speak the language.
</p>

<div class="mt-4 flex flex-wrap gap-1">
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
			{ label: 'Sort by Usage', value: recognitionWordSort },
			{ label: 'Sort Alphabetically', value: azWordSort }
		]}
		bind:value={sorter}
	/>

	<SelectLanguage
		languages={data.languages}
		onchange={(lang) => {
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

<p class="mt-2 text-muted">
	{filteredWords.length} / {words.length}
</p>

<Search placeholder="o alasa..." bind:value={search} />

<WordView
	words={filteredWords}
	onselect={(word) => {
		if (selectedWord?.id === word.id) selectedWord = null;
		else selectedWord = word;
	}}
/>

<WordDetails
	bind:word={selectedWord}
	onrefer={(referred) => {
		if (!filteredWords.some((word) => word.word === referred)) {
			if (!words.some((word) => word.word === referred)) {
				goto(`/${referred}`);
			} else {
				search = '';
			}
		}
	}}
/>
