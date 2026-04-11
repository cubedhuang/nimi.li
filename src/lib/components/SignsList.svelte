<script lang="ts">
	import type { Sign } from '@kulupu-linku/sona';

	interface Props {
		signs: Sign[];
	}

	let { signs }: Props = $props();
</script>

{#each signs as sign, i (i)}
	{@const translation = sign.translations}
	{@const parameters = [
		translation.parameters.handshape,
		translation.parameters.movement,
		translation.parameters.placement,
		translation.parameters.orientation
	].filter(Boolean)}

	<div class="mt-4">
		<h3 class="text-lg">{sign.new_gloss}</h3>

		<p>
			<i>{translation.icons}</i>
		</p>

		<p>
			{sign.is_two_handed ? 'two-handed' : 'one-handed'}
			&middot; {parameters.join(' · ')}
		</p>

		{#each sign.etymology as etymology, i (i)}
			<p class="text-muted">
				{etymology.language}
				{#if etymology.sign}
					&middot; {etymology.sign}
				{/if}
			</p>
		{/each}
	</div>
{/each}
