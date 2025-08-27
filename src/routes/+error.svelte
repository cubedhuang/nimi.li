<script lang="ts">
	import { page } from '$app/state';

	import { language } from '$lib/stores';
	import { getWordLink } from '$lib/util';
</script>

<svelte:head>
	<title>pakala &ndash; {page.status}</title>
</svelte:head>

<div class="py-24">
	<h1 class="text-5xl text-orange-500 sm:text-6xl darkish:text-orange-400">
		pakala nanpa {page.status}!
	</h1>

	{#if page.status === 404}
		<p class="mt-4">lipu ni li lon ala.</p>
		<p class="text-muted">this page doesn't exist!</p>
	{:else}
		<p class="mt-4">ijo mi li pakala!</p>
		<p class="text-muted">whoops, my bad.</p>
	{/if}

	{#if page.error?.closest?.length}
		<h2 class="mt-6 text-2xl">ken la sina wile e lipu ni:</h2>

		<ul class="mt-2 flex flex-wrap gap-1">
			{#each page.error?.closest as word (word)}
				<li>
					<a
						href={getWordLink(word, $language)}
						class="inline-block interactable px-2 py-1"
					>
						{word}
					</a>
				</li>
			{/each}
		</ul>
	{/if}

	<p class="mt-6">
		<a href="/" class="inline-block interactable px-2 py-1">
			o tawa lipu suli
		</a>
	</p>
</div>
