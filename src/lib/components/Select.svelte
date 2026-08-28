<script lang="ts">
	import { tick, type Component } from 'svelte';

	interface Props {
		options: {
			label: string;
			value: string;
		}[];
		name: string;
		Icon: Component;
		value: string;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		options,
		name,
		Icon,
		value = $bindable(),
		class: className = '',
		onchange
	}: Props = $props();

	type SelectMenuComponent =
		typeof import('./select/SelectMenu.svelte').default;

	let SelectMenu = $state<SelectMenuComponent | null>(null);
	let menuRef = $state<HTMLButtonElement | null>(null);
	let open = $state(false);
	let loaded: SelectMenuComponent | null = null;
	let loading: Promise<void> | null = null;

	function preload() {
		loading ??= import('./select/SelectMenu.svelte').then((module) => {
			loaded = module.default;
		});

		return loading;
	}

	async function activate() {
		await preload();
		SelectMenu = loaded;
		await tick();
		menuRef?.focus();
		open = true;
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			activate();
		}
	}

	const label = $derived(
		options.find((option) => option.value === value)?.label || ''
	);
</script>

{#if SelectMenu}
	<SelectMenu
		{options}
		{name}
		{Icon}
		bind:value
		bind:ref={menuRef}
		bind:open
		class={className}
		{onchange}
	/>
{:else}
	<div class="{className} relative text-sm">
		<button
			type="button"
			class="flex w-full interactable items-center px-2 py-0.5 text-ellipsis"
			aria-label={name}
			aria-haspopup="listbox"
			aria-expanded="false"
			onpointerenter={preload}
			onfocus={preload}
			onclick={activate}
			{onkeydown}
		>
			<Icon />

			<span
				class="ml-1 flex-1 overflow-hidden text-left overflow-ellipsis whitespace-nowrap"
			>
				{label}
			</span>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				class="size-4 shrink-0 text-muted"
			>
				<path
					fill-rule="evenodd"
					d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>
{/if}
