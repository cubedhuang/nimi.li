<script lang="ts">
	import { language } from '$lib/stores';
	import type { SignData } from '$lib/types';
	import { getWordLink, getTranslation } from '$lib/util';

	import Details from '$lib/components/Details.svelte';
	import SignsList from '$lib/components/SignsList.svelte';
	import Wikipedia from '$lib/components/icons/Wikipedia.svelte';
	import XMark from '$lib/components/icons/XMark.svelte';

	interface Props {
		data: SignData | null;
		onclose: (word: string) => void;
	}

	let { data: possibleData = $bindable(), onclose }: Props = $props();
</script>

<Details
	bind:value={possibleData}
	key={(data) => data.id}
	onclose={(data) => onclose(data.id)}
	padding={false}
>
	{#snippet children(data)}
		{@const { words, signs } = data}

		<video
			src={signs[0].video.mp4}
			class="aspect-video w-full bg-secondary"
			autoplay
			loop
			muted
			playsinline
		>
			<track kind="captions" />
		</video>

		<div class="p-6">
			<div class="flex items-end">
				<h2 class="text-2xl">
					{words
						.map((w) => w.word)
						.join('/')
						.toUpperCase()}
				</h2>

				<div class="ml-auto flex items-center gap-1">
					<a
						href={getWordLink(words[0].id, $language)}
						class="interactable px-2 py-1"
					>
						more
					</a>

					{#if words[0].resources?.sona_pona}
						<a
							href={words[0].resources.sona_pona}
							target="_blank"
							rel="noreferrer noopener"
							class="interactable p-1"
						>
							<Wikipedia />
						</a>
					{/if}

					<button
						class="interactable p-1"
						onclick={() => {
							possibleData = null;
						}}
						aria-label="close popup"
					>
						<XMark />
					</button>
				</div>
			</div>

			{#each words as word (word.id)}
				{@const translation = getTranslation(word, $language)}

				<p class="mt-2">
					{translation.definition}
				</p>
			{/each}

			<SignsList {signs} />
		</div>
	{/snippet}
</Details>
