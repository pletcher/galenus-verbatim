<script lang="ts">
	import type { ZoteroItem } from '$lib/zotero';

	const { zoteroData } = $props();

	const items = $derived(
		zoteroData
			.filter((item: ZoteroItem) => Boolean(item.callNumber))
			.toSorted(
				(itemA: ZoteroItem, itemB: ZoteroItem) =>
					parseInt(itemA.callNumber as string) - parseInt(itemB.callNumber as string)
			)
	);
</script>

{#each items as item (item.key)}
	<div>
		<span class="font-bold">[{item.callNumber}]</span>
		<span class="italic text-zinc-500">{item.latinTitle}</span>
	</div>
{/each}
