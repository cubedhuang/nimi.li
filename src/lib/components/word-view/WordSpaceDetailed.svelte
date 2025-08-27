<script lang="ts">
	import type { LocalizedWord } from '@kulupu-linku/sona';

	import {
		categoryColors,
		getWordDisplayRecognition,
		getShortWordEtymologies,
		getTranslation,
		getWordLink
	} from '$lib/util';
	import { language, sitelenMode } from '$lib/stores';
	import Space from '$lib/components/Space.svelte';

	interface Props {
		word: LocalizedWord;
		onclick?: () => void;
	}

	const { word, onclick }: Props = $props();

	const translation = $derived(getTranslation(word, $language));
	const displayRecognition = $derived(getWordDisplayRecognition(word));
</script>

<Space href={getWordLink(word.id, $language)} {onclick} id={word.id}>
	<div class="grid grid-cols-3 text-muted">
		<div>
			<p class="line-clamp-1 break-all">
				{word.source_language}
			</p>

			{#if word.etymology}
				<p class="line-clamp-1 text-xs break-all">
					{getShortWordEtymologies(word, $language)}
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
			{#if word.creator.length}
				<p class="line-clamp-1 break-all">
					{word.creator.join(', ')}
				</p>
			{/if}

			{#if word.coined_era}
				<p class="line-clamp-1 text-xs break-all">
					{word.coined_era}

					{#if word.coined_year}
						&middot; {word.coined_year}
					{/if}
				</p>
			{/if}
		</div>
	</div>

	<div class="mt-1 flex gap-2 text-center">
		<div class="flex w-9 shrink-0 flex-col items-end text-right">
			{#each word.representations?.ligatures ?? [] as sitelen, i (i)}
				<p class="font-pona text-4xl">{sitelen}</p>
			{/each}
		</div>

		<div class="w-full">
			<h2
				class="line-clamp-1 text-3xl break-all transition group-hv:text-accent"
			>
				{word.word}
			</h2>

			<p class="mt-1">{translation.definition}</p>

			{#if translation.commentary}
				<p class="mt-2 text-sm text-muted">
					{translation.commentary.replace(/\n/g, ' / ')}
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
					src="/internal/api/ss?word={word.word}"
					alt="{word.word} sitelen sitelen"
					class="ml-auto h-9 w-9 invertible"
				/>
			{/if}
		</div>
	</div>

	<span
		class="absolute -top-3 -left-3 rounded-full p-3 {categoryColors[
			word.usage_category
		]}"
	></span>
</Space>
