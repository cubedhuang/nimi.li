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
	class="interactable max-w-full px-4 py-1 transition-colors {value}
		{selected
		? 'ring-2 ring-secondary-foreground ring-offset-2 ring-offset-card'
		: ''}"
	onclick={e => {
		e.stopPropagation();
		$font = value;
	}}
	ontouchstart={e => e.stopPropagation()}
	role="option"
	aria-selected={selected}
>
	{name}
</button>
