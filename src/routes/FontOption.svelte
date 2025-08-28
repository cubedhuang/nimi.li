<script lang="ts">
	import { font, type Font } from '$lib/stores';

	interface Props {
		value: Font;
		name: string;
	}

	const { value, name }: Props = $props();

	const selected = $derived(value === $font);
</script>

<button
	class="max-w-full interactable py-1 transition-colors {value}
		{selected
		? 'ring-2 ring-secondary-foreground ring-offset-1 ring-offset-card'
		: ''}"
	onclick={() => {
		$font = value;
	}}
	role="option"
	aria-selected={selected}
>
	{name}
</button>
