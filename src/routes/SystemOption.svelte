<script lang="ts">
	import { systemTheme } from '$lib/stores';

	interface Props {
		class?: string | undefined;
	}

	const { class: className = undefined }: Props = $props();

	const selected = $derived($systemTheme);
</script>

<button
	class="grid size-12 interactable place-items-center text-lg transition-colors {className}
		{selected
		? 'ring-2 ring-secondary-foreground ring-offset-1 ring-offset-card'
		: ''}"
	onclick={() => {
		$systemTheme = !$systemTheme;
	}}
	role="option"
	aria-selected={selected}
	aria-label="toggle system theme"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="size-6"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
		/>
	</svg>
</button>
