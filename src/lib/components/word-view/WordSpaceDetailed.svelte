<script lang="ts">
	import type { Glyph, Word } from '@kulupu-linku/sona';

	import {
		categoryBackgroundColors,
		getWordDisplayRecognition
	} from '$lib/util';
	import { sitelenMode } from '$lib/stores';
	import Space from '$lib/components/Space.svelte';
	import { resolve } from '$app/paths';
	import { getShownGlyphs } from './getShownGlyphs';

	interface Props {
		word: Word;
		glyphs: Glyph[] | undefined;
		onclick?: () => void;
	}

	const { word, glyphs, onclick }: Props = $props();

	const displayRecognition = $derived(getWordDisplayRecognition(word));
	const shownGlyphs = $derived(getShownGlyphs(word, glyphs));
</script>

<Space href={resolve(`/${word.id}`)} {onclick} id={word.id}>
	<div class="grid grid-cols-3 text-muted">
		<div>
			<p class="line-clamp-1 break-all">
				{word.source_language}
			</p>

			{#if word.translations.etymology}
				<p class="line-clamp-1 text-xs break-all">
					{word.translations.etymology}
				</p>
			{/if}
		</div>

		<p class="mt-auto text-center text-xs text-muted">
			{word.usage_category}
			{#if displayRecognition !== 'unknown'}
				&middot; {displayRecognition}
			{/if}
			{#if word.book !== 'none'}
				&middot; {word.book}
			{/if}
		</p>

		<div class="text-right">
			{#if word.author.length}
				<p class="line-clamp-1 break-all">
					{word.author.join(', ')}
				</p>
			{/if}

			{#if word.coined_era}
				<p class="line-clamp-1 text-xs break-all">
					{word.coined_era}

					{#if word.creation_date}
						&middot; {word.creation_date}
					{/if}
				</p>
			{/if}
		</div>
	</div>

	<div class="mt-1 flex gap-2 text-center">
		{#if shownGlyphs?.length}
			<div class="flex w-9 shrink-0 flex-col items-end gap-2 text-right">
				{#each shownGlyphs ?? [] as glyph (glyph.id)}
					<img
						src={glyph.svg}
						alt={glyph.id}
						class="h-8 w-8 invertible"
					/>
				{/each}
			</div>
		{:else}
			<div class="flex w-9 shrink-0 flex-col items-end text-right">
				{#each word.representations?.ligatures ?? [] as sitelen, i (i)}
					<p class="font-pona text-4xl">{sitelen}</p>
				{/each}
			</div>
		{/if}

		<div class="w-full">
			<h2
				class="line-clamp-1 text-3xl break-all transition group-hv:text-accent"
			>
				{word.word}
			</h2>

			<p class="mt-1">{word.translations.definition}</p>

			{#if word.translations.commentary}
				<p class="mt-2 text-sm text-muted">
					{word.translations.commentary.replace(/\n/g, ' / ')}
				</p>
			{/if}
		</div>

		<div class="w-9 shrink-0">
			{#if $sitelenMode === 'jelo'}
				{#if word.representations?.sitelen_jelo}
					{#each word.representations.sitelen_jelo.slice(0, 3) as sitelen, i (i)}
						<p class="text-3xl">{sitelen}</p>
					{/each}
				{/if}
			{:else if $sitelenMode === 'emosi'}
				{#if word.representations?.sitelen_emosi}
					<span class="w-9 text-center text-3xl">
						{word.representations.sitelen_emosi}
					</span>
				{/if}
			{:else if word.representations?.sitelen_sitelen}
				<img
					src="/internal/api/ss/{word.word}"
					alt="{word.word} sitelen sitelen"
					class="ml-auto h-9 w-9 invertible"
				/>
			{/if}
		</div>
	</div>

	<span
		class="absolute -top-3 -left-3 rounded-full p-3 {categoryBackgroundColors[
			word.usage_category
		]}"
	></span>
</Space>
