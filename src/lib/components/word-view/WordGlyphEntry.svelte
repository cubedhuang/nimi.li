<script lang="ts">
	import { resolve } from '$app/paths';
	import { loadWordDetail } from '#lib/wordDetail.js';
	import HydratedImg from '#lib/components/HydratedImg.svelte';

	import type { ListGlyph, ListWord } from '#lib/types.js';

	import {
		categoryTextColors,
		getWordDisplayRecognition,
		getWordRecognition
	} from '#lib/util.js';
	import { getSettings } from '#lib/settings/index.js';
	import { getShownGlyphs } from './getShownGlyphs';

	interface Props {
		word: ListWord;
		glyphs: ListGlyph[] | undefined;
		onclick?: () => void;
	}

	const { word, glyphs, onclick }: Props = $props();
	const settings = getSettings();

	const shownGlyphs = $derived(getShownGlyphs(word, glyphs));
</script>

<a
	href={resolve('/[nimi]', { nimi: word.id })}
	onclick={(e) => {
		e.preventDefault();
		if (onclick) {
			onclick();
		}
	}}
	onpointerdown={() => loadWordDetail(word.id)}
	onfocus={() => loadWordDetail(word.id)}
	id={word.id}
	class="group flex flex-col items-center border-r border-b p-2 text-center outline-offset-2 outline-accent transition
	    focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-solid hv:bg-secondary hv:text-secondary-foreground"
>
	{#if settings.sitelenMode === 'pona'}
		{#if shownGlyphs?.length}
			<p class="flex justify-center py-1">
				{#each shownGlyphs as glyph (glyph.id)}
					<HydratedImg
						src={glyph.svg}
						crossorigin="anonymous"
						alt={glyph.id}
						width="40"
						height="40"
						loading="lazy"
						decoding="async"
						class="h-10 w-10 invertible"
					/>
				{/each}
			</p>
		{:else if word.representations?.ligatures?.length}
			<p class="font-pona text-5xl whitespace-nowrap">
				{word.representations.ligatures.slice(0, 3).join(' ')}
			</p>
		{:else}
			<div class="h-12"></div>
		{/if}
	{:else if settings.sitelenMode === 'sitelen'}
		{#if word.representations?.sitelen_sitelen}
			<HydratedImg
				src="/internal/api/ss/{word.word}"
				alt="{word.word} sitelen sitelen"
				width="48"
				height="48"
				loading="lazy"
				decoding="async"
				class="size-12 invertible"
			/>
		{:else}
			<span class="h-12"></span>
		{/if}
	{:else if settings.sitelenMode === 'jelo'}
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

	<span class="text-xs text-muted">
		{#if getWordRecognition(word) !== -1}
			<span class="font-bold {categoryTextColors[word.usage_category]}">
				{getWordDisplayRecognition(word)}
			</span>
			&middot;
		{/if}
		{word.usage_category}
	</span>

	<p class="line-clamp-4 text-center text-xs leading-tight">
		{word.translations.definition}
	</p>
</a>
