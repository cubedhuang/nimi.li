<script lang="ts">
	import { categoryTextColors, getWordDisplayRecognition } from '$lib/util';
	import type { Glyph } from '@kulupu-linku/sona';

	interface Props {
		glyphs: Glyph[];
		showSandbox: boolean;
	}

	let { glyphs, showSandbox }: Props = $props();

	const shownGlyphs = $derived(
		showSandbox
			? glyphs
			: glyphs.filter((g) => g.usage_category !== 'sandbox')
	);
</script>

<div class="grid grid-cols-fill-48 gap-2">
	{#each shownGlyphs as glyph (glyph.id)}
		<figure
			class="rounded-lg border-2 border-secondary-border bg-secondary p-2 sm:p-4"
		>
			<figcaption class="flex gap-4 text-xs text-muted">
				<span>
					{glyph.translations.names.join(' / ') || glyph.word}
				</span>
				<span class="ml-auto">
					<b class={categoryTextColors[glyph.usage_category]}>
						{getWordDisplayRecognition(glyph)}
					</b>
				</span>
			</figcaption>
			<img
				src={glyph.svg}
				crossorigin="anonymous"
				alt={glyph.id}
				class="mt-2 h-12 w-12 invertible"
			/>
			{#if glyph.translations.etymology}
				<p class="mt-2 overflow-hidden text-sm">
					{glyph.translations.etymology}
				</p>
			{/if}
			{#if glyph.translations.commentary}
				<p class="mt-2 overflow-hidden text-xs text-muted">
					{glyph.translations.commentary}
				</p>
			{/if}
			{#if glyph.author.length}
				<p class="mt-2 text-sm">
					<span class="text-muted">by</span>
					<i>{glyph.author.join(', ')}</i>
				</p>
			{/if}
		</figure>
	{/each}
</div>
