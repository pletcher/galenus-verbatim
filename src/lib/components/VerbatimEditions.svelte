<script lang="ts">
	import type { RawZoteroItem } from '$lib/zotero';
	import type { ZoteroCreator } from '$lib/zotero';

	let { verbatimEditions } = $props();
	let editions = $derived(
		verbatimEditions.toSorted(
			(v1: RawZoteroItem, v2: RawZoteroItem) => parseInt(v1.date || '') - parseInt(v2.date || '')
		)
	);
</script>

{#each editions as edition (edition.key)}
	<div>
		<a class="text-amber-600 hover:text-amber-700" href={edition.url}>
			<em>{edition.title}</em>,
			<span
				>ed. {edition.creators.find((c: ZoteroCreator) => c.creatorType === 'editor')?.lastName}
			</span>,
			<span>{edition.date}</span>,
			{#if edition.volume}
				<span>vol. {edition.volume}</span>,
			{/if}
			<span>pp. {edition.pages}</span>.
			<span>{edition.extra.split('CTS URN: ')[1]}</span>
		</a>
	</div>
{/each}
