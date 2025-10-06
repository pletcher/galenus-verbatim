<script lang="ts">
	import type { ZoteroItem } from '$lib/zotero';

	const { zoteroData } = $props();

	const items = $derived(
		zoteroData
			.filter((item: ZoteroItem) => Boolean(item.kuehnEditionVolume))
			.toSorted(
				(itemA: ZoteroItem, itemB: ZoteroItem) =>
					parseInt(itemA.kuehnEditionVolume) - parseInt(itemB.kuehnEditionVolume) ||
					parseInt(itemA.kuehnEditionPages?.split('-')[0]) -
						parseInt(itemB.kuehnEditionPages?.split('-')[0])
			)
	);
</script>

{#each items as item (item.key)}
	<div class="text-zinc-900">
		<span class="font-bold">{item.kuehnEditionVolume}.{item.kuehnEditionPages?.split('-')[0]}</span>
		<span class="text-sm">[{item.callNumber} Ficht.]</span>
		<span class="italic text-zinc-500">{item.latinTitle}</span>
	</div>
{/each}
