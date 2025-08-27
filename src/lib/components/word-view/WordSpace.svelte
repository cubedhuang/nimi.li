<script lang="ts">
	import type { LocalizedWord } from '@kulupu-linku/sona';

	import { categoryColors, getTranslation, getWordLink } from '$lib/util';
	import { language, sitelenMode } from '$lib/stores';

	import Space from '$lib/components/Space.svelte';
	import WordUsageSummary from '../WordUsageSummary.svelte';

	interface Props {
		word: LocalizedWord;
		onclick?: () => void;
	}

	const { word, onclick }: Props = $props();

	const translation = $derived(getTranslation(word, $language));
</script>

<Space href={getWordLink(word.id, $language)} {onclick} id={word.id}>
	{#if $sitelenMode === 'pona'}
		{#if word.representations?.ligatures?.length}
			<div class="float-right ml-2 flex flex-col items-end text-right">
				{#each word.representations.ligatures as sitelen (sitelen)}
					<p class="font-pona text-4xl">{sitelen}</p>
				{/each}
			</div>
		{/if}
	{:else if $sitelenMode === 'sitelen'}
		{#if word.representations?.sitelen_sitelen}
			<img
				src="/internal/api/ss?word={word.word}"
				alt="{word.word} sitelen sitelen"
				class="float-right ml-2 h-10 w-10 shrink-0 invertible"
			/>
		{/if}
	{:else if $sitelenMode === 'jelo'}
		{#if word.representations?.sitelen_jelo}
			<div class="float-right">
				{#each word.representations.sitelen_jelo.slice(0, 3) as sitelen (sitelen)}
					<p class="ml-auto text-right text-3xl">
						{sitelen}
					</p>
				{/each}
			</div>
		{/if}
	{:else if word.representations?.sitelen_emosi}
		<p class="float-right text-right text-3xl">
			{word.representations.sitelen_emosi}
		</p>
	{/if}

	<h2 class="text-xl">{word.word}</h2>

	<p class="text-sm text-muted">
		<WordUsageSummary {word} />
	</p>

	<p class="line-clamp-4">
		{translation.definition}
	</p>

	{#if word.usage_category === 'sandbox' && word.creator.length}
		<p class="mt-1 text-muted">
			by <i>{word.creator.join(', ')}</i>
		</p>
	{/if}

	<span
		class="absolute -top-3 -left-3 rounded-full p-3 {categoryColors[
			word.usage_category
		]}"
	></span>
</Space>
