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
		class="text-muted focus-visible:outline-contrast hv:decoration-current rounded-sm underline decoration-transparent underline-offset-2 outline-hidden outline-offset-4 transition"
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
