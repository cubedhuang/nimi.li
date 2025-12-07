<script lang="ts">
	import type { LocalizedWord } from '@kulupu-linku/sona';

	import {
		categoryTextColors,
		getWordDisplayRecognition,
		getTranslation,
		getWordLink
	} from '$lib/util';
	import { language, sitelenMode } from '$lib/stores';

	interface Props {
		word: LocalizedWord;
		onclick?: () => void;
	}

	const { word, onclick }: Props = $props();

	const translation = $derived(getTranslation(word, $language));
</script>

<p class="flex gap-1" id={word.id}>
	{#if $sitelenMode === 'pona'}
		{#if word.representations?.ligatures?.length}
			<span class="w-5 shrink-0 font-pona text-xl">
				{word.representations.ligatures[0]}
			</span>
		{:else}
			<span class="w-5 shrink-0"></span>
		{/if}
	{:else if $sitelenMode === 'sitelen'}
		{#if word.representations?.sitelen_sitelen}
			<img
				src="/internal/api/ss?word={word.word}"
				alt="{word.word} sitelen sitelen"
				class="my-0.5 h-6 w-6 shrink-0 invertible"
			/>
		{:else}
			<span class="w-6 shrink-0"></span>
		{/if}
	{:else if $sitelenMode === 'jelo'}
		{#if word.representations?.sitelen_jelo}
			<span class="w-6 shrink-0 text-right text-xl">
				{word.representations.sitelen_jelo[0]}
			</span>
		{:else}
			<span class="w-6 shrink-0"></span>
		{/if}
	{:else if word.representations?.sitelen_emosi}
		<span class="w-6 shrink-0 text-right text-xl">
			{word.representations.sitelen_emosi}
		</span>
	{:else}
		<span class="w-6 shrink-0"></span>
	{/if}

	<span class="mt-0.5 ml-0.5">
		<a
			href={getWordLink(word.id, $language)}
			onclick={(e) => {
				e.preventDefault();
				if (onclick) {
					onclick();
				}
			}}
			class="font-bold transition hv:text-accent"
		>
			{word.word}
		</a>

		<span class="text-xs text-muted">
			<span class={categoryTextColors[word.usage_category]}>
				{getWordDisplayRecognition(word)}
			</span>

			{#if word.book !== 'none'}
				{word.book}
			{/if}
		</span>

		{translation.definition}
	</span>
</p>
