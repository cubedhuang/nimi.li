<script lang="ts">
	import type { Compound } from '$lib/types';

	import Space from '$lib/components/Space.svelte';

	interface Props {
		compound: Compound;
		onclick: () => void;
	}

	const { compound, onclick }: Props = $props();

	const uses = $derived(
		Object.entries(compound.uses).sort((a, b) => b[1] - a[1])
	);
	const usesString = $derived(
		uses.map(([use]) => use.replaceAll(' (', '\u00a0(')).join(', ')
	);
</script>

<Space
	{onclick}
	id={compound.compound}
	href="/ilo-ku/{compound.compound.replace(/ /g, '-')}"
>
	<div class="h-full">
		{#if compound.glyphs?.length}
			<div class="float-right flex flex-col items-end text-right">
				{#each compound.glyphs as glyph (glyph)}
					<p class="font-pona text-4xl whitespace-nowrap">{glyph}</p>
				{/each}
			</div>
		{/if}

		<h2 class="text-xl">{compound.compound}</h2>

		<p class="text-muted">{uses[0][1]}%</p>

		<p class="line-clamp-4">
			{usesString}
		</p>
	</div>
</Space>
