<script lang="ts">
	import { language } from '$lib/stores';
	import { getTranslation } from '$lib/util';
	import type { LocalizedSign } from '@kulupu-linku/sona';

	interface Props {
		signs: LocalizedSign[];
		language?: string;
	}

	let { signs, language: lang }: Props = $props();
</script>

{#each signs as sign}
	{@const translation = getTranslation(sign, lang || $language || 'en')}
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

		{#each sign.etymology as etymology}
			<p class="text-muted">
				{etymology.language}
				{#if etymology.sign}
					&middot; {etymology.sign}
				{/if}
			</p>
		{/each}
	</div>
{/each}
