<script lang="ts">
	import type { PageProps } from './$types';

	import { page } from '$app/state';

	import { ReadingEnvironment, type PassageConfig, type RenderablePassageConfig } from 'kodon';
	import { resolve } from '$app/paths';

	function assignPassageURL(passage: PassageConfig): RenderablePassageConfig {
		(passage as RenderablePassageConfig).url = resolve('/[urn]', { urn: passage.urn });

		passage.subpassages?.forEach(assignPassageURL);

		return passage as RenderablePassageConfig;
	}

	let { data }: PageProps = $props();
	let passages = $derived(data.toc.map(assignPassageURL));
</script>

<ReadingEnvironment
	currentURL={page.url}
	currentPassageURN={data.urn}
	heatmapTooltip={''}
	filterListTooltip={''}
	navigationTooltip={''}
	tableViewTooltip={''}
	passages={passages}
	textContainers={data.textElements}
/>
