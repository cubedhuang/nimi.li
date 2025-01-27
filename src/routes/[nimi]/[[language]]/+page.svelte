<script lang="ts">
	import { page } from '$app/state';

	import { outclick } from '$lib/actions/outclick';
	import { flyAndScale } from '$lib/transitions';
	import {
		categoryTextColors,
		getUsageCategoryFromPercent,
		getWordDisplayRecognition,
		getWordLink,
		getTranslation,
		getUcsur
	} from '$lib/util';

	import AudioPlayer from './AudioPlayer.svelte';
	import Copy from '$lib/components/Copy.svelte';
	import ExternalLink from '$lib/components/icons/ExternalLink.svelte';
	import KuData from '$lib/components/KuData.svelte';
	import Link from '$lib/components/Link.svelte';
	import LipamankaData from '$lib/components/LipamankaData.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import PuData from '$lib/components/PuData.svelte';
	import SignsList from '$lib/components/SignsList.svelte';
	import Wikipedia from '$lib/components/icons/Wikipedia.svelte';
	import WordEtymology from '$lib/components/WordEtymology.svelte';

	const { data } = $props();

	const language = $derived(page.params.language);
	const word = $derived(data.word);

	const translation = $derived(getTranslation(word, language));

	let showHistory = $state(false);
</script>

<Meta
	title="{word.word} – nimi.li | Toki Pona Dictionary"
	description={translation.definition}
	url="https://nimi.li{getWordLink(word.id, language)}"
	image="https://raw.githubusercontent.com/lipu-linku/ijo/main/sitelenpona/sitelen-seli-kiwen/${word.id}.png"
	imageSize="256"
	keywords={[word.word]}
/>

<div class="flex flex-wrap items-center gap-2">
	<h1 class="mr-auto text-4xl">{word.word}</h1>

	<div class="flex gap-2">
		{#if word.resources?.sona_pona}
			<a
				href={word.resources.sona_pona}
				target="_blank"
				rel="noreferrer noopener"
				class="interactable p-2"
			>
				<Wikipedia />
			</a>
		{/if}

		<svelte:element
			this={data.previous ? 'a' : 'button'}
			href={data.previous
				? getWordLink(data.previous, language)
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
			href={data.next ? getWordLink(data.next, language) : undefined}
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

		<a
			href={word.usage_category === 'sandbox' ? '/sandbox' : '/'}
			class="interactable p-2"
			aria-label="home"
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
					d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
				/>
			</svg>
		</a>
	</div>
</div>

{#if word.usage_category === 'obscure' || word.usage_category === 'sandbox'}
	<div class="-mb-2 mt-4 flex items-center gap-2">
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

		<p>
			{#if word.usage_category === 'sandbox'}
				This word is in the
				<b>sandbox</b>, so almost no speakers will understand it.
			{:else}
				This word is
				<b class={categoryTextColors.obscure}>obscure</b>, so most
				speakers will not understand it.
			{/if}
		</p>
	</div>
{/if}

<div class="mt-6 grid gap-4 sm:grid-cols-2">
	<div class="box">
		{#if word.deprecated}
			<div class="mb-4 flex items-center gap-2">
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

		<h2 class="text-lg">meaning</h2>
		<p class="mt-1">
			{translation.definition}
		</p>

		{#if word.see_also.length}
			<h2 class="mt-4 text-lg">see also</h2>

			<p class="mt-1">
				{#each word.see_also as other, i (other)}
					{#if i > 0},{/if}
					<Link href={getWordLink(other, language)}>{other}</Link>
				{/each}
			</p>
		{/if}

		{#if data.lipamanka}
			<div class="mt-4">
				<LipamankaData {word} content={data.lipamanka} space />
			</div>
		{/if}

		{#if word.pu_verbatim?.en}
			<h2 class="mb-1 mt-4 flex items-center text-lg">
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
			</h2>

			<PuData data={word.pu_verbatim} {language} />
		{/if}

		{#if word.ku_data}
			<h2 class="mb-1 mt-4 flex items-center text-lg">
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
			</h2>

			<KuData data={word.ku_data} />
		{/if}
	</div>

	<div class="box">
		<h2 class="text-lg">usage</h2>

		<div class="mt-1 flex items-center">
			<p>
				<b class={categoryTextColors[word.usage_category]}>
					{word.usage_category} &middot; {getWordDisplayRecognition(
						word
					)}
				</b>
				<span class="text-muted">usage</span>
			</p>

			<div class="relative flex items-center">
				{#if Object.keys(word.usage).length}
					<button
						class="icon-interactable"
						aria-label="view usage history"
						onclick={() => (showHistory = !showHistory)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="h-5 w-5"
						>
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				{/if}

				{#if showHistory && word.usage}
					{@const dates = Object.keys(word.usage).sort()}

					<div
						class="absolute left-1/2 top-full flex w-max -translate-x-1/2 gap-4 rounded-lg border bg-card p-4 shadow-md"
						transition:flyAndScale|local={{ y: -4 }}
						use:outclick
						onoutclick={() => {
							// delay to make clicking on the button also close
							requestAnimationFrame(() => {
								showHistory = false;
							});
						}}
					>
						{#each dates as date (date)}
							{@const usage = Number(word.usage[date])}
							{@const usageCategory =
								getUsageCategoryFromPercent(usage)}

							<span class="flex flex-col">
								<b class={categoryTextColors[usageCategory]}>
									{usage}%
								</b>
								<span class="text-xs text-muted">{date}</span>
							</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<p>
			<span class="text-muted">found in</span>
			<b>
				{word.book === 'none' ? 'no book' : word.book}
			</b>
		</p>

		{#if word.coined_era}
			<p>
				<span class="text-muted">coined</span>
				<b>
					{word.coined_era}
					{#if word.coined_year}
						&middot; {word.coined_year}
					{/if}
				</b>
			</p>
		{/if}

		<h2 class="mt-4 text-lg">origin</h2>

		<div class="mt-1">
			<WordEtymology {word} {translation} />
		</div>

		{#if word.audio.length}
			<h2 class="mt-4 text-lg">listen</h2>

			{#each word.audio as audio}
				<p class="mt-1">
					<AudioPlayer {audio} />
				</p>
			{/each}
		{/if}

		{#if word.author_verbatim}
			<div class="mt-4 flex items-center gap-2">
				<h2 class="text-lg">author verbatim</h2>

				{#if word.author_verbatim_source}
					<a
						href={word.author_verbatim_source}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="source"
						class="text-muted transition hv:text-foreground"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="h-5 w-5"
						>
							<path
								fill-rule="evenodd"
								d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
								clip-rule="evenodd"
							/>
							<path
								fill-rule="evenodd"
								d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				{/if}
			</div>

			{#each word.author_verbatim.split('\n') as line, i}
				<p class="mt-1">
					{line}
				</p>
			{/each}
		{/if}

		{#if translation.commentary}
			<h2 class="mt-4 text-lg">commentary</h2>
			{#each translation.commentary.split('\n') as line, i}
				<p class="mt-1">
					{line}
				</p>
			{/each}
		{/if}
	</div>

	<div
		class:box={word.representations?.ligatures?.length ||
			word.representations?.ucsur}
	>
		{#if word.representations?.ligatures?.length}
			<h2 class="text-lg">sitelen pona</h2>

			<span class="mt-1 font-pona text-7xl">
				{word.representations.ligatures.join(' ')}
			</span>

			{#if translation.sp_etymology}
				<p class="text-muted">
					{translation.sp_etymology}
				</p>
			{/if}
		{/if}

		{#if word.representations?.sitelen_sitelen}
			<h2 class="mt-4 text-lg">sitelen sitelen</h2>

			<img
				src="/internal/api/ss?word={word.word}"
				alt="{word.word} sitelen sitelen"
				class="invertible mt-1 h-16 w-16"
			/>
		{/if}

		{#if word.representations?.sitelen_jelo}
			<h2 class="mt-4 text-lg">sitelen jelo</h2>

			<p class="mt-1 text-6xl">
				{word.representations.sitelen_jelo.join('')}
			</p>
		{/if}

		{#if word.representations?.sitelen_emosi}
			<h2 class="mt-4 text-lg">sitelen Emosi</h2>

			<p class="mt-1 text-6xl">
				{word.representations.sitelen_emosi}
			</p>
		{/if}

		{#if word.representations?.ucsur}
			<h2
				class="text-lg"
				class:mt-4={word.representations.ligatures?.length}
			>
				ucsur
			</h2>

			<p class="mt-1 flex items-center gap-2">
				{word.representations.ucsur}

				<Copy value={getUcsur(word)} />
			</p>
		{/if}
	</div>

	{#if data.signs?.length}
		<div class="box">
			<h2 class="text-lg">luka pona</h2>

			{#if data.signs[0].video.mp4}
				<p class="mt-2">
					<video
						src={data.signs[0].video.mp4}
						class="aspect-video w-full max-w-sm rounded-lg bg-secondary"
						autoplay
						loop
						muted
						playsinline
					>
						<track kind="captions" />
					</video>
				</p>
				<p class="mt-2">
					{#if data.signs[0].video.gif}
						<Link href={data.signs[0].video.gif}>gif</Link>
						&middot;
					{/if}
					<Link href={data.signs[0].video.mp4}>mp4</Link>
				</p>
			{/if}

			<SignsList signs={data.signs} />
		</div>
	{/if}
</div>
