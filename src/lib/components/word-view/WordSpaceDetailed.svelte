<script lang="ts">
	import type { ListGlyph, ListWord } from '#lib/types.js';

	import { categoryBackgroundColors } from '#lib/util.js';
	import { getSettings } from '#lib/settings/index.js';
	import Space from '#lib/components/Space.svelte';
	import WordUsageSummary from '../WordUsageSummary.svelte';
	import { resolve } from '$app/paths';
	import { getShownGlyphs } from './getShownGlyphs';
	import { loadWordDetail } from '#lib/wordDetail.js';
	import HydratedImg from '#lib/components/HydratedImg.svelte';

	interface Props {
		word: ListWord;
		glyphs: ListGlyph[] | undefined;
		onclick?: () => void;
	}

	const { word, glyphs, onclick }: Props = $props();
	const settings = getSettings();

	const shownGlyphs = $derived(getShownGlyphs(word, glyphs));

	const etymology = $derived.by(() => {
		const text = word.translations.etymology;
		if (!text) return { source: null, rest: word.source_language };

		const colon = text.indexOf(':');
		if (colon === -1) return { source: null, rest: text };

		return {
			source: text.slice(0, colon),
			rest: text.slice(colon + 1).trim()
		};
	});
</script>

<Space
	href={resolve('/[nimi]', { nimi: word.id })}
	{onclick}
	id={word.id}
	onpointerdown={() => loadWordDetail(word.id)}
	onfocus={() => loadWordDetail(word.id)}
	class="flex gap-4 p-5 hover:scale-[1.01]"
>
	<div class="flex w-10 shrink-0 flex-col items-center gap-2">
		{#if shownGlyphs?.length}
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
		{:else}
			{#each word.representations?.ligatures ?? [] as sitelen, i (i)}
				<p class="font-pona text-5xl">{sitelen}</p>
			{/each}
		{/if}

		{#if word.representations?.sitelen_sitelen}
			<HydratedImg
				src="/internal/api/ss/{word.word}"
				alt="{word.word} sitelen sitelen"
				width="40"
				height="40"
				loading="lazy"
				decoding="async"
				class="h-10 w-10 invertible"
			/>
		{/if}

		{#if settings.sitelenMode === 'jelo' && word.representations?.sitelen_jelo}
			{#each word.representations.sitelen_jelo.slice(0, 3) as sitelen, i (i)}
				<p class="text-3xl">{sitelen}</p>
			{/each}
		{:else if settings.sitelenMode === 'emosi' && word.representations?.sitelen_emosi}
			<p class="text-3xl">{word.representations.sitelen_emosi}</p>
		{/if}
	</div>

	<div class="min-w-0 flex-1">
		<div class="flex flex-wrap items-baseline gap-x-3">
			<h2 class="text-2xl break-all">{word.word}</h2>

			<p class="text-sm text-muted">
				{#if word.deprecated}
					deprecated &middot;
				{/if}
				<WordUsageSummary {word} />
				{#if word.book !== 'none'}
					&middot; {word.book}
				{/if}
			</p>
		</div>

		<p class="mt-1">{word.translations.definition}</p>

		{#if word.translations.commentary}
			{#each word.translations.commentary.split(/\n+/g) as line, i (i)}
				<p
					class="text-sm whitespace-pre-line text-muted
					    {i === 0 ? 'mt-2' : 'mt-1'}"
				>
					{line}
				</p>
			{/each}
		{/if}

		<p class="mt-3 border-t pt-2 text-sm text-muted">
			from
			{#if etymology.source}
				<i class="text-foreground">{etymology.source}</i>:
			{/if}
			{etymology.rest}
			{#if word.author.length}
				&middot; {word.author.join(', ')}
			{/if}
			{#if word.coined_era}
				&middot; {word.coined_era}
			{/if}
		</p>

		{#if word.see_also.length}
			<p class="mt-1 text-sm">
				<span class="text-muted">see also</span>
				{word.see_also.join(', ')}
			</p>
		{/if}
	</div>

	<span
		class="absolute -top-3 -left-3 rounded-full p-3 {categoryBackgroundColors[
			word.usage_category
		]}"
	></span>
</Space>
