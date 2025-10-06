<script lang="ts">
	import CGTAbbreviationList from '$lib/components/CGTAbbreviationList.svelte';
	import CMGAbbreviationList from '$lib/components/CMGAbbreviationList.svelte';
	import EnglishTitleList from '$lib/components/EnglishTitleList.svelte';
	import FichtnerList from '$lib/components/FichtnerList.svelte';
	import FrenchTitleList from '$lib/components/FrenchTitleList.svelte';
	import GreekTitleList from '$lib/components/GreekTitleList.svelte';
	import KuehnList from '$lib/components/KuehnList.svelte';
	import LatinTitleList from '$lib/components/LatinTitleList.svelte';
	import VerbatimEditions from '$lib/components/VerbatimEditions.svelte';

	import type { ZoteroCreator } from '$lib/zotero';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let sortBy = $state('kuehn');
	let ListComponent = $derived.by(() => {
		if (sortBy === 'kuehn') {
			return KuehnList;
		}

		if (sortBy === 'titLat') {
			return LatinTitleList;
		}

		if (sortBy === 'fichtner') {
			return FichtnerList;
		}

		if (sortBy === 'titLatAbbr') {
			return CMGAbbreviationList;
		}

		if (sortBy === 'titGrc') {
			return GreekTitleList;
		}

		if (sortBy === 'titFra') {
			return FrenchTitleList;
		}

		if (sortBy === 'titEng') {
			return EnglishTitleList;
		}

		if (sortBy === 'titEngAbbr') {
			return CGTAbbreviationList;
		}
	});
	let items = $derived(
		data.zoteroData
			.filter((item) => Boolean(item.callNumber))
			.toSorted(
				(itemA, itemB) =>
					parseInt(itemA.callNumber as string) - parseInt(itemB.callNumber as string)
			)
	);
</script>

<div class="grid">
	<aside id="navs">
		<form>
			<select name="selnav" id="selnav" bind:value={sortBy}>
				<option value="titLat">Titre latin</option>
				<option value="fichtner">&numero; Fichtner</option>
				<option value="kuehn">Édition Kühn</option>
				<option value="titLatAbbr">Abréviation CMG</option>
				<option value="titGrc">Titre grec</option>
				<option value="titFra">Titre français</option>
				<option value="titEng">Titre anglais</option>
				<option value="titEngAbbr">Abréviation CGT</option>
			</select>
		</form>

		<ListComponent zoteroData={data.zoteroData} />
	</aside>

	<div id="biblio" class="biblio">
		<main>
			{#each items as item (item.key)}
				<article id={item.ctsURN}>
					<section class="opus">
						<strong>
							{item.author?.name}.
							<em>{item.title} ({item.shortTitle})</em>
						</strong>
						<div>
							<a class="pico-color-pumpkin-500" href={item.fichtnerURL}>
								[Nº {item.callNumber} Ficht.]
							</a>
							{#if item.galLatURL}
								<a class="pico-color-pumpkin-500" href={item.galLatURL}>[Gal Lat.]</a>
							{/if}
						</div>
						<div>
							<span>{item.ctsURN}</span>
						</div>
						<div>
							<span>{item.greekTitle}</span>
						</div>
						<div>
							<em>{item.frenchTitle}</em>
						</div>
						<div>
							<em>{item.englishTitle} ({item.englishShortTitle})</em>
						</div>
						<div>
							<VerbatimEditions verbatimEditions={item.verbatimEditions} />
						</div>
						<div>
							<strong class="pico-color-zinc-600">editio(nes) critica(e):</strong>
							<span>{item.criticalEditions
								.map((edition) => {
									let editor = edition.creators.find((c) => c.creatorType === 'editor');

									if (!editor) {
										editor = edition.creators.find((c) => Boolean(c.lastName));
									}

									if (!editor) {
										console.log(edition);
										console.log('no editor');

										return null;
									}

									return `${editor.lastName}, ${edition.date}`;
								})
								.join('; ')}</span>
						</div>
						{#if item.kuehnEdition}
							<div>
								<strong class="pico-color-zinc-600">translatio Latina:</strong>
								<span>{item.latinTitle}, {item.kuehnEdition.date}, vol. {item.kuehnEdition.volume}, pp. {item.kuehnEdition.pages}.</span>
								<span>{item.kuehnEdition?.extra?.split('\n').find((e) => e.startsWith('CTS URN: '))?.split('CTS URN: ')?.[1]}</span>
							</div>
						{/if}
						{#if item.modernTranslations?.length > 0}
							<div>
								<strong class="pico-color-zinc-500">translationes recentiores</strong>
								<span>{item.modernTranslations.map(translation => {
									let translator = translation.creators.find((c) => c.creatorType === 'translator');

									if (!translator) {
										translator = translation.creators.find((c) => Boolean(c.lastName));
									}

									if (!translator) {
										console.log(translation);
										console.log('no translator');

										return null;
									}

									return `${translator.lastName}, ${translation.date} (${translation.language})`;
								}).join('; ')}</span>
							</div>
						{/if}
					</section>
				</article>
			{/each}
		</main>
	</div>
</div>
