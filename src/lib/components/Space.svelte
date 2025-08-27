<script lang="ts">
	import type {
		HTMLAnchorAttributes,
		MouseEventHandler
	} from 'svelte/elements';

	const { children, ...props }: HTMLAnchorAttributes = $props();
</script>

<svelte:element
	this={props.href ? 'a' : 'button'}
	class="relative interactable overflow-hidden p-4 text-left transition hover:scale-[1.02]"
	{...props}
	onclick={(e: Parameters<MouseEventHandler<HTMLAnchorElement>>[0]) => {
		e.preventDefault();
		if (props.onclick) {
			props.onclick(e);
		}
	}}
	role="link"
	tabindex="0"
>
	{@render children?.()}
</svelte:element>
