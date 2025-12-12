import fs from 'fs';

import CTS_URN from '$lib/CTS_URN';

import type { PageServerLoad } from './$types';
import type {
	Section,
	TableOfContentsEntry,
	TextElement,
	Textpart,
	WorkMetadata
} from '$lib/types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const urn = new CTS_URN(params.urn);
	const urnFragment = urn.__urn.replace('urn:cts:greekLit:', '').split(':')[0];
	const dirname = `src/lib/data/works/${urnFragment}`;

	const metadataFilename = `${dirname}/metadata.json`;
	const rawMetadata = fs.readFileSync(metadataFilename).toString('utf-8');
	const metadata: WorkMetadata = JSON.parse(rawMetadata);

	const toc: Array<TableOfContentsEntry> = metadata.table_of_contents;
	const levels = metadata.textpart_labels.length;
	const firstTextpartInTOC = levels > 1 ? toc[0]?.subpassages && toc[0].subpassages[0] : toc[0];
	const firstTextpartUrn = new CTS_URN((firstTextpartInTOC as TableOfContentsEntry).urn);

	if (urn.integerCitations.length === 0) {
		return redirect(308, `/${firstTextpartUrn}`);
	}

	const elementsFilename = `${dirname}/${urnFragment}.elements.json`;
	const rawElements = fs.readFileSync(elementsFilename).toString('utf-8');
	const elements: Array<TextElement> = JSON.parse(rawElements);

	const textpartsFilename = `${dirname}/${urnFragment}.textparts.json`;
	const rawTextparts = fs.readFileSync(textpartsFilename).toString('utf-8');
	const textparts: WorkMetadata = JSON.parse(rawTextparts);

	let requestedElements = elements.filter((el) => urn.contains(new CTS_URN(el.urn)));

	return { metadata, textElements: requestedElements, textparts, toc, urn: params.urn };
};
