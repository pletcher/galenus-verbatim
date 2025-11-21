export interface Line extends TextElement {
	elements?: TextElement[];
}

export interface Section extends Textpart {
	lines: Line[];
	preText: string;
}

export type TextpartSubtype = 'book' | 'chapter' | 'section';

export type TableOfContentsEntry = {
	children?: Array<TableOfContentsEntry>;
	label: string;
	subtype: TextpartSubtype;
	urn: string;
};

export type TextElement = {
	char_offset: number;
	end_char_offset?: number;
	end_token_offset?: string;
	line?: number;
	n: string | number;
	page?: string;
	rend?: string;
	tagname: string;
	token_offset: string | null;
	urn: string;
	value?: string;
	// There are too many properties from unknown elements
	// to enumerate ahead of time.
	[key: string]: unknown;
};

export type Textpart = {
	type: 'textpart';
	subtype: TextpartSubtype;
	n: string;
	id: string;
	content: string;
	line: number;
	page: string;
	tokens: Array<string>;
	urn: string;
};

export type Word = {
	offset: number;
	text: string;
	textElements?: (TextElement | undefined)[];
	urn_index: number;
	urn: string;
	xml_id: string;
};

export type WorkMetadata = {
	textpart_labels: Array<string>;
	table_of_contents: Array<TableOfContentsEntry>;
};
