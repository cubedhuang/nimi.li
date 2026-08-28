<script lang="ts">
	import { tick } from 'svelte';

	import LanguageIconMini from '$lib/components/icons/LanguageIconMini.svelte';

	type MenuComponent =
		typeof import('./select-language/SelectLanguageMenu.svelte').default;

	let SelectLanguageMenu = $state<MenuComponent | null>(null);
	let menuRef = $state<HTMLButtonElement | null>(null);
	let open = $state(false);
	let loaded: MenuComponent | null = null;
	let loading: Promise<void> | null = null;

	function preload() {
		loading ??= import('./select-language/SelectLanguageMenu.svelte').then(
			(module) => {
				loaded = module.default;
			}
		);

		return loading;
	}

	async function activate() {
		await preload();
		SelectLanguageMenu = loaded;
		await tick();
		menuRef?.focus();
		open = true;
	}
</script>

{#if SelectLanguageMenu}
	<SelectLanguageMenu bind:ref={menuRef} bind:open />
{:else}
	<div class="popover-container text-sm">
		<button
			type="button"
			class="nav-icon-button"
			aria-label="Select Language"
			aria-haspopup="dialog"
			aria-expanded="false"
			onpointerenter={preload}
			onfocus={preload}
			onclick={activate}
		>
			<LanguageIconMini />
		</button>
	</div>
{/if}

<style>
	@supports not (top: anchor(bottom)) {
		.popover-container {
			position: relative;
		}
	}
</style>
