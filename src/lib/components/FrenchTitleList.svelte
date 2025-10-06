<script lang="ts">
	// TODO
	import type { ZoteroItem } from '$lib/zotero';

	const { zoteroData } = $props();

	const items = $derived(
		zoteroData
			.filter((item: ZoteroItem) => Boolean(item.callNumber))
			.toSorted((itemA: ZoteroItem, itemB: ZoteroItem) =>
				itemA.frenchTitle?.localeCompare(itemB.frenchTitle || '')
			)
	);
</script>

{#each items as item (item.key)}
	<div>
		<span class="italic text-zinc-500">{item.frenchTitle}</span>
		<span class="font-bold">[{item.callNumber}]</span>
	</div>
{/each}
