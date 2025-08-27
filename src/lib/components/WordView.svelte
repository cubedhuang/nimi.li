<script lang="ts">
	import type { LocalizedWord } from '@kulupu-linku/sona';

	import { viewMode } from '$lib/stores';

	import WordGlyphEntry from './word-view/WordGlyphEntry.svelte';
	import WordEntry from './word-view/WordEntry.svelte';
	import WordSpace from './word-view/WordSpace.svelte';
	import WordSpaceDetailed from './word-view/WordSpaceDetailed.svelte';

	interface Props {
		words: LocalizedWord[];
		onselect: (word: LocalizedWord) => void;
	}

	const { words, onselect }: Props = $props();
</script>

{#if $viewMode === 'compact'}
	<div class="mt-4 grid">
		{#each words as word (word.id)}
			<WordEntry {word} onclick={() => onselect(word)} />
		{/each}
	</div>
{:else if $viewMode === 'glyphs'}
	<div class="mt-4 grid gap-1 grid-cols-fill-28">
		{#each words as word (word.id)}
			<WordGlyphEntry {word} onclick={() => onselect(word)} />
		{/each}
	</div>
{:else if $viewMode === 'detailed'}
	<div class="mt-4 grid gap-2 grid-cols-fill-96">
		{#each words as word (word.id)}
			<WordSpaceDetailed {word} onclick={() => onselect(word)} />
		{/each}
	</div>
{:else}
	<div class="mt-4 grid gap-2 grid-cols-fill-64">
		{#each words as word (word.id)}
			<WordSpace {word} onclick={() => onselect(word)} />
		{/each}
	</div>
{/if}

{#if !words.length}
	<p>wile sina la, nimi li lon ala!</p>
	<p class="text-muted">Your query didn't match any words!</p>
{/if}
