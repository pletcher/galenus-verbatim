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
	{#if item.frenchTitle}
		<div class="hover:bg-neutral-50">
			<a href={`#${item.ctsURN}`}>
				<span class="italic text-zinc-500">{item.frenchTitle}</span>
				<span>[{item.callNumber}]</span>
			</a>
		</div>
	{/if}
{/each}
