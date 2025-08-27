<script lang="ts">
	import { language } from '$lib/stores';

	interface Props {
		data: Record<string, string>;
		language?: string;
	}

	const { data, language: lang }: Props = $props();

	const puData = $derived(data[lang || $language || 'en'] ?? data.en);
</script>

<ul>
	{#each puData.split('\n') as line, i (i)}
		{@const partOfSpeech = line.split(' ')[0]}
		{@const definition = line.slice(partOfSpeech.length + 1)}

		<li>
			<span class="shrink-0 text-xs text-muted">{partOfSpeech}</span>
			{definition}
		</li>
	{/each}
</ul>
