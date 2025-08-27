<script lang="ts">
	import { onMount } from 'svelte';
	import type { SignVideo } from '@kulupu-linku/sona';

	import { browser } from '$app/environment';

	import { autoplay, language } from '$lib/stores';
	import { getWordLink } from '$lib/util';

	interface Props {
		word: string;
		video: SignVideo;
		onclick?: () => void;
	}

	const { word, video, onclick }: Props = $props();

	let img: HTMLImageElement;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	if (browser) {
		autoplay.subscribe(value => {
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
	href={getWordLink(word, $language)}
	onclick={e => {
		e.preventDefault();
		onclick?.();
	}}
	class="group focus-visible:outline-contrast text-left outline-hidden"
	id={word}
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
			class="bg-secondary aspect-video w-full rounded-lg"
		></canvas>

		<img
			src={video.gif}
			alt="{word} luka pona"
			class="bg-secondary absolute top-0 left-0 z-10 aspect-video w-full rounded-lg"
			class:opacity-0={!$autoplay}
			loading="lazy"
			bind:this={img}
			onload={handleLoaded}
		/>
	</div>

	<b class="group-hover:text-accent mt-1 block transition">
		{word}
	</b>
</a>
