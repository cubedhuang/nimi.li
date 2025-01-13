<script lang="ts">
	import type { LocalizedWord } from '@kulupu-linku/sona';

	import {
		categoryTextColors,
		getWordDisplayRecognition,
		getTranslation
	} from '$lib/util';
	import { language, sitelenMode } from '$lib/stores';

	interface Props {
		word: LocalizedWord;
		onclick?: () => void;
	}

	const { word, onclick }: Props = $props();

	const translation = $derived(getTranslation(word, $language));
</script>

<div class="flex flex-col items-center" id={word.id}>
	<button class="group" {onclick}>
		{#if $sitelenMode === 'pona'}
			{#if word.representations?.ligatures?.length}
				<p class="whitespace-nowrap font-pona text-5xl">
					{word.representations.ligatures.slice(0, 3).join(' ')}
				</p>
			{:else}
				<span class="h-12"></span>
			{/if}
		{:else if $sitelenMode === 'sitelen'}
			{#if word.representations?.sitelen_sitelen}
				<img
					src="/api/ss?word={word.word}"
					alt="{word.word} sitelen sitelen"
					class="invertible size-12"
				/>
			{:else}
				<span class="h-12"></span>
			{/if}
		{:else if $sitelenMode === 'jelo'}
			{#if word.representations?.sitelen_jelo}
				<p class="text-5xl">
					{word.representations.sitelen_jelo.slice(0, 3).join('')}
				</p>
			{:else}
				<span class="h-12"></span>
			{/if}
		{:else if word.representations?.sitelen_emosi}
			<p class="text-5xl">
				{word.representations.sitelen_emosi}
			</p>
		{:else}
			<span class="h-12"></span>
		{/if}

		<b class="transition group-hv:text-accent">
			{word.word}
		</b>
	</button>

	<span class="text-xs text-muted">
		<span class={categoryTextColors[word.usage_category]}>
			{getWordDisplayRecognition(word)}
		</span>

		{#if word.book !== 'none'}
			&middot;
			{word.book}
		{/if}
	</span>

	<p class="line-clamp-4 text-center text-xs leading-tight">
		{translation.definition}
	</p>
</div>
