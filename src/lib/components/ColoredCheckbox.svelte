<script lang="ts">
	interface Props {
		checked: boolean;
		label: string;
		color: string;
	}

	let { checked = $bindable(), label, color }: Props = $props();
</script>

<button
	class="flex interactable items-center"
	onclick={() => (checked = !checked)}
	role="checkbox"
	aria-checked={checked}
>
	<span
		class="{color} h-full w-4 transition-opacity"
		class:opacity-100={checked}
		class:opacity-30={!checked}
	></span>

	<span class="px-2 py-0.5 transition-colors" class:text-muted={!checked}>
		{label}
	</span>
</button>
