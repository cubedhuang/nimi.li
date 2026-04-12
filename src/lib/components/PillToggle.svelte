<script lang="ts">
	import type { Book, UsageCategory } from '@kulupu-linku/sona/utils';

	interface Props {
		checked: boolean;
		label: string;
		category: UsageCategory | Book;
	}

	let { checked = $bindable(), label, category }: Props = $props();

	const categoryPillColors: Record<UsageCategory, string> = {
		core: 'text-emerald-700 bg-emerald-100 border-emerald-300 hv:border-emerald-500 darkish:text-emerald-300 darkish:bg-emerald-900 darkish:border-emerald-600 darkish:hv:border-emerald-500',
		common: 'text-sky-700 bg-sky-100 border-sky-300 hv:border-sky-500 darkish:text-sky-300 darkish:bg-sky-900 darkish:border-sky-600 darkish:hv:border-sky-500',
		uncommon:
			'text-yellow-700 bg-yellow-100 border-yellow-300 hv:border-yellow-500 darkish:text-yellow-300 darkish:bg-yellow-900 darkish:border-yellow-600 darkish:hv:border-yellow-500',
		obscure:
			'text-fuchsia-700 bg-fuchsia-100 border-fuchsia-300 hv:border-fuchsia-500 darkish:text-fuchsia-300 darkish:bg-fuchsia-900 darkish:border-fuchsia-600 darkish:hv:border-fuchsia-500',
		sandbox:
			'text-gray-700 bg-gray-100 border-gray-300 hv:border-gray-500 darkish:text-gray-300 darkish:bg-gray-900 darkish:border-gray-600 darkish:hv:border-gray-500'
	};

	const usageCategory = $derived(
		category === 'pu'
			? 'core'
			: category == 'ku suli'
				? 'common'
				: category == 'ku lili'
					? 'uncommon'
					: category === 'none'
						? 'obscure'
						: category
	);
	const color = $derived(categoryPillColors[usageCategory]);
</script>

<button
	class="flex interactable items-center text-sm
        {checked ? color : 'border-dashed text-muted'}"
	onclick={() => (checked = !checked)}
	role="checkbox"
	aria-checked={checked}
>
	<span class="px-2 py-0.5 transition-colors">
		{label}
	</span>
</button>
