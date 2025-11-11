<script lang="ts">
	import type { TableOfContentsEntry } from '$lib/types';
	import { resolve } from '$app/paths';
	import CTS_URN from '$lib/CTS_URN';
	import NavigationItem from './NavigationItem.svelte';

	interface Props {
		entry: TableOfContentsEntry;
		currentPassageUrn: string;
	}

	let { entry, currentPassageUrn }: Props = $props();
	let currentUrn = $derived(new CTS_URN(currentPassageUrn));
	let entryUrn = $derived(new CTS_URN(entry.urn));
	let isUnderlined = $derived(
		entryUrn.contains(currentUrn) || (!entry.children?.length && entryUrn.isEqual(currentUrn))
	);
</script>

<li class="rounded-none" class:bg-secondary={isUnderlined}>
	{#if entry.children?.length}
		<details open={isUnderlined}>
			<summary>
				<span class:underline={isUnderlined}>{entry.label}</span>
			</summary>
			<ul>
				{#each entry.children as subentry (subentry.urn)}
					<NavigationItem entry={subentry} {currentPassageUrn} />
				{/each}
			</ul>
		</details>
	{:else}
		<a href={resolve('/[urn]', { urn: entry.urn })}>
			<span class:underline={isUnderlined}>{entry.label}</span>
		</a>
	{/if}
</li>
