import { default as zoteroJSON } from './data/gv_zotero.json' with { type: 'json' };

const BASE_URL = 'https://api.zotero.org';
const ZOTERO_API_VERSION = '3';

const COLLECTION_IDS_TO_NAMES: { [key: string]: string } = {
	'9QP457XQ': 'Editiones criticae',
	XWUKKHRC: 'Editiones verbatim',
	ZTP7ASC3: 'Editiones veterae',
	EEF8L3QT: 'Galeni et Pseudo-Galeni opera',
	DTQ8XZKP: 'Libri ad Galenum pertinentes',
	'2XYEX7QT': 'Translationes recentiores',
	J4EMVD4V: 'Translationes verbatim'
};

const COLLECTION_NAMES_TO_IDS = Object.keys(COLLECTION_IDS_TO_NAMES).reduce(
	(obj: { [key: string]: string }, key) => {
		obj[COLLECTION_IDS_TO_NAMES[key]] = key;

		return obj;
	},
	{}
);

export async function fetchOpera(tags: string[] = []) {
	const path = 'groups/4571007/collections/EEF8L3QT/items';
	let url = `${BASE_URL}/${path}?limit=100`;

	if (tags.length > 0) {
		url += `&tag=${tags}`;
	}

	const headers = { 'Zotero-API-Version': ZOTERO_API_VERSION };
	const response = await fetch(url, { headers });
	const data = await response.json();

	return data;
}

export interface ZoteroCreator {
	creatorType: 'author' | 'editor' | 'translator';
	name?: string;
	firstName?: string;
	lastName?: string;
}

type itemType = 'attachment' | 'book' | 'bookSection' | 'note';

/**
 * Use the .data attribute, rather than
 * any of the top-level information
 */
export interface RawZoteroItem {
	bookTitle?: string;
	callNumber?: string;
	creators: Array<ZoteroCreator>;
	collections?: Array<string>;
	date?: string;
	edition?: string;
	extra?: string;
	ISBN?: string;
	itemType: itemType;
	key: string;
	language?: string;
	numPages?: string;
	pages?: string;
	parentItem?: string;
	place?: string;
	publisher?: string;
	series?: string;
	shortTitle?: string;
	tags: Array<{ tag: string }>;
	title: string;
	url?: string;
	volume?: string;
}

function getCollectionByName(collectionName: string) {
	return (zoteroJSON as Array<{ data: RawZoteroItem }>)
		.filter(({ data }) => {
			return data.collections?.includes(COLLECTION_NAMES_TO_IDS[collectionName]);
		})
		.map((item) => item.data);
}

/** (pseudo-fields are fields stored under the `extra` value
 * of a Zotero item. They are line-delimited and then separated
 * by `: ` (a colon and a space), so we can get a list of them
 * by `item.extra.split('\n').map(e => e.split(': '))`.)
 */

/**
 * editionesCriticae are modern editions. They have editors and translators,
 * and occasionally bookTitles. Date, pages, and language are also relevant.
 * They are aligned to editionesVerbatim via the callNumber.
 */
const editionesCriticae = getCollectionByName('Editiones criticae');

/**
 * editionesVerbatim seem like they should be the main editions
 * to which the others are keyed, but that doesn't seem to be the case.
 */
const editionesVerbatim = getCollectionByName('Editiones verbatim');

/**
 * editionesVeterae are early modern editions of Galen. Titles
 * are in Greek or Latin. One might have multiple editors and/or
 * be in multiple volumes. URLs point to bibliotechnical resources.
 * Aligned to editionesVerbatim via callNumber. Their extra field
 * containes a 'Titre complet' pseudo-field.
 */
const editionesVeterae = getCollectionByName('Editiones veterae');

/**
 * The opera are deduplicated works of Galen with their Latin titles. We
 * key the other lists off of this list.
 * The extra field contains 'Original Title', 'French Title', 'English Title',
 * 'English Short Title', and 'CTS URN' pseudo-fields. They are aligned to
 * editionesVerbatim by callNumber.
 */
const opera = getCollectionByName('Galeni et Pseudo-Galeni opera');

/**
 * libriPertinentes are modern bibliography. They don't align to
 * a single editio verbatim; they should be displayed on their own page.
 */
// const libriPertinentes = getCollectionByName('Libri ad Galenum pertinentes');

/**
 * translationesRecentiores are modern translations. Aligned to editionesVerbatim
 * by callNumber.
 */
const translationesRecentiores = getCollectionByName('Translationes recentiores');

/**
 * translationesVerbatim are Kühn's Latin translations. {volume}.{pages} provides
 * part of the label in the interface. They are aligned to editionesVerbatim by
 * callNumber. Their extra field contains a 'CTS URN' pseudo-field.
 */
const translationesVerbatim = getCollectionByName('Translationes verbatim');

const allAttachments = (zoteroJSON as Array<{ data: RawZoteroItem }>)
	.filter(({ data }) => data.itemType === 'attachment')
	.map((i) => i.data);

const allNotes = (zoteroJSON as Array<{ data: RawZoteroItem }>)
	.filter(({ data }) => data.itemType === 'note')
	.map((n) => n.data);

type ZoteroAttachment = {
	parentItem: string;
	title: string;
	url: string;
};

/**
 * Use the .data attribute, rather than
 * any of the top-level information
 */
export interface ZoteroItem {
	ancientEdition: RawZoteroItem;
	attachments: ZoteroAttachment[];
	criticalEditions: RawZoteroItem[];
	bookTitle?: string;
	callNumber?: string;
	collections?: Array<string>;
	creators: Array<ZoteroCreator>;
	ctsURN?: string;
	date?: string;
	edition?: string;
	englishTitle?: string;
	englishShortTitle?: string;
	extra?: string;
	fichtnerNumber: string;
	fichtnerURL?: string;
	frenchTitle?: string;
	galLatURL?: string;
	greekTitle?: string;
	ISBN?: string;
	itemType: itemType;
	key: string;
	kuehnEdition: RawZoteroItem;
	kuehnEditionKey: string;
	kuehnEditionTitle: string;
	kuehnEditionPages: string;
	kuehnEditionVolume: string;
	language?: string;
	latinAbbreviatedTitle: string;
	latinTitle: string;
	modernTranslations: RawZoteroItem[];
	notes: RawZoteroItem[];
	numPages?: string;
	pages?: string;
	parentItem?: string;
	place?: string;
	publisher?: string;
	series?: string;
	shortTitle?: string;
	tags: string[];
	title: string;
	url?: string;
	volume?: string;
	verbatimEdition: RawZoteroItem[];
}

export function readZoteroJSON() {
	return opera.map((opus) => {
		const attachments = allAttachments.filter((item) => item.parentItem === opus.key);
		const fichtnerNumber = opus.callNumber;
		const fichtnerURL = attachments.find((a) => a.title === 'Fichtner Bibliographie')?.url;
		const ancientEdition = editionesVeterae.find((item) => item.callNumber === fichtnerNumber);
		const author = opus.creators.find((c) => c.creatorType === 'author');
		const criticalEditions = editionesCriticae.filter((item) => item.callNumber === fichtnerNumber);
		const kuehnEdition = translationesVerbatim.find(
			(item) =>
				item.callNumber === fichtnerNumber && item.creators.some((c) => c.lastName === 'Kühn')
		);
		const modernTranslations = translationesRecentiores.filter(
			(item) => item.callNumber === fichtnerNumber
		);
		const notes = allNotes.filter((note) => note.parentItem === opus.key);
		const verbatimEditions = editionesVerbatim.filter((item) => item.callNumber === fichtnerNumber);
		const extra = opus.extra?.split('\n').reduce(
			(acc, line) => {
				const [k, v] = line.split(': ').map((s) => s.trim());

				acc[k] = v;

				return acc;
			},
			{} as { [key: string]: string }
		);

		const galLatURL = attachments.find((a) => a.title === 'Galeno Latino')?.url;

		return {
			...opus,
			ancientEdition,
			attachments,
			author,
			criticalEditions,
			ctsURN: extra?.['CTS URN'],
			englishTitle: extra?.['English Title'],
			englishShortTitle: extra?.['English Short Title'],
			extra,
			fichtnerNumber,
			fichtnerURL,
			frenchTitle: extra?.['French Title'],
			galLatURL,
			greekTitle: extra?.['Original Title'],
			kuehnEdition,
			kuehnEditionKey: kuehnEdition?.key,
			kuehnEditionTitle: kuehnEdition?.title,
			kuehnEditionPages: kuehnEdition?.pages,
			kuehnEditionVolume: kuehnEdition?.volume,
			latinAbbreviatedTitle: opus.shortTitle,
			latinTitle: kuehnEdition?.title,
			modernTranslations,
			notes,
			tags: opus.tags.map((tag) => tag.tag),
			verbatimEditions
		};
	});
}
