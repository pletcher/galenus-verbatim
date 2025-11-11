<script lang="ts">
	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Navigation toc={data.toc} currentPassageUrn={data.urn} />

{#each data.textparts as textpart (textpart.urn)}
	{textpart.content}
{/each}
