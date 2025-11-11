<script lang="ts">
	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="grid grid-cols-5 pt-4">
	<div class="hidden sm:inset-y-0 sm:z-50 sm:flex sm:w-72 sm:flex-col dark:bg-gray-900">
		<nav class="flex flex-1 flex-col">
			<Navigation toc={data.toc} currentPassageUrn={data.urn} />
		</nav>
	</div>

	<div class="col-span-3">
		{#each data.textparts as textpart (textpart.urn)}
			{textpart.content}
		{/each}
	</div>
</div>
