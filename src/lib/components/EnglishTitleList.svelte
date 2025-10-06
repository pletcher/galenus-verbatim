<script lang="ts">
	// TODO
	import type { ZoteroItem } from '$lib/zotero';

	const { zoteroData } = $props();

	const items = $derived(
		zoteroData
			.filter((item: ZoteroItem) => Boolean(item.callNumber) && Boolean(item.englishTitle))
			.toSorted((itemA: ZoteroItem, itemB: ZoteroItem) =>
				itemA.englishTitle?.localeCompare(itemB.englishTitle || '')
			)
	);
</script>

{#each items as item (item.key)}
	<div>
		<span class="italic text-zinc-500">{item.englishTitle}</span>
		<span class="font-bold">[{item.callNumber}]</span>
	</div>
{/each}
