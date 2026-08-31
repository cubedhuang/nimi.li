<script lang="ts">
	import type { ListGlyph, ListWord } from '$lib/types';

	import { categoryBackgroundColors } from '$lib/util';
	import { sitelenMode } from '$lib/stores';

	import Space from '$lib/components/Space.svelte';
	import WordUsageSummary from '../WordUsageSummary.svelte';
	import { resolve } from '$app/paths';
	import { getShownGlyphs } from './getShownGlyphs';
	import { loadWordDetail } from '$lib/wordDetail';
	import { hydratedSrc } from '$lib/actions/hydratedSrc';

	interface Props {
		word: ListWord;
		glyphs: ListGlyph[] | undefined;
		onclick?: () => void;
	}

	const { word, glyphs, onclick }: Props = $props();
</script>

<Space
	href={resolve(`/${word.id}`)}
	{onclick}
	id={word.id}
	onpointerdown={() => loadWordDetail(word.id)}
	onfocus={() => loadWordDetail(word.id)}
>
	{#if $sitelenMode === 'pona'}
		{#if glyphs?.length}
			<div
				class="float-right ml-2 flex flex-col items-end gap-2 text-right"
			>
				{#each getShownGlyphs(word, glyphs) as glyph (glyph.id)}
					<img
						src={glyph.svg}
						use:hydratedSrc={glyph.svg}
						crossorigin="anonymous"
						alt={glyph.id}
						width="32"
						height="32"
						loading="lazy"
						decoding="async"
						class="h-8 w-8 invertible"
					/>
				{/each}
			</div>
		{:else if word.representations?.ligatures?.length}
			<div class="float-right ml-2 flex flex-col items-end text-right">
				{#each word.representations.ligatures as sitelen, i (i)}
					<p class="font-pona text-4xl">{sitelen}</p>
				{/each}
			</div>
		{/if}
	{:else if $sitelenMode === 'sitelen'}
		{#if word.representations?.sitelen_sitelen}
			<img
				src="/internal/api/ss/{word.word}"
				use:hydratedSrc={`/internal/api/ss/${word.word}`}
				alt="{word.word} sitelen sitelen"
				width="40"
				height="40"
				loading="lazy"
				decoding="async"
				class="float-right ml-2 h-10 w-10 shrink-0 invertible"
			/>
		{/if}
	{:else if $sitelenMode === 'jelo'}
		{#if word.representations?.sitelen_jelo}
			<div class="float-right">
				{#each word.representations.sitelen_jelo.slice(0, 3) as sitelen, i (i)}
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
		{word.translations.definition}
	</p>

	{#if word.usage_category === 'sandbox' && word.author.length}
		<p class="mt-1 text-sm text-muted">
			by <i>{word.author.join(', ')}</i>
		</p>
	{/if}

	<span
		class="absolute -top-3 -left-3 rounded-full p-3 {categoryBackgroundColors[
			word.usage_category
		]}"
	></span>
</Space>
