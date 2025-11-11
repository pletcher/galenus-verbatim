import fs from 'fs';

import CTS_URN from '$lib/CTS_URN';

import type { PageServerLoad } from './$types';
import type { TableOfContentsEntry, TextElement, Textpart, WorkMetadata } from '$lib/types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const urn = new CTS_URN(params.urn);
	const urnFragment = urn.__urn.replace('urn:cts:greekLit:', '').split(':')[0];
	const dirname = `src/lib/data/works/${urnFragment}`;
	const filename = `${dirname}/${urnFragment}.json`;
	const metadataFilename = `${dirname}/metadata.json`;

	const raw = fs.readFileSync(filename).toString('utf-8');
	const rawMetadata = fs.readFileSync(metadataFilename).toString('utf-8');

	const metadata: WorkMetadata = JSON.parse(rawMetadata);
	const work: Array<TextElement | Textpart> = JSON.parse(raw);

	const toc: Array<TableOfContentsEntry> = metadata.table_of_contents;
	const textparts = work.filter((el) => el.type === 'textpart');
	const levels = metadata.textpart_labels.length;
	const firstTextpart = levels > 1 ? toc[0]?.children && toc[0].children[0] : toc[0];
	const firstTextpartUrn = new CTS_URN((firstTextpart as TableOfContentsEntry).urn);

	if (urn.integerCitations.length === 0) {
		redirect(308, `/${firstTextpartUrn}`);
	}

	let requestedTextparts = [];
	if (levels === 1) {
		requestedTextparts = textparts;
	} else {
		requestedTextparts = textparts.filter((tp) => {
			const tpUrn = new CTS_URN(tp.urn);

			if (urn.passageComponent) {
				return urn.contains(tpUrn);
			}

			return firstTextpartUrn.contains(tpUrn);
		});
	}

	const textElements = work.filter(
		(el) => el.urn && firstTextpartUrn.contains(new CTS_URN(el.urn))
	);

	return { metadata, textElements, toc, textparts: requestedTextparts, urn: params.urn };
};
