<script lang="ts">
	import {
		baseTheme,
		lightTheme,
		darkTheme,
		systemTheme,
		type Theme,
		isDarkTheme
	} from '$lib/stores';

	interface Props {
		value: Theme;
		class?: string | undefined;
	}

	const { value, class: className = undefined }: Props = $props();

	const theme = isDarkTheme(value) ? darkTheme : lightTheme;

	const selected = $derived(
		$systemTheme ? value === $theme : value === $baseTheme
	);
</script>

<button
	class="grid size-12 interactable place-items-center text-lg transition-colors {className}
		{selected
		? 'ring-2 ring-secondary-foreground ring-offset-1 ring-offset-card'
		: ''}"
	onclick={() => {
		// synchronize both stores
		$theme = value;
		$baseTheme = value;
	}}
	role="option"
	aria-selected={selected}
	aria-label={value}
>
	<span aria-hidden="true"> Aa </span>
</button>
