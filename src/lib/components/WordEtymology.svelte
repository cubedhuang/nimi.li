<script lang="ts">
	import type { ListWord } from '#lib/types.js';

	interface Props {
		word: ListWord;
	}

	const { word }: Props = $props();
</script>

{#if word.source_language.startsWith('multiple') || word.source_language.startsWith('unknown')}
	<p class="italic">
		{word.source_language}
	</p>
{/if}

{#if word.translations.etymology}
	<p dir="auto">{word.translations.etymology}</p>
{/if}

{#if word.author.length}
	<p>
		<span class="text-muted">coined by</span>
		<i>{word.author.join(', ')}</i>
	</p>
{/if}
