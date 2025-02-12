<script lang="ts">
	import type { LocalizedWord } from '@kulupu-linku/sona';

	import { language } from '$lib/stores';
	import {
		categoryColors,
		categoryTextColors,
		getWordLink,
		getTranslation,
		getUcsur
	} from '$lib/util';

	import Copy from '$lib/components/Copy.svelte';
	import Details from '$lib/components/Details.svelte';
	import ExternalLink from '$lib/components/icons/ExternalLink.svelte';
	import KuData from './KuData.svelte';
	import Link from '$lib/components/Link.svelte';
	import LipamankaData from '$lib/components/LipamankaData.svelte';
	import PuData from './PuData.svelte';
	import Wikipedia from './icons/Wikipedia.svelte';
	import WordEtymology from './WordEtymology.svelte';
	import WordUsageSummary from './WordUsageSummary.svelte';
	import XMark from '$lib/components/icons/XMark.svelte';

	interface Props {
		word: LocalizedWord | null;
		lipamanka?: string;
		onrefer: (word: string) => void;
	}

	let {
		word: possibleWord = $bindable(),
		lipamanka,
		onrefer
	}: Props = $props();

	let audio = $state<HTMLAudioElement | undefined>();

	function play() {
		audio?.play();
	}

	const audioUrl = $derived(possibleWord?.audio[0]?.link);
</script>

<Details bind:value={possibleWord} key={word => word.id}>
	{#snippet children(word)}
		{@const translation = getTranslation(word, $language)}

		<div class="flex items-end">
			<h2 class="text-2xl">{word.word}</h2>

			<div class="ml-auto flex items-center gap-2">
				<a
					href={getWordLink(word.id, $language)}
					class="interactable px-2 py-1"
				>
					more
				</a>

				{#if word.resources?.sona_pona}
					<a
						href={word.resources.sona_pona}
						target="_blank"
						rel="noreferrer noopener"
						class="interactable p-1"
					>
						<Wikipedia />
					</a>
				{/if}

				{#if audioUrl}
					<audio src={audioUrl} bind:this={audio}></audio>

					<button
						class="interactable p-1"
						aria-label="play audio"
						onclick={play}
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
								d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
							/>
						</svg>
					</button>
				{/if}

				<button
					class="interactable p-1"
					onclick={() => {
						possibleWord = null;
					}}
					aria-label="close popup"
				>
					<XMark />
				</button>
			</div>
		</div>

		<p class="text-muted">
			<WordUsageSummary {word} />
		</p>

		{#if word.usage_category === 'obscure' || word.usage_category === 'sandbox'}
			<div class="mt-2 flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="size-4 shrink-0"
				>
					<path
						d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z"
					/>
					<path
						d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z"
					/>
				</svg>

				<p class="text-sm">
					{#if word.usage_category === 'sandbox'}
						This word is in the
						<b>sandbox</b>, so almost no speakers will understand
						it.
					{:else}
						This word is
						<b class={categoryTextColors.obscure}>obscure</b>, so
						most speakers will not understand it.
					{/if}
				</p>
			</div>
		{/if}

		{#if word.deprecated}
			<div class="mb-4 mt-2 flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="size-4 shrink-0"
				>
					<path
						fill-rule="evenodd"
						d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
						clip-rule="evenodd"
					/>
				</svg>

				<p class="text-sm">
					This word is
					<strong>deprecated by its creator</strong>, and its use is
					discouraged.
				</p>
			</div>
		{/if}

		<p class="mt-2">
			{translation.definition}
		</p>

		{#if word.see_also.length}
			<p class="mt-2">
				see
				{#each word.see_also as other, i (other)}
					<!-- Formatting here is weird to prevent additional spaces between commas -->
					{i !== 0 ? ',' : ''}
					<Link
						href="#{other}"
						onclick={() => {
							onrefer(other);
						}}>{other}</Link
					>
				{/each}
			</p>
		{/if}

		{#if lipamanka}
			<div class="mt-2">
				<LipamankaData {word} content={lipamanka} />
			</div>
		{/if}

		{#if word.pu_verbatim?.en}
			<h3 class="mt-2 flex items-center text-lg">
				pu verbatim
				<a
					class="icon-interactable"
					href="https://sona.pona.la/wiki/Toki_Pona:_The_Language_of_Good"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="source"
				>
					<ExternalLink />
				</a>
			</h3>

			<PuData data={word.pu_verbatim} />
		{/if}

		{#if word.ku_data}
			<h3 class="mt-2 flex items-center text-lg">
				ku translations
				<a
					class="icon-interactable"
					href="https://tokipona.org/nimi_pu.txt"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="source"
				>
					<ExternalLink />
				</a>
			</h3>

			<KuData data={word.ku_data} />
		{/if}

		<h3 class="mt-2 text-lg">origin</h3>

		<WordEtymology {word} {translation} />

		{#if word.representations?.ligatures?.length}
			<h3 class="mt-2 text-lg">sitelen pona</h3>

			<span class="font-pona text-4xl">
				{word.representations.ligatures.join(' ')}
			</span>

			{#if translation.sp_etymology}
				<p class="text-muted">
					{translation.sp_etymology}
				</p>
			{/if}
		{/if}

		{#if word.representations?.sitelen_sitelen}
			<h3 class="mt-2 text-lg">sitelen sitelen</h3>

			<img
				src="/internal/api/ss?word={word.word}"
				alt="{word.word} sitelen sitelen"
				class="invertible h-10 w-10"
			/>
		{/if}

		{#if word.representations?.sitelen_jelo}
			<h3 class="mt-2 text-lg">sitelen jelo</h3>

			<p class="text-3xl">
				{word.representations.sitelen_jelo.join('')}
			</p>
		{/if}

		{#if word.representations?.ucsur}
			<h3 class="mt-2 text-lg">ucsur</h3>

			<p class="flex items-center gap-2">
				{word.representations.ucsur}

				<Copy value={getUcsur(word)} />
			</p>
		{/if}

		{#if translation.commentary}
			{#each translation.commentary.split('\n') as line, i}
				<p class="text-muted" class:mt-2={i === 0}>
					{line}
				</p>
			{/each}
		{/if}

		<span
			class="absolute -left-4 -top-4 rounded-full p-4 {categoryColors[
				word.usage_category
			]}"
		></span>
	{/snippet}
</Details>
