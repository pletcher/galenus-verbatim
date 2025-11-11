<script lang="ts">
	import type { TableOfContentsEntry } from '$lib/types.js';

	import NavigationItem from './NavigationItem.svelte';

	interface Props {
		currentPassageUrn: string;
		toc: Array<TableOfContentsEntry>;
	}

	let { toc, currentPassageUrn }: Props = $props();
</script>

<ul class="flex flex-1 flex-col gap-y-3" role="list">
	{#each toc as entry (entry.urn)}
		<NavigationItem {entry} {currentPassageUrn} />
	{/each}
</ul>
