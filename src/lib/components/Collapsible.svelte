<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet;
	}

	const { class: className, children }: Props = $props();

	let p = $state<HTMLParagraphElement | undefined>();
	const expandable = $derived(p ? p.scrollHeight > p.clientHeight : false);
	let expanded = $state(false);

	let button = $state<HTMLButtonElement | undefined>();
</script>

<p class:line-clamp-2={!expanded} class={className} bind:this={p}>
	{@render children()}
</p>

{#if expandable}
	<button
		class="rounded text-muted underline decoration-transparent underline-offset-2 outline-none outline-offset-4 transition focus-visible:outline-contrast hv:decoration-current"
		class:block={expanded}
		onclick={() => {
			expanded = !expanded;
			button?.blur();
		}}
		bind:this={button}
	>
		{#if expanded}
			less
		{:else}
			more
		{/if}
	</button>
{/if}
