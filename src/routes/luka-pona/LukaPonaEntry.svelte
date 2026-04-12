<script lang="ts">
	import { onMount } from 'svelte';

	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';

	import { autoplay } from '$lib/stores';
	import type { SignData } from '$lib/types';

	interface Props {
		signData: SignData;
		onclick?: () => void;
	}

	const { signData, onclick }: Props = $props();

	const displayWord = $derived(
		signData.words
			.map((w) => w.word)
			.join('/')
			.toUpperCase()
	);

	let img: HTMLImageElement;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	if (browser) {
		autoplay.subscribe((value) => {
			if (img && value) {
				img.setAttribute('src', img.src);
			}
		});
	}

	function handleLoaded() {
		if (!ctx) {
			ctx = canvas.getContext('2d');
		}

		canvas.width = img.width;
		canvas.height = img.height;
		ctx?.drawImage(img, 0, 0, img.width, img.height);
	}

	function handleEnter() {
		if ($autoplay) {
			return;
		}

		// reset animation
		img.setAttribute('src', img.src);
		img.classList.remove('opacity-0');
	}

	function handleLeave() {
		if ($autoplay) {
			return;
		}

		img.classList.add('opacity-0');
	}

	onMount(() => {
		if (img.complete) {
			handleLoaded();
		}
	});
</script>

<a
	id={signData.id}
	href={resolve(`/${signData.words[0].id}`)}
	onclick={(e) => {
		e.preventDefault();
		onclick?.();
	}}
	class="group rounded-lg text-left outline-offset-2 outline-accent focus-visible:outline-2"
	onmouseenter={handleEnter}
	onmouseleave={handleLeave}
	onfocus={handleEnter}
	onblur={handleLeave}
	ontouchstart={handleEnter}
	ontouchend={handleLeave}
>
	<div class="relative isolate">
		<canvas
			aria-hidden="true"
			bind:this={canvas}
			class="aspect-video w-full rounded-lg bg-secondary"
		></canvas>

		<!-- TODO: look for all video?. and make it conditionally do something -->
		<img
			src={signData.signs[0].video?.gif}
			alt="{displayWord} luka pona"
			class="absolute top-0 left-0 z-10 aspect-video w-full rounded-lg bg-secondary"
			class:opacity-0={!$autoplay}
			loading="lazy"
			bind:this={img}
			onload={handleLoaded}
		/>
	</div>

	<b class="mt-1 block transition group-hover:text-accent">
		{displayWord}
	</b>
</a>
