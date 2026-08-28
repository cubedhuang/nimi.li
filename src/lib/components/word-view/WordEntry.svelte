<script lang="ts">
	import type { ListGlyph, ListWord } from '$lib/types';

	import {
		categoryTextColors,
		getWordDisplayRecognition,
		getWordRecognition
	} from '$lib/util';
	import { sitelenMode } from '$lib/stores';
	import { resolve } from '$app/paths';
	import { loadWordDetail } from '$lib/wordDetail';

	interface Props {
		word: ListWord;
		glyphs: ListGlyph[] | undefined;
		onclick?: () => void;
	}

	const { word, glyphs, onclick }: Props = $props();
</script>

<p class="flex gap-1" id={word.id}>
	{#if $sitelenMode === 'pona'}
		{#if glyphs?.length}
			<img
				src={glyphs[0].svg}
				alt={glyphs[0].id}
				width="24"
				height="24"
				loading="lazy"
				decoding="async"
				class="my-0.5 h-6 w-6 shrink-0 invertible"
			/>
		{:else if word.representations?.ligatures?.length}
			<span class="h-6 w-6 shrink-0 text-center font-pona text-2xl">
				{word.representations.ligatures[0]}
			</span>
		{:else}
			<span class="h-6 w-6 shrink-0"></span>
		{/if}
	{:else if $sitelenMode === 'sitelen'}
		{#if word.representations?.sitelen_sitelen}
			<img
				src="/internal/api/ss/{word.word}"
				alt="{word.word} sitelen sitelen"
				width="24"
				height="24"
				loading="lazy"
				decoding="async"
				class="my-0.5 h-6 w-6 shrink-0 invertible"
			/>
		{:else}
			<span class="h-6 w-6 shrink-0"></span>
		{/if}
	{:else if $sitelenMode === 'jelo'}
		{#if word.representations?.sitelen_jelo}
			<span class="h-6 w-6 shrink-0 text-right text-xl">
				{word.representations.sitelen_jelo[0]}
			</span>
		{:else}
			<span class="h-6 w-6 shrink-0"></span>
		{/if}
	{:else if word.representations?.sitelen_emosi}
		<span class="h-6 w-6 shrink-0 text-right text-xl">
			{word.representations.sitelen_emosi}
		</span>
	{:else}
		<span class="h-6 w-6 shrink-0"></span>
	{/if}

	<span class="mt-0.5 ml-0.5">
		<a
			href={resolve(`/${word.id}`)}
			onclick={(e) => {
				e.preventDefault();
				if (onclick) {
					onclick();
				}
			}}
			onpointerdown={() => loadWordDetail(word.id)}
			onfocus={() => loadWordDetail(word.id)}
			class="font-bold transition hv:text-accent"
		>
			{word.word}
		</a>

		<span class="text-xs text-muted">
			{#if getWordRecognition(word) !== -1}
				<span
					class="font-bold {categoryTextColors[word.usage_category]}"
				>
					{getWordDisplayRecognition(word)}
				</span>
			{/if}

			{#if word.usage_category !== 'sandbox'}
				{word.usage_category}
			{/if}
		</span>

		{word.translations.definition}
	</span>
</p>
