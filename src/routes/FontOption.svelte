<script lang="ts">
	import { getSettings, type Font } from '$lib/settings';

	interface Props {
		value: Font;
		name: string;
	}

	const { value, name }: Props = $props();
	const settings = getSettings();

	const selected = $derived(value === settings.font);
</script>

<button
	class="max-w-full interactable py-1 transition-colors {value}
		{selected
		? 'ring-2 ring-secondary-foreground ring-offset-1 ring-offset-card'
		: ''}"
	onclick={() => {
		settings.font = value;
	}}
	role="option"
	aria-selected={selected}
>
	{name}
</button>
