<script lang="ts">
	import { distance } from 'fastest-levenshtein';

	import type { Compound } from '$lib/types';
	import { normalize } from '$lib/util';

	import CompoundDetails from './CompoundDetails.svelte';
	import CompoundSpace from './CompoundSpace.svelte';
	import Link from '$lib/components/Link.svelte';
	import Search from '$lib/components/Search.svelte';
	import Meta from '$lib/components/Meta.svelte';

	const { data } = $props();

	function getCompoundRecognition(compound: Compound) {
		return Math.max(...Object.values(compound.uses));
	}

	const compounds = $derived(
		Object.values(data.phrases).sort(
			(a: Compound, b: Compound) =>
				getCompoundRecognition(b) - getCompoundRecognition(a)
		)
	);

	let search = $state('');
	let selectedCompound = $state<Compound | null>(null);

	const fixedSearch = $derived(normalize(search));

	const filteredCompounds = $derived(
		compounds
			.filter(
				compound =>
					compound.compound.includes(fixedSearch) ||
					distance(compound.compound, fixedSearch) <= 2 ||
					Object.keys(compound.uses).some(
						use =>
							use.includes(fixedSearch) ||
							distance(use, fixedSearch) <= 2
					)
			)
			.sort((a, b) => {
				if (fixedSearch === '') return 0;
				if (a.compound === fixedSearch) return -1;
				if (b.compound === fixedSearch) return 1;
				if (Object.keys(a.uses).includes(fixedSearch)) return -1;
				if (Object.keys(b.uses).includes(fixedSearch)) return 1;
				const aContains = Object.keys(a.uses).some(use =>
					use.includes(fixedSearch)
				);
				const bContains = Object.keys(b.uses).some(use =>
					use.includes(fixedSearch)
				);
				if (aContains && bContains) return 0;
				if (aContains && !bContains) return -1;
				if (!aContains && bContains) return 1;
				return 0;
			})
	);
</script>

<Meta
	title="ilo ku – nimi.li | Toki Pona Dictionary"
	description="Explore the public subset of Sonja Lang's Toki Pona Dictionary."
	url="https://nimi.li/ilo-ku"
	keywords={['compounds', 'ku', 'ilo ku', 'compound expressions']}
/>

<h1 class="text-4xl">ilo ku</h1>

<p class="mt-2">
	<b>ilo ku</b> lets you explore the
	<Link href="https://tokipona.org/compounds.txt">public subset</Link> of
	<cite>
		<Link
			href="https://www.amazon.com/Toki-Pona-Dictionary-Official/dp/0978292367"
		>
			Toki Pona Dictionary</Link
		></cite
	>. Click on an expression to see more!
</p>

<blockquote class="my-4 alert p-4 leading-relaxed">
	<p>
		<strong>Warning!</strong>
		There are no hard-set compound phrases in Toki Pona. This is by design! Part
		of the goal of the language is for you to break down your surroundings from
		your own viewpoint and describe things dynamically, not use the same phrase
		to mean the same thing all the time. Think about what the topic means to
		you, and consider what is important about it.
	</p>

	<footer class="mt-2">
		&mdash; jan Lipiki, in <cite>Toki Pona Dictionary</cite>
	</footer>
</blockquote>

<p class="text-muted">
	{filteredCompounds.length} / {compounds.length}
</p>

<Search placeholder="o alasa..." bind:value={search} />

<div class="mt-4 grid grid-cols-fill-64 gap-2">
	{#each filteredCompounds as compound (compound.compound)}
		<CompoundSpace
			{compound}
			onclick={() => {
				if (selectedCompound?.compound === compound.compound)
					selectedCompound = null;
				else selectedCompound = compound;
			}}
		/>
	{/each}
</div>

<CompoundDetails bind:compound={selectedCompound} />
