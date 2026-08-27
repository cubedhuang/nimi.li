import type { Glyph, Word } from '@kulupu-linku/sona';

export function getShownGlyphs(word: Word, glyphs: Glyph[] | undefined) {
	if (!glyphs) return undefined;
	return word.usage_category === 'sandbox' ||
		glyphs[0].usage_category === 'obscure' ||
		glyphs[0].usage_category === 'sandbox'
		? glyphs.slice(0, 3)
		: glyphs
				?.filter(
					(glyph) =>
						glyph.usage_category === 'core' ||
						glyph.usage_category === 'common' ||
						glyph.usage_category === 'uncommon'
				)
				.slice(0, 3);
}
