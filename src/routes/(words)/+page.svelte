<script lang="ts">
	import { categories, sortingMethod } from '$lib/stores';

	import Link from '$lib/components/Link.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import WordView from '$lib/components/WordView.svelte';
	import { Book } from '@kulupu-linku/sona/utils';

	const { data } = $props();

	let search = $state('');

	let books = $state(
		Object.keys(Book.enum).map((book) => ({
			name: book as Book,
			shown: true
		}))
	);
</script>

<Meta
	title="nimi.li | Toki Pona Dictionary"
	description="Comprehensive Toki Pona dictionary with interactive search, detailed word information, and multiple writing systems."
	url="https://nimi.li/"
/>

<h1 class="text-2xl">dictionary</h1>

<p class="mt-2 mb-4">
	<b>nimi.li</b> is an interactive dictionary for <Link
		href="https://tokipona.net"
	>
		Toki Pona
	</Link>. Click on a word to read more!
</p>

<WordView
	bind:search
	words={Object.values(data.words)}
	bind:books
	lipamanka={data.lipamanka}
	bind:sortingMethod={$sortingMethod}
	revealWord={(referred) => {
		$categories = $categories.map((category) => ({
			...category,
			shown:
				category.shown ||
				category.name === data.words[referred].usage_category
		}));
		books = books.map((book) => ({
			...book,
			shown: book.shown || book.name === data.words[referred].book
		}));
	}}
/>
