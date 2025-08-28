<script lang="ts">
	import '../styles/app.css';

	import { onMount, type Snippet } from 'svelte';

	import NProgress from 'nprogress';

	import { page } from '$app/state';
	import { dev } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	import { outclick } from '$lib/actions/outclick';
	import { screenWidth } from '$lib/stores';
	import { flyAndScale } from '$lib/transitions';

	import SurveyBanner from './SurveyBanner.svelte';
	import ThemeSelector from './ThemeSelector.svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();

	const routes = [
		{ name: 'dictionary', href: '/' },
		{ name: 'luka pona', href: '/luka-pona' },
		{ name: 'ilo ku', href: '/ilo-ku' },
		{ name: 'sandbox', href: '/sandbox' },
		{ name: 'about', href: '/about' }
	];

	let opened = $state(false);

	// ESLint doesn't recognize NodeJS.Timeout
	// eslint-disable-next-line no-undef
	let nProgressTimeout: NodeJS.Timeout;

	// disable smooth scroll on navigation
	beforeNavigate(() => {
		document.documentElement.style.scrollBehavior = 'auto';

		clearTimeout(nProgressTimeout);

		nProgressTimeout = setTimeout(() => {
			NProgress.start();
		}, 150);
	});
	afterNavigate(() => {
		document.documentElement.style.scrollBehavior = 'smooth';

		clearTimeout(nProgressTimeout);
		NProgress.done();
	});

	// BeforeInstallPromptEvent doesn't have a type definition :(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let deferredPrompt = $state<Event & any>();

	onMount(() => {
		window.addEventListener('beforeinstallprompt', e => {
			e.preventDefault();
			deferredPrompt = e;
		});

		if (dev) {
			// simulate deferred prompt
			setTimeout(() => {
				deferredPrompt = true;
			}, 500);
		}

		NProgress.configure({
			showSpinner: false
		});
	});
</script>

<div class="content" class:fullscreen={$screenWidth === 'full'}>
	<SurveyBanner />

	<nav class="flex justify-between pt-4 sm:pt-0">
		<div class="hidden gap-2 sm:flex">
			{#each routes as route (route.href)}
				{#if page.url.pathname === route.href}
					<span class="cursor-default nav-item text-muted">
						{route.name}
					</span>
				{:else}
					<a href={route.href} class="nav-item-interactive">
						{route.name}
					</a>
				{/if}
			{/each}
		</div>

		<div
			class="relative sm:hidden"
			use:outclick
			onoutclick={() => {
				opened = false;
			}}
		>
			<button
				onclick={() => {
					opened = !opened;
				}}
				class="cursor-pointer nav-item-interactive"
				aria-label="open navigation"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="h-6 w-6"
				>
					<path
						fill-rule="evenodd"
						d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75H12a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			{#if opened}
				<div
					transition:flyAndScale={{ x: -2, y: -4, duration: 300 }}
					class="absolute top-full z-50 mt-2 flex flex-col divide-y-2 divide-border rounded-lg border-2 bg-card shadow-md"
				>
					{#each routes as route (route.href)}
						{#if page.url.pathname === route.href}
							<span class="cursor-default p-2 text-muted">
								{route.name}
							</span>
						{:else}
							<a
								href={route.href}
								class="p-2"
								onclick={e => e.stopPropagation()}
								ontouchstart={e => e.stopPropagation()}
							>
								{route.name}
							</a>
						{/if}
					{/each}
				</div>
			{/if}
		</div>

		<div class="flex gap-2">
			{#if deferredPrompt}
				<button
					onclick={() => {
						deferredPrompt.prompt();
					}}
					transition:flyAndScale={{ y: 4 }}
					class="nav-item-interactive"
					aria-label="install as app"
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
							d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
						/>
					</svg>
				</button>
			{/if}

			<button
				class="cursor-pointer nav-item-interactive max-lg:hidden"
				onclick={() => {
					if ($screenWidth === 'full') {
						$screenWidth = 'large';
					} else {
						$screenWidth = 'full';
					}
				}}
				role="checkbox"
				aria-checked={$screenWidth === 'full'}
				aria-label="toggle full width"
			>
				{#if $screenWidth === 'large'}
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
							d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
						/>
					</svg>
				{:else}
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
							d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
						/>
					</svg>
				{/if}
			</button>

			<ThemeSelector />
		</div>
	</nav>

	<main class="content full pt-4 pb-24 sm:pt-8">
		{@render children()}
	</main>
</div>

<style lang="postcss">
	@reference '../styles/app.css';

	:global(#nprogress) {
		pointer-events: none;
	}

	:global(#nprogress .bar) {
		@apply fixed top-0 left-0 z-50 h-0.5 w-full bg-accent;
	}

	:global(#nprogress .peg) {
		@apply absolute right-0 block h-full w-24 opacity-100;

		box-shadow:
			0 0 --spacing(2) --var(--color-accent),
			0 0 --spacing(1) --var(--color-accent);
		transform: rotate(3deg) translate(0px, -4px);
	}
</style>
