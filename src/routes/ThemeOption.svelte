<script lang="ts">
	import { getSettings, isDarkTheme, type Theme } from '$lib/settings';

	interface Props {
		value: Theme;
		class?: string | undefined;
	}

	const { value, class: className = undefined }: Props = $props();
	const settings = getSettings();

	const slot = $derived(isDarkTheme(value) ? 'darkTheme' : 'lightTheme');
	const selected = $derived(
		value === (settings.systemTheme ? settings[slot] : settings.baseTheme)
	);
</script>

<button
	class="grid size-12 interactable place-items-center text-lg transition-colors {className}
		{selected
		? 'ring-2 ring-secondary-foreground ring-offset-1 ring-offset-card'
		: ''}"
	onclick={() => {
		// synchronize both theme values
		settings[slot] = value;
		settings.baseTheme = value;
	}}
	role="option"
	aria-selected={selected}
	aria-label={value}
>
	<span aria-hidden="true"> Aa </span>
</button>
