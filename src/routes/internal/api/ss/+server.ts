import { error } from '@sveltejs/kit';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs/browser';

export async function GET({ fetch, setHeaders, url }) {
	let word = url.searchParams.get('word');

	if (!word) {
		error(400, 'Missing word');
	}

	if (!/^[a-z]+$/.test(word)) {
		error(400, 'Invalid word');
	}

	if (word === 'ali') {
		word = 'ale';
	}

	const imageUrl = `https://raw.githubusercontent.com/lipu-linku/ijo/main/sitelensitelen/jonathangabel/${word}.jpg`;
	const response = await fetch(imageUrl).catch(() => null);

	if (!response || !response.ok) {
		error(404, 'Failed to fetch image');
	}

	const arrayBuffer = await response.arrayBuffer();
	const pngBuffer = await removeWhiteBackground(arrayBuffer);

	setHeaders({
		'Cache-Control': 's-maxage=31536000',
		'Content-Type': 'image/png'
	});

	return new Response(pngBuffer);
}

async function removeWhiteBackground(jpegData: jpeg.BufferLike) {
	const rawImageData = jpeg.decode(jpegData, { useTArray: true });

	const png = new PNG({
		width: rawImageData.width,
		height: rawImageData.height,
		filterType: -1
	});

	for (let y = 0; y < png.height; y++) {
		for (let x = 0; x < png.width; x++) {
			const i = (png.width * y + x) << 2;
			const r = rawImageData.data[i];
			const g = rawImageData.data[i + 1];
			const b = rawImageData.data[i + 2];

			if (r > 220 && g > 220 && b > 220) {
				png.data[i] = 0;
				png.data[i + 1] = 0;
				png.data[i + 2] = 0;
				png.data[i + 3] = 0;
			} else {
				const min = Math.min(r, g, b);

				png.data[i] = min / 4;
				png.data[i + 1] = min / 4;
				png.data[i + 2] = min / 4;
				png.data[i + 3] = 255 - min;
			}
		}
	}

	return PNG.sync.write(png);
}
