<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import Meta from '$lib/components/Meta.svelte';

	let pona = $state(true);

	const t = (tokiPona: string, english: string) =>
		pona ? tokiPona : english;
</script>

<Meta
	title="about – nimi.li | Toki Pona Dictionary"
	description="About nimi.li."
	url="https://nimi.li/about"
	keywords={['about page', 'about']}
/>

<div class="flex items-baseline justify-between">
	<h1 class="text-4xl">{t('sona poka', 'about')}</h1>
	<button class="interactable px-2 py-1" onclick={() => (pona = !pona)}>
		{t('use English', 'o toki pona')}
	</button>
</div>

<div class="mt-4 grid gap-2 leading-relaxed md:grid-cols-2">
	<div class="box">
		<h2>{t('mi', 'me')}</h2>

		<p>
			{t('mi', "Hi! I'm")}
			<Link href="https://github.com/cubedhuang/">ilo Tani</Link>{t(
				' li pali e lipu ni. jan',
				', and I made this project. Thanks to'
			)}
			<Link href="https://github.com/woflydev/">woflydev</Link>
			{t(
				'li ken e ni: sina awen e lipu lon ilo sina. sina wile pona e lipu ni la, o kepeken ilo',
				'for helping make this a Progressive Web Application. This is an'
			)}
			<Link href="https://github.com/cubedhuang/sona-nimi"
				>{t('GitHub', 'open source project on GitHub')}</Link
			>!
		</p>
	</div>

	<div class="box">
		<h2>{t('ilo pali', 'tools')}</h2>

		<p>
			{t('mi pali e lipu ni kepeken ilo', 'This website was built with')}
			<Link href="https://kit.svelte.dev">SvelteKit</Link>{t(
				' kepeken ilo',
				','
			)}
			<Link href="https://www.typescriptlang.org">TypeScript</Link>{t(
				' kepeken ilo',
				', and'
			)}
			<Link href="https://tailwindcss.com">TailwindCSS</Link>.
		</p>
	</div>

	<div class="box">
		<h2>{t('tan sona', 'sources')}</h2>

		<p>
			{t('ilo pona mute li ken e lipu ni. pali', '')}
			<b>nimi.li</b>
			{t(
				'la,',
				'was built with data from many amazing projects. Thanks to all of the following projects for their work:'
			)}
		</p>

		<ul>
			<li>
				<Link href="https://linku.la/about/"
					>{t('sona Linku', "Linku's public API")}</Link
				>
				{t('en', 'and')}
				<Link href="https://lipamanka.gay/essays/dictionary"
					>{t(
						'lipu lipamanka',
						"lipamanka's semantic space dictionary"
					)}</Link
				>
				{t(
					'li kama e sona nimi.',
					'is used for all of data with the vocabulary.'
				)}
			</li>

			<li>
				{t('mi kepeken', "Sonja Lang's")}
				<Link href="https://tokipona.org/compounds.txt"
					>{t('sona ku lili', 'public subsets of ku')}</Link
				>
				{t('pi jan Sonja tawa ilo ku.', 'were used for ilo ku.')}
			</li>

			<li>
				{t('mi sitelen pona e nimi kepeken', 'The')}
				<Link
					href="https://www.kreativekorp.com/software/fonts/sitelenselikiwen/"
				>
					{t('sitelen seli kiwen', 'sitelen seli kiwen font')}</Link
				>{t('.', ' is used for sitelen pona displayed on the site.')}
			</li>

			<li>
				{t('sitelen kijetesantakalu lipu li kepeken', 'The')}
				<Link href="https://github.com/ETBCOR/nasin-nanpa">
					{t('nasin nanpa', 'nasin nanpa font')}</Link
				>{t('.', " was used for the site's favicon.")}
			</li>
		</ul>
	</div>

	<div class="box">
		<h2>{t('ante', 'differences')}</h2>

		<p>
			{t(
				'ijo mute a lipu li tan sona Linku. taso, mi wan e sona Linku e sona lipamanka la jan li ken lukin e ona tu kepeken lipu wan. (lipamanka li ken e ni.)',
				"Almost all data on this website is directly from sona Linku. However, I'm also scraping lipamanka's semantic space dictionary (with permission) to make the entries immediately available here."
			)}
		</p>
	</div>
</div>

<style lang="postcss">
	@reference '../../styles/app.css';

	h2 {
		@apply text-xl;
	}

	div p {
		@apply mt-2;
	}

	ul {
		@apply mt-2 ml-4 list-disc;
	}
</style>
