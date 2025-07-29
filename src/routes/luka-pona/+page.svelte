<script lang="ts">
	import type { PageData } from './$types';

	import { azWordSort, categoryColors, normalize } from '$lib/util';
	import { scoreSearch } from '$lib/search';
	import { autoplay, language } from '$lib/stores';
	import type { SignData } from '$lib/types';

	import ColoredCheckbox from '$lib/components/ColoredCheckbox.svelte';
	import LukaPonaEntry from './LukaPonaEntry.svelte';
	import Search from '$lib/components/Search.svelte';
	import SignDetails from './SignDetails.svelte';
	import Meta from '$lib/components/Meta.svelte';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	const signs = $derived(data.signs);

	let search = $state('');
	let selectedSign = $state<SignData | null>(null);

	const genericFilteredSigns = $derived(
		signs.sort(({ words: [a] }, { words: [b] }) => azWordSort(a, b))
	);

	function filter(signs: SignData[]) {
		const q = normalize(search);

		if (!q) {
			return signs;
		}

		return signs
			.map(
				data =>
					[
						data,
						Math.max(
							...data.words.map(word =>
								scoreSearch(word, q, $language)
							)
						)
					] as const
			)
			.filter(([, score]) => score > 0)
			.sort((a, b) => b[1] - a[1])
			.map(([data]) => data);
	}

	const filteredSigns = $derived(filter(genericFilteredSigns));
</script>

<Meta
	title="luka pona – nimi.li | Toki Pona Dictionary"
	description="Explore and search for signs in Luka Pona Sign Language."
	url="https://nimi.li/luka-pona"
	keywords={[
		'luka pona',
		'sign language',
		'toki pona sign language',
		'toki pona sign language dictionary'
	]}
/>

<h1 class="text-4xl">luka pona</h1>

<p class="mt-2">
	Explore signs for <b>Luka Pona Sign Language</b>. Hover over a sign to watch
	it!
</p>

<div class="mt-4 flex flex-wrap gap-1 sm:gap-x-2 sm:gap-y-1">
	<ColoredCheckbox
		bind:checked={$autoplay}
		label="Play Videos Automatically"
		color={categoryColors['core']}
	/>
</div>

<p class="mt-2 text-muted">
	{filteredSigns.length} / {genericFilteredSigns.length}
</p>

<Search placeholder="o alasa..." bind:value={search} />

<div class="mt-4 grid gap-3 grid-cols-fill-64">
	{#each filteredSigns as signData (signData.id)}
		<LukaPonaEntry
			word={signData.words
				.map(w => w.word)
				.join('/')
				.toUpperCase()}
			video={signData.signs[0].video}
			onclick={() => {
				if (selectedSign?.id === signData.id) selectedSign = null;
				else selectedSign = signData;
			}}
		/>
	{/each}
</div>

{#if !filteredSigns.length}
	<p>wile sina la, nimi li lon ala!</p>
	<p class="text-muted">Your query didn't match any words!</p>
{/if}

<SignDetails bind:data={selectedSign} />
