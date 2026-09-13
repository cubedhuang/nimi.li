<script lang="ts">
	import '../styles/app.css';

	import { onMount, type Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	import NProgress from 'nprogress';

	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { dev } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	import { outclick } from '$lib/actions/outclick';
	import { screenWidth } from '$lib/stores';
	import { flyAndScale } from '$lib/transitions';

	import SelectLanguage from '$lib/components/SelectLanguage.svelte';
	// import SurveyBanner from './SurveyBanner.svelte';
	import ThemeSelector from './ThemeSelector.svelte';
	import ArrowsPointingInIconMini from '$lib/components/icons/ArrowsPointingInIconMini.svelte';
	import ArrowsPointingOutIconMini from '$lib/components/icons/ArrowsPointingOutIconMini.svelte';
	import Bars3BottomLeftIconMini from '$lib/components/icons/Bars3BottomLeftIconMini.svelte';
	import XMarkIconMini from '$lib/components/icons/XMarkIconMini.svelte';
	import ArrowDownTrayIconMini from '$lib/components/icons/ArrowDownTrayIconMini.svelte';

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
	] as const;

	let opened = $state(false);

	// ESLint doesn't recognize NodeJS.Timeout
	// eslint-disable-next-line no-undef
	let nProgressTimeout: NodeJS.Timeout;

	// disable smooth scroll on navigation
	beforeNavigate(() => {
		document.documentElement.style.scrollBehavior = 'auto';
		opened = false;

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
		window.addEventListener('beforeinstallprompt', (e) => {
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
	<!-- <SurveyBanner /> -->

	<div
		class="content full"
		use:outclick
		onoutclick={() => {
			opened = false;
		}}
	>
		<nav class="content full border-b-2 py-2">
			<div class="nav-anchor flex items-center gap-1">
				<a
					href={resolve('/')}
					class="mr-2 font-display text-lg font-bold transition-colors hv:text-accent"
				>
					nimi.li
				</a>

				<div
					class="mr-2 h-8 w-0.5 self-center rounded-full bg-border max-sm:hidden"
					aria-hidden="true"
				></div>

				<div class="hidden gap-0.5 sm:flex">
					{#each routes as route (route.href)}
						<a
							href={resolve(route.href)}
							class="nav-link {page.url.pathname === route.href
								? 'active'
								: ''}"
						>
							{route.name}
						</a>
					{/each}
				</div>

				<div class="mr-auto" aria-hidden="true"></div>

				{#if deferredPrompt}
					<button
						onclick={() => {
							deferredPrompt.prompt();
						}}
						transition:flyAndScale={{ y: 4 }}
						class="nav-icon-button"
						aria-label="install as app"
					>
						<ArrowDownTrayIconMini />
					</button>
				{/if}

				<button
					class="nav-icon-button max-lg:hidden"
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
						<ArrowsPointingOutIconMini />
					{:else}
						<ArrowsPointingInIconMini />
					{/if}
				</button>

				<SelectLanguage />
				<ThemeSelector />

				<button
					onclick={() => {
						opened = !opened;
					}}
					class="nav-icon-button sm:hidden"
					aria-label={opened ? 'close navigation' : 'open navigation'}
					aria-expanded={opened}
				>
					{#if opened}
						<XMarkIconMini />
					{:else}
						<Bars3BottomLeftIconMini />
					{/if}
				</button>
			</div>
		</nav>

		{#if opened}
			<div
				class="content full border-b-2 bg-card py-2 sm:hidden"
				transition:slide={{ duration: 200 }}
			>
				{#each routes as route (route.href)}
					<a
						href={resolve(route.href)}
						class="content full nav-sheet-link {page.url
							.pathname === route.href
							? 'active'
							: ''}"
						onclick={() => (opened = false)}
					>
						<span>{route.name}</span>
					</a>
				{/each}
			</div>
		{/if}
	</div>

	<main class="content full mt-8 mb-24">
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

	.nav-link {
		@apply cursor-pointer rounded-lg border-2 border-transparent px-2 py-1 text-sm text-muted transition hv:bg-secondary hv:text-secondary-foreground;
	}

	.nav-link.active {
		@apply cursor-default border-secondary-border bg-secondary text-secondary-foreground;
	}

	.nav-sheet-link {
		@apply py-2 text-sm text-muted transition-colors hv:bg-secondary hv:text-secondary-foreground;
	}

	.nav-sheet-link.active {
		@apply cursor-default bg-secondary text-secondary-foreground;
	}

	.nav-anchor {
		anchor-name: --nav;
	}
</style>
