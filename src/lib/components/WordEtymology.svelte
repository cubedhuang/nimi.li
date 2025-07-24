<script lang="ts">
	import type { LocalizedWord, WordTranslation } from '@kulupu-linku/sona';

	interface Props {
		word: LocalizedWord;
		translation: WordTranslation;
	}

	const { word, translation }: Props = $props();
</script>

{#if word.source_language.startsWith('multiple') || word.source_language.startsWith('unknown')}
	<p class="italic">
		{word.source_language}
	</p>
{/if}

{#each word.etymology as { word: sourceWord, alt }, i}
	{#if !(word.source_language === 'unknown' && sourceWord === 'unknown')}
		{@const { definition, language } = translation.etymology[i] ?? {}}
		<p>
			{language || 'unknown'}
			{#if sourceWord}
				&middot;
				{sourceWord}
				{#if alt}
					{alt}
				{/if}
				{#if definition && definition !== sourceWord}
					&lsquo;{definition}&rsquo;
				{/if}
			{/if}
		</p>
	{/if}
{/each}

{#if word.creator.length}
	<p>
		coined by
		<i>{word.creator.join(', ')}</i>
	</p>
{/if}
