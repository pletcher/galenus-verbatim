<script lang="ts">
	import type { ZoteroItem } from '$lib/zotero';

	const { zoteroData } = $props();

	const items = $derived(
		zoteroData
			.filter((item: ZoteroItem) => Boolean(item.latinAbbreviatedTitle))
			.toSorted((itemA: ZoteroItem, itemB: ZoteroItem) =>
				itemA.latinAbbreviatedTitle.localeCompare(itemB.latinAbbreviatedTitle)
			)
	);
</script>

{#each items as item (item.key)}
	<div>
		<span class="italic text-zinc-500">{item.latinAbbreviatedTitle}</span>
		<span class="text-sm">[{item.callNumber}]</span>
	</div>
{/each}
