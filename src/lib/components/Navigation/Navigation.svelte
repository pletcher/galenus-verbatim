<script lang="ts">
	import type { TableOfContentsEntry } from '$lib/types.js';

	import NavigationItem from './NavigationItem.svelte';

	interface Props {
		currentPassageUrn: string;
		toc: Array<TableOfContentsEntry>;
	}

	let { toc, currentPassageUrn }: Props = $props();
</script>

<ul class="menu bg-base-200 p-0">
	{#each toc as entry (entry.urn)}
		<NavigationItem {entry} {currentPassageUrn} />
	{/each}
</ul>
