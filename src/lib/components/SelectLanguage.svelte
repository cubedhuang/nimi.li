<script lang="ts">
	import { tick } from 'svelte';
	import { Command, Popover } from 'bits-ui';
	import NProgress from 'nprogress';

	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	import { flyAndScale } from '$lib/transitions';
	import { normalize, sortLanguages } from '$lib/util';
	import LanguageIconMini from '$lib/components/icons/LanguageIconMini.svelte';

	const lang = $derived(page.data.lang);
	const languages = $derived(page.data.languages);

	const options = $derived(sortLanguages(languages));

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	let search = $state('');

	function filter(id: string, search: string, keywords: string[]) {
		if (!search) return 1;
		search = normalize(search);

		return keywords.some((k) => normalize(k).includes(search));
	}

	let shownLanguages = $derived(
		options.filter((option) =>
			filter(
				option.id,
				search,
				[
					option.id,
					option.locale,
					option.name.en,
					option.name.endonym,
					option.name.tok
				].filter((k) => typeof k === 'string')
			)
		)
	);

	function closeAndFocusTrigger() {
		open = false;
		search = '';
		tick().then(() => {
			triggerRef.focus();
		});
	}

	let formRef = $state<HTMLFormElement>(null!);
	let langInput = $state<HTMLInputElement>(null!);

	function selectLanguage(langId: string) {
		langInput.value = langId;
		formRef.requestSubmit();
		closeAndFocusTrigger();
	}

	// eslint-disable-next-line no-undef
	let nProgressTimeout: NodeJS.Timeout;
</script>

<form
	method="POST"
	action="/internal/api/set-lang"
	bind:this={formRef}
	use:enhance={() => {
		clearTimeout(nProgressTimeout);
		nProgressTimeout = setTimeout(() => {
			NProgress.start();
		}, 300);

		return async ({ update }) => {
			await update();
			clearTimeout(nProgressTimeout);
			NProgress.done();
		};
	}}
	hidden
>
	<input type="hidden" name="lang" bind:this={langInput} />
</form>

<div class="popover-container text-sm">
	<Popover.Root bind:open>
		<Popover.Trigger
			class="nav-icon-button"
			aria-label="Select Language"
			bind:ref={triggerRef}
		>
			<LanguageIconMini />
		</Popover.Trigger>

		<Popover.Portal disabled>
			<Popover.ContentStatic forceMount>
				{#snippet child({ props, open })}
					{#if open}
						<div
							{...props}
							transition:flyAndScale={{ y: -8 }}
							class="anchor-top-right absolute z-50 mt-2 h-92 w-72 rounded-md border-2 bg-card text-card-foreground shadow-md"
						>
							{@render command()}
						</div>
					{/if}
				{/snippet}
			</Popover.ContentStatic>
		</Popover.Portal>
	</Popover.Root>
</div>

{#snippet command()}
	<Command.Root
		shouldFilter={false}
		class="flex h-full flex-col overflow-hidden"
	>
		<div class="shrink-0 border-b-2 p-1">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				class="absolute top-2 left-2 size-4 text-muted"
			>
				<path
					fill-rule="evenodd"
					d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
					clip-rule="evenodd"
				/>
			</svg>
			<Command.Input
				placeholder="o alasa..."
				class="w-full appearance-none rounded-md px-2 py-0.5 pl-6 outline-hidden placeholder:text-muted"
				bind:value={search}
			/>
		</div>

		<Command.List class="flex-1 overflow-y-auto">
			<Command.Empty class="py-1.5 pl-7 text-muted">
				No language found.
			</Command.Empty>

			<Command.Group class="flex flex-col gap-1 p-1">
				{#each shownLanguages as option (option.id)}
					<Command.Item
						class="group w-full cursor-pointer select-none"
						value={option.id}
						onSelect={() => {
							selectLanguage(option.id);
							closeAndFocusTrigger();
						}}
					>
						{@const isSelected = lang === option.id}
						<span
							class="relative block overflow-hidden rounded-md px-2 py-1 pl-6
								leading-tight text-ellipsis whitespace-nowrap
								group-data-selected:bg-background group-data-selected:text-accent
								light:group-data-selected:bg-secondary darkish:group-data-selected:bg-secondary"
						>
							{#if isSelected}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
									class="absolute top-1/2 left-1 size-4 -translate-y-1/2"
								>
									<path
										fill-rule="evenodd"
										d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
										clip-rule="evenodd"
									/>
								</svg>
							{/if}

							{option.name.endonym ?? option.name.en}
						</span>
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.List>
	</Command.Root>
{/snippet}

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
