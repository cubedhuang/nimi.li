<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import Meta from '$lib/components/Meta.svelte';

	const { data } = $props();
	const phrase = $derived(data.phrase);
	function getSlug(compound: string) {
		return compound.replace(/ /g, '-');
	}
</script>

<Meta
	title="{phrase.compound} – nimi.li | Toki Pona Dictionary"
	description={Object.keys(phrase.uses).join(', ')}
	url="https://nimi.li/ilo-ku/{getSlug(phrase.compound)}"
	image="https://raw.githubusercontent.com/lipu-linku/ijo/main/sitelenpona/sitelen-seli-kiwen/${phrase.compound.split(
		' '
	)[0]}.png"
	imageSize="256"
	keywords={[phrase.compound]}
/>

<div class="flex flex-wrap items-center gap-1">
	<h1 class="mr-auto text-4xl">{phrase.compound}</h1>

	<div class="flex gap-1">
		<svelte:element
			this={data.previous ? 'a' : 'button'}
			href={data.previous
				? `/ilo-ku/${getSlug(data.previous.compound)}`
				: undefined}
			class="interactable p-2"
			disabled={!data.previous}
			aria-label="previous word"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
				/>
			</svg>
		</svelte:element>

		<svelte:element
			this={data.next ? 'a' : 'button'}
			href={data.next
				? `/ilo-ku/${getSlug(data.next.compound)}`
				: undefined}
			class="interactable p-2"
			disabled={!data.next}
			aria-label="next word"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
				/>
			</svg>
		</svelte:element>

		<a href="/ilo-ku" class="interactable p-2" aria-label="home">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
				/>
			</svg>
		</a>
	</div>
</div>

<div class="mt-6 box">
	<h2 class="text-lg">see also</h2>

	<p class="mt-1">
		{#each phrase.compound.split(' ') as word, i (word)}
			{i !== 0 ? ',' : ''}
			<Link href="/{word}">{word}</Link>
		{/each}
	</p>

	<h2 class="mt-4 text-lg">ku translations</h2>

	<div class="mt-1 flex flex-col">
		{#each Object.entries(phrase.uses) as [use, count] (use)}
			<p>
				{use}
				<span class="text-muted">
					&middot; {count}%
				</span>
			</p>
		{/each}
	</div>
</div>
