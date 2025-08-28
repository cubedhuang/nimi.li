<script lang="ts">
	import { goto } from '$app/navigation';

	import WordView from '$lib/components/WordView.svelte';
	import Meta from '$lib/components/Meta.svelte';

	const { data } = $props();

	let words = $state(Object.values(data.words));
</script>

<Meta
	title="sandbox – nimi.li | Toki Pona Dictionary"
	description="Explore Linku's sandbox, a collection of experimental Toki Pona words."
	url="https://nimi.li/sandbox"
	keywords={['sandbox']}
/>

<h1 class="text-4xl">sandbox</h1>

<p class="mt-2 leading-relaxed">
	Explore Linku's <b>sandbox</b>, a collection of proposed words which are
	<em>not actively in use</em>. Some of these words are of value to the
	community as pieces of culture, essentially memes. Some reflect early drafts
	of Toki Pona. Many are one-off jokes, created and abandoned immediately.
</p>

<p class="mt-4 alert p-4 leading-relaxed">
	<strong>Warning!</strong>
	If you are a learner, <em>stick to the main dictionary</em>. These words
	will not help you speak the language.
</p>

<WordView
	bind:words
	languages={data.languages}
	revealWord={(referred) => {
		if (!words.some((word) => word.word === referred)) {
			goto(`/${referred}`);
		}
	}}
/>
