<script lang="ts">
	import type { ZoteroItem } from '$lib/zotero';

	const { zoteroData } = $props();

	const items = $derived(
		zoteroData.toSorted((itemA: ZoteroItem, itemB: ZoteroItem) =>
			(itemA.latinTitle || itemA.title)?.localeCompare(itemB.latinTitle || itemB.title)
		)
	);
</script>

{#each items as item (item.key)}
	<div class="text-zinc-900">
		<span class="italic text-zinc-500">{item.latinTitle || item.title}</span>
		<span class="text-sm">[{item.callNumber}]</span>
	</div>
{/each}
