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
	const filename = `${dirname}/${urnFragment}.json`;
	const metadataFilename = `${dirname}/metadata.json`;

	const raw = fs.readFileSync(filename).toString('utf-8');
	const rawMetadata = fs.readFileSync(metadataFilename).toString('utf-8');

	const metadata: WorkMetadata = JSON.parse(rawMetadata);
	const work: Array<TextElement | Textpart> = JSON.parse(raw);

	const toc: Array<TableOfContentsEntry> = metadata.table_of_contents;
	const textparts = work.filter((el) => el.type === 'textpart') as Array<Textpart>;
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
			console.log(tpUrn);
			if (urn) {
				return urn.contains(tpUrn);
			}

			return firstTextpartUrn.contains(tpUrn);
		});
	}

	const textElements = work
		.filter(
			(el) =>
				el.type !== 'textpart' &&
				el.urn &&
				new CTS_URN(requestedTextparts[0].urn).contains(new CTS_URN(el.urn))
		)
		.sort(
			(a, b) =>
				(a as TextElement).char_offset - (b as TextElement).char_offset ||
				((a as TextElement).end_char_offset || 0) - ((b as TextElement).end_char_offset || 0)
		) as TextElement[];

	function getElementsForLine(lineN: number) {
		return textElements.filter((te) => te.line === lineN);
	}

	function getLinesForTextpart(textpart: Textpart) {
		let lines = textElements.filter(
			(te) =>
				(te.tagname === 'lb' || te.tagname === 'pb') &&
				// get null URN text elements because they come before we hit a valid
				// URN
				(new CTS_URN(textpart.urn).contains(new CTS_URN(te.urn)) || urn == null)
		);
		lines = lines.map((line, index) => {
			if (line.tagname === 'pb') {
				return line;
			}

			let elements = getElementsForLine(typeof line.n === 'number' ? line.n : parseInt(line.n));
			elements = elements.map((el, index) => {
				const innerText = textpart.content.slice(
					el.char_offset,
					el.end_char_offset || el.char_offset
				);
				const tailText = textpart.content.slice(
					el.end_char_offset || el.char_offset,
					elements[index + 1]?.char_offset
				);

				return {
					...el,
					tailText,
					text: innerText
				};
			});

			const nextLine = lines.length > index + 1 ? lines[index + 1] : null;

			if (nextLine) {
				return {
					...line,
					elements,
					text: textpart.content.slice(line.char_offset, nextLine.char_offset)
				};
			}
			return {
				...line,
				elements,
				text: textpart.content.slice(line.char_offset)
			};
		});

		return lines;
	}

	const lineatedSections = (requestedTextparts as Section[]).reduce((sections, textpart) => {
		const lines = getLinesForTextpart(textpart);

		textpart.lines = lines;

		if (lines.length > 0) {
			const preText = textpart.content.slice(0, lines[0].char_offset);
			textpart.preText = preText;
		}

		return [...sections, textpart as Section];
	}, [] as Section[]);

	return { metadata, textElements, toc, textparts: lineatedSections, urn: params.urn };
};
