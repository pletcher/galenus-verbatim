<script lang="ts">
	// TODO
	import type { ZoteroItem } from '$lib/zotero';

	const { zoteroData } = $props();

	const items = $derived(
		zoteroData
			.filter((item: ZoteroItem) => Boolean(item.callNumber) && Boolean(item.greekTitle))
			.toSorted((itemA: ZoteroItem, itemB: ZoteroItem) =>
				itemA.greekTitle?.localeCompare(itemB.greekTitle || '')
			)
	);
</script>

{#each items as item (item.key)}
	<div class="hover:bg-neutral-50">
		<a href={`#${item.ctsURN}`}>
			<span class="italic text-zinc-500">{item.greekTitle}</span>
			<span class="font-bold">[{item.callNumber}]</span>
		</a>
	</div>
{/each}
