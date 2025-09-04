<script lang="ts">
	import { flyAndScale } from '$lib/transitions';
	import { Select } from 'bits-ui';

	interface Props {
		options: {
			label: string;
			value: string;
		}[];
		name: string;
		value: string;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		options,
		name,
		value = $bindable(),
		class: className = '',
		onchange
	}: Props = $props();
</script>

<div class="{className} relative">
	<Select.Root
		type="single"
		bind:value
		items={options}
		onValueChange={onchange}
		{name}
	>
		<Select.Trigger
			class="flex w-full interactable items-center px-2 py-0.5 text-ellipsis"
			aria-label={name}
		>
			<span
				class="flex-1 shrink-1 text-left overflow-ellipsis whitespace-nowrap"
			>
				{options.find((option) => option.value === value)?.label || ''}
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
		</Select.Trigger>

		<Select.Portal disabled>
			<Select.ContentStatic forceMount>
				{#snippet child({ props, open })}
					{#if open}
						<div
							{...props}
							transition:flyAndScale={{ y: -8 }}
							class="absolute top-full left-0 z-50 mt-1 flex max-h-80 w-full flex-col gap-1 overflow-auto rounded-md border-2 bg-card p-1 text-card-foreground shadow-md"
						>
							{#each options as option (option.value)}
								<Select.Item
									class="w-full cursor-pointer select-none"
									value={option.value}
									label={option.label}
								>
									{#snippet children({
										highlighted,
										selected
									})}
										<span
											class="relative flex items-center rounded-md px-2 py-0.5 pl-6
												{highlighted
												? 'bg-background text-accent light:bg-secondary darkish:bg-secondary'
												: ''}"
										>
											{#if selected}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 16 16"
													fill="currentColor"
													class="absolute left-1 size-4"
												>
													<path
														fill-rule="evenodd"
														d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
														clip-rule="evenodd"
													/>
												</svg>
											{/if}

											{option.label}
										</span>
									{/snippet}
								</Select.Item>
							{/each}
						</div>
					{/if}
				{/snippet}
			</Select.ContentStatic>
		</Select.Portal>
	</Select.Root>
</div>
