<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		data: Record<string, string>;
	}

	const { data }: Props = $props();

	const puData = $derived(data[page.data.lang] ?? data.en);
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
