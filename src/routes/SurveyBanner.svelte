<script lang="ts">
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';

	import { outclick } from '$lib/actions/outclick';
	import { persisted } from '$lib/stores';
	import { flyAndScale } from '$lib/transitions';

	const isBannerShown = persisted('survey-2025-shown', browser);

	let opened = $state(false);
</script>

{#if $isBannerShown}
	<div
		out:slide
		class="full flex justify-between gap-2 border-b-2 border-secondary-border bg-secondary px-4 py-4 pt-5 text-sm text-secondary-foreground sm:px-8"
	>
		<p>
			The 2025
			<a
				href="https://linku.la/wile"
				target="_blank"
				rel="noopener noreferrer"
				class="items-center link"
			>
				Linku word usage survey<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="ml-1 inline-block size-4 -translate-y-0.5"
				>
					<path
						d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z"
					/>
					<path
						d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z"
					/>
				</svg>
			</a>
			and the new
			<a
				href="https://linku.la/wile-glyphs"
				target="_blank"
				rel="noopener noreferrer"
				class="items-center link"
			>
				Linku <i>sitelen pona</i> glyph survey<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="ml-1 inline-block size-4 -translate-y-0.5"
				>
					<path
						d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z"
					/>
					<path
						d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z"
					/>
				</svg>
			</a>
			are now open! <strong>nimi.li</strong> relies on kulupu Linku to describe
			the community's usage of words. Please take the survey to help improve
			the dictionary!
		</p>

		<div
			class="relative self-start"
			use:outclick
			onoutclick={() => {
				opened = false;
			}}
		>
			<button
				aria-label="dismiss alert"
				class="icon-interactable shrink-0 translate-y-0.5 self-start"
				onclick={() => {
					opened = !opened;
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="size-4"
				>
					<path
						d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"
					/>
				</svg>
			</button>

			{#if opened}
				<div
					transition:flyAndScale={{ x: 4, y: -8 }}
					class="absolute top-full right-0 z-50 mt-2 w-max rounded-lg border-2 bg-card p-4 text-card-foreground shadow-md"
				>
					<p>Have you taken the surveys yet?</p>

					<div class="mt-2 flex w-56 gap-2">
						<button
							class="flex-1 interactable border-secondary-border bg-secondary px-2 py-1 hv:border-accent"
							onclick={() => {
								opened = false;
								$isBannerShown = false;
							}}
						>
							Yes, I have!
						</button>

						<button
							class="flex-1 interactable border-secondary-border bg-secondary px-2 py-1 hv:border-accent"
							onclick={() => {
								opened = false;
							}}
						>
							Not yet&hellip;
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
