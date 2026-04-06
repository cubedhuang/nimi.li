<script lang="ts">
	import type { Word } from '@kulupu-linku/sona';

	import { getWordDisplayRecognition } from '$lib/util';

	interface Props {
		word: Word;
	}

	const { word }: Props = $props();
	const displayRecognition = $derived(getWordDisplayRecognition(word));
</script>

{#if word.usage_category !== 'sandbox'}
	{word.usage_category} &middot;
{/if}
{#if displayRecognition !== 'unknown'}
	{getWordDisplayRecognition(word)}
	{#if word.book !== 'none' || word.creation_date}
		&middot;
	{/if}
{/if}
{#if word.book !== 'none'}
	{word.book}
	{#if word.creation_date}
		&middot;
	{/if}
{/if}
{#if word.creation_date}
	{word.creation_date}
{/if}
