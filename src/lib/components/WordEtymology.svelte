<script lang="ts">
	import type { Word } from '@kulupu-linku/sona';

	interface Props {
		word: Word;
	}

	const { word }: Props = $props();
</script>

{#if word.source_language.startsWith('multiple') || word.source_language.startsWith('unknown')}
	<p class="italic">
		{word.source_language}
	</p>
{/if}

{word.translations.etymology}

{#if word.author.length}
	<p>
		<span class="text-muted">coined by</span>
		<i>{word.author.join(', ')}</i>
	</p>
{/if}
