<script lang="ts">
	import type { Action } from 'svelte/action';

	import type { LocalizedWord } from '@kulupu-linku/sona';

	import ExternalLink from './icons/ExternalLink.svelte';

	interface Props {
		word: LocalizedWord;
		content: string;
		space?: boolean;
	}

	const { word, content, space = false }: Props = $props();

	const href = $derived(
		word.word === 'mije' || word.word === 'meli'
			? 'https://lipamanka.gay/essays/dictionary#mije-and-meli'
			: `https://lipamanka.gay/essays/dictionary#${word.word}`
	);

	const fixLinks: Action<HTMLDivElement> = node => {
		const update = () => {
			for (const a of node.getElementsByTagName('a')) {
				const href = a.getAttribute('href');

				if (href?.startsWith('/')) {
					a.href = 'https://lipamanka.gay' + href;
				}

				a.target = '_blank';
				a.rel = 'noopener noreferrer';

				a.classList.add('link');
			}

			for (const button of node.getElementsByTagName('button')) {
				button.classList.add('interactable');
			}
		};

		update();

		return { update };
	};
</script>

<h3 class="flex items-center text-lg">
	semantic space &middot; lipamanka

	<a
		class="icon-interactable"
		{href}
		target="_blank"
		rel="noopener noreferrer"
		aria-label="source"
	>
		<ExternalLink />
	</a>
</h3>

<div class:mt-1={space} class="lipamanka grid text-sm" use:fixLinks>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html content}
</div>

<style lang="postcss">
	@reference '../../styles/app.css';

	:global(.lipamanka p:not(:last-child)) {
		@apply mb-2;
	}

	:global(.lipamanka p) {
		@apply leading-relaxed;
	}

	:global(.lipamanka button) {
		@apply my-2 w-fit px-2 py-1;
	}
</style>
