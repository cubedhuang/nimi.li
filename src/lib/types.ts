import type { Sign, Word } from '@kulupu-linku/sona';

export type CompoundData = Record<string, Compound>;

export interface Compound {
	compound: string;
	uses: Record<string, number>;
	glyphs?: string[];
}

export type SignData = {
	id: string;
	words: Word[];
	signs: Sign[];
};
