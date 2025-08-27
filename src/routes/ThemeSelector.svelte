<script lang="ts">
	import { browser } from '$app/environment';

	import { persisted } from '$lib/stores';
	import { flyAndScale } from '$lib/transitions';

	import FontOption from './FontOption.svelte';
	import SystemOption from './SystemOption.svelte';
	import ThemeOption from './ThemeOption.svelte';

	const firstTime = persisted('first-time', browser);
	let opened = $state(false);

	$effect(() => {
		if ($firstTime) {
			opened = true;
			$firstTime = false;
		}
	});
</script>

<svelte:window
	onclick={() => {
		opened = false;
	}}
	ontouchstart={() => {
		opened = false;
	}}
/>

<div class="relative">
	<button
		onclick={e => {
			e.stopPropagation();
			opened = !opened;
		}}
		ontouchstart={e => e.stopPropagation()}
		class="cursor-pointer nav-item-interactive"
		aria-label="set color theme and font"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z"
			/>
		</svg>
	</button>

	{#if opened}
		<div
			transition:flyAndScale={{ x: 4, y: -8 }}
			class="absolute top-full right-0 z-50 mt-2 w-max rounded-lg border-2 bg-card p-4 shadow-md"
		>
			<div class="flex justify-between">
				<SystemOption
					class="bg-white text-gray-950 dark:bg-black dark:text-gray-50"
				/>
				<ThemeOption value="amoled" class="bg-black text-gray-50" />
			</div>

			<div class="mt-2 grid grid-cols-4 gap-2">
				<ThemeOption value="light" class="bg-white text-gray-950" />
				<ThemeOption
					value="orange"
					class="bg-orange-100 text-zinc-950"
				/>
				<ThemeOption value="dark" class="bg-zinc-900 text-zinc-50" />
				<ThemeOption value="stone" class="bg-stone-800 text-stone-50" />
				<ThemeOption value="pink" class="bg-pink-100 text-pink-900" />
				<ThemeOption value="blue" class="bg-blue-100 text-blue-900" />
				<ThemeOption value="red" class="bg-red-950 text-red-100" />
				<ThemeOption value="dim" class="bg-gray-800 text-gray-50" />
				<ThemeOption
					value="green"
					class="bg-green-100 text-green-900"
				/>
				<ThemeOption
					value="purple"
					class="bg-purple-100 text-purple-900"
				/>
				<ThemeOption
					value="emerald"
					class="bg-emerald-950 text-emerald-100"
				/>
				<ThemeOption
					value="indigo"
					class="bg-indigo-950 text-indigo-100"
				/>
			</div>

			<div class="mt-3 grid gap-2">
				<FontOption value="font-sans" name="Inter" />
				<FontOption
					value="font-atkinson"
					name="Atkinson Hyperlegible"
				/>
				<FontOption value="font-serif" name="Source Serif" />
				<FontOption value="font-mono" name="IBM Plex Mono" />
				<FontOption value="font-dyslexic" name="OpenDyslexic" />
			</div>
		</div>
	{/if}
</div>
