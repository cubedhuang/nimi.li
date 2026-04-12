<script lang="ts">
	import { browser } from '$app/environment';

	import { outclick } from '$lib/actions/outclick';
	import PaintBrushIconMini from '$lib/components/icons/PaintBrushIconMini.svelte';
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

<div class="popover-container" use:outclick onoutclick={() => (opened = false)}>
	<button
		onclick={() => {
			opened = !opened;
		}}
		class="nav-icon-button"
		aria-label="set color theme and font"
	>
		<PaintBrushIconMini />
	</button>

	{#if opened}
		<div
			transition:flyAndScale={{ x: 4, y: -8 }}
			class="anchor-top-right absolute z-50 mt-2 w-max rounded-lg border-2 bg-card p-4 shadow-md"
		>
			<div class="flex justify-between">
				<SystemOption
					class="bg-white text-gray-950 dark:bg-black dark:text-gray-50"
				/>
				<ThemeOption value="amoled" class="bg-black text-gray-50" />
			</div>

			<div class="mt-2 grid grid-cols-2 gap-2">
				<div class="grid grid-cols-2 gap-1">
					<ThemeOption value="light" class="bg-white text-gray-950" />
					<ThemeOption
						value="orange"
						class="bg-orange-100 text-zinc-950"
					/>
					<ThemeOption
						value="pink"
						class="bg-pink-100 text-pink-900"
					/>
					<ThemeOption
						value="blue"
						class="bg-blue-100 text-blue-900"
					/>
					<ThemeOption
						value="green"
						class="bg-green-100 text-green-900"
					/>
					<ThemeOption
						value="purple"
						class="bg-purple-100 text-purple-900"
					/>
				</div>
				<div class="grid grid-cols-2 gap-1">
					<ThemeOption
						value="dark"
						class="bg-zinc-900 text-zinc-50"
					/>
					<ThemeOption
						value="stone"
						class="bg-stone-800 text-stone-50"
					/>
					<ThemeOption value="red" class="bg-red-950 text-red-100" />
					<ThemeOption value="dim" class="bg-gray-800 text-gray-50" />
					<ThemeOption
						value="emerald"
						class="bg-emerald-950 text-emerald-100"
					/>
					<ThemeOption
						value="indigo"
						class="bg-indigo-950 text-indigo-100"
					/>
				</div>
			</div>

			<div class="mt-2 grid gap-1 text-sm">
				<FontOption value="font-sans" name="Inter" />
				<FontOption
					value="font-atkinson"
					name="Atkinson Hyperlegible Next"
				/>
				<FontOption value="font-serif" name="Source Serif" />
				<FontOption value="font-iosevka" name="Iosevka Aile" />
				<FontOption value="font-mono" name="IBM Plex Mono" />
				<FontOption value="font-dyslexic" name="OpenDyslexic" />
			</div>
		</div>
	{/if}
</div>

<style>
	@supports not (top: anchor(bottom)) {
		.popover-container {
			position: relative;
		}
	}
	.anchor-top-right {
		position-anchor: --nav;
		top: 100%;
		right: 0;
		top: calc(anchor(bottom) + var(--spacing) * 2);
		right: anchor(right);
	}
</style>
