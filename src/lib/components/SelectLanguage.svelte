<script lang="ts">
	import type { Language } from '@kulupu-linku/sona';

	import { language } from '$lib/stores';
	import { sortLanguages } from '$lib/util';

	import Select from './Select.svelte';

	interface Props {
		languages: Record<string, Language>;
		onchange: (value: string) => void;
	}

	const { languages, onchange }: Props = $props();
</script>

<Select
	name="Language"
	options={sortLanguages(languages).map((language) => {
		return {
			label: language.name.endonym ?? language.name.en,
			value: language.id
		};
	})}
	value={$language}
	{onchange}
/>
