import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'media',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			width: {
				144: '36rem'
			},
			colors: {
				border: 'var(--border)',
				contrast: 'var(--contrast)',
				input: 'var(--input)',
				ring: 'var(--ring)',
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				accent: 'var(--accent)',
				muted: 'var(--muted)',
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)'
				},
				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)'
				}
			},
			fontFamily: {
				sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
				serif: ['"SourceSerif"', ...defaultTheme.fontFamily.serif],
				mono: ['"IBM Plex Mono"', ...defaultTheme.fontFamily.mono],
				dyslexic: ['"OpenDyslexic"', ...defaultTheme.fontFamily.sans],
				atkinson: [
					'"AtkinsonHyperlegible"',
					...defaultTheme.fontFamily.sans
				],
				pona: ['"ssk"', ...defaultTheme.fontFamily.sans],
				display: ['"SFRounded"', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: [
		plugin(({ addVariant }) => {
			addVariant('hf', ['&:hover', '&:focus']);
			addVariant('hv', ['&:hover', '&:focus-visible']);
			addVariant('group-hf', ['.group:hover &', '.group:focus &']);
			addVariant('group-hv', [
				'.group:hover &',
				'.group:focus-visible &'
			]);
			addVariant('darkish', [
				'.amoled &',
				'.dark &',
				'.stone &',
				'.red &',
				'.emerald &',
				'.dim &',
				'.indigo &'
			]);
		}),
		plugin(({ matchUtilities, theme }) => {
			matchUtilities(
				{
					'grid-cols-fill': size => ({
						gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${size}), 1fr))`
					})
				},
				{ values: theme('width') }
			);
		})
	]
};
