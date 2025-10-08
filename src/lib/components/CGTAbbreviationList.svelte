<script lang="ts">
	// TODO
	import type { ZoteroItem } from '$lib/zotero';

	const { zoteroData } = $props();

	const items = $derived(
		zoteroData
			.filter((item: ZoteroItem) => Boolean(item.callNumber) && Boolean(item.englishShortTitle))
			.toSorted((itemA: ZoteroItem, itemB: ZoteroItem) =>
				itemA.englishShortTitle?.localeCompare(itemB.englishShortTitle || '')
			)
	);
</script>

{#each items as item (item.key)}
	<div class="hover:bg-neutral-50">
		<a href={`#${item.ctsURN}`}>
			<span class="italic text-zinc-500">{item.englishShortTitle}</span>
			<span class="font-bold">[{item.callNumber}]</span>
		</a>
	</div>
{/each}
