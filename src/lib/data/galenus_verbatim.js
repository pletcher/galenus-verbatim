import { default as docs } from "./docs.json" with { type: "json" };
import { default as editions } from "./editions.json" with { type: "json" };
import { default as lemmata } from "./lemmata.json" with { type: "json" };
import { default as opera } from "./opera.json" with { type: "json" };
import { default as orth } from "./orth.json" with { type: "json" };
import { default as tokens } from "./tokens.json" with { type: "json" };

export default function main() {
	return {
		docs,
		editions,
		lemmata,
		opera,
		orth,
		tokens,
	};
}
