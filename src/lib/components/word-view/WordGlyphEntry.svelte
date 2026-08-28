<script lang="ts">
	import { resolve } from '$app/paths';
	import { loadWordDetail } from '$lib/wordDetail';

	import type { ListGlyph, ListWord } from '$lib/types';

	import { categoryTextColors, getWordDisplayRecognition } from '$lib/util';
	import { sitelenMode } from '$lib/stores';
	import { getShownGlyphs } from './getShownGlyphs';

	interface Props {
		word: ListWord;
		glyphs: ListGlyph[] | undefined;
		onclick?: () => void;
	}

	const { word, glyphs, onclick }: Props = $props();

	const shownGlyphs = $derived(getShownGlyphs(word, glyphs));
</script>

<div class="flex flex-col items-center" id={word.id}>
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
		class="group text-center"
	>
		{#if $sitelenMode === 'pona'}
			{#if shownGlyphs?.length}
				<p class="flex justify-center py-1">
					{#each shownGlyphs as glyph (glyph.id)}
						<img
							src={glyph.svg}
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
		{:else if $sitelenMode === 'sitelen'}
			{#if word.representations?.sitelen_sitelen}
				<img
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
	</a>

	<span class="text-xs text-muted">
		<span class="font-bold {categoryTextColors[word.usage_category]}">
			{getWordDisplayRecognition(word)}
		</span>
		&middot;
		{word.usage_category}
	</span>

	<p class="line-clamp-4 text-center text-xs leading-tight">
		{word.translations.definition}
	</p>
</div>
