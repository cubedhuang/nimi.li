<script lang="ts">
	import Collapsible from './Collapsible.svelte';

	interface Props {
		data: Record<string, number>;
	}

	const { data }: Props = $props();

	const entries = $derived(Object.entries(data).sort((a, b) => b[1] - a[1]));
</script>

<Collapsible class="text-sm leading-relaxed">
	{#each entries as [key, value] (key)}
		<!-- eslint-disable-next-line svelte/no-useless-mustaches for some reason it thinks that this is unnecessary -->
		{key}<sup class="text-xs">{value}</sup>{' '}
	{/each}
</Collapsible>
