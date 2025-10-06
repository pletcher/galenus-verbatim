<script lang="ts">
	import CGTAbbreviationList from '$lib/components/CGTAbbreviationList.svelte';
	import CMGAbbreviationList from '$lib/components/CMGAbbreviationList.svelte';
	import EnglishTitleList from '$lib/components/EnglishTitleList.svelte';
	import FichtnerList from '$lib/components/FichtnerList.svelte';
	import FrenchTitleList from '$lib/components/FrenchTitleList.svelte';
	import GreekTitleList from '$lib/components/GreekTitleList.svelte';
	import KuehnList from '$lib/components/KuehnList.svelte';
	import LatinTitleList from '$lib/components/LatinTitleList.svelte';

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
				<article id={item.ctsUrn}>
					<section class="opus">
						<strong>
							{item.author?.name}.
							<em>{item.title} ({item.shortTitle})</em>
						</strong>
						<div>
								<a class="pico-color-pumpkin-500" href={item.criticalEdition?.data?.url}>
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
						    <a href=
						</div>
					</section>
				</article>
			{/each}
		</main>
	</div>
</div>
