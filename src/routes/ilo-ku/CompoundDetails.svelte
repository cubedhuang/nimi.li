<script lang="ts">
	import type { Compound } from '$lib/types';

	import Details from '$lib/components/Details.svelte';
	import Link from '$lib/components/Link.svelte';
	import XMark from '$lib/components/icons/XMark.svelte';

	interface Props {
		compound: Compound | null;
	}

	let { compound: possibleCompound = $bindable() }: Props = $props();
</script>

<Details bind:value={possibleCompound} key={(compound) => compound.compound}>
	{#snippet children(compound)}
		<div class="flex">
			<h2 class="text-2xl">{compound.compound}</h2>

			<div class="ml-auto flex items-center gap-2">
				<a
					href="/ilo-ku/{compound.compound.replace(/ /g, '-')}"
					class="interactable px-2 py-1"
				>
					more
				</a>
				<button
					class="interactable p-1"
					onclick={() => {
						possibleCompound = null;
					}}
					aria-label="close popup"
				>
					<XMark />
				</button>
			</div>
		</div>

		<p class="font-pona text-4xl">
			{compound.glyphs?.join(' ') || compound.compound}
		</p>

		<p>
			see
			{#each compound.compound.split(' ') as word, i (word)}
				{i !== 0 ? ',' : ''}
				<Link href="/{word}">{word}</Link>
			{/each}
		</p>

		<div class="mt-2 flex flex-col">
			{#each Object.entries(compound.uses) as [use, count] (use)}
				<p>
					{use}
					<span class="text-muted">
						&middot; {count}%
					</span>
				</p>
			{/each}
		</div>
	{/snippet}
</Details>
