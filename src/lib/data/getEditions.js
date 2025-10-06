import * as cheerio from "cheerio";

import { default as editions } from "./editions.json" with { type: "json" };

export default function getEditions() {
	const titles = editions.map((edition) => {
		const latinTitle = edition.title;

		const $ = cheerio.load(edition.bibl, null, false);
		const $titles = $(".opus_tituli");
		const greekTitle = $titles.find(".original-title > .title").text();
		const frenchTitle = $titles.find(".french-title > .title").text();
		const englishTitle = $titles
			.find(".english-title > .title")
			.not(".short")
			.text();

		const englishShortTitle = $titles
			.find(".english-title > .title.short")
			.text();

		return {
			...edition,
			titles: {
				french: frenchTitle,
				greek: greekTitle,
				latin: latinTitle,
				english: `${englishTitle} (${englishShortTitle})`,
			},
		};
	});

	return titles;
}
