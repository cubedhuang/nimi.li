<script lang="ts">
	import type { ListWord } from '$lib/types';

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

{word.translations.etymology}

{#if word.author.length}
	<p>
		<span class="text-muted">coined by</span>
		<i>{word.author.join(', ')}</i>
	</p>
{/if}
