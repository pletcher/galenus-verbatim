<script lang="ts">
	import getEditions from '$lib/data/getEditions.js';
	import { fetchOpera } from '$lib/zotero';

	const editions = getEditions();
	const allTags = ['gen', 'anat', 'physiol', 'nosol', 'therap', 'pharm', 'Hipp', 'phil'];

	let shownEditions = $state(editions);
	let gommettes: string[] = $state([]);

	const filterEditions = async () => {
		if (gommettes.length === 0) {
			shownEditions = editions;
			return;
		}

		const tags = gommettes.join(' || ');
		const data = await fetchOpera(tags);
		const urns = data.map((d) => {
			const extra = d.data.extra;
			const fields = extra.split('\n');
			const rawURN = fields.find((field) => field.startsWith('CTS URN'));
			const urn = rawURN.replace('CTS URN:', '').trim();

			return urn;
		});
		shownEditions = editions.filter((edition) => {
			return urns.some((urn) => edition.cts.startsWith(urn));
		});
	};
</script>

<div class="max-w-8xl mx-auto rounded-lg border bg-white p-6 shadow-sm">
	<h1 class="mb-6 text-2xl font-bold text-gray-800">Sélection des Titres</h1>

	<div class="mb-8 space-y-4">
		<div class="flex flex-wrap items-center gap-6">
			<div class="flex items-center gap-2">
				<label for="afficher" class="text-sm font-medium text-gray-700"> Afficher : </label>
				<select
					id="afficher"
					class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					disabled={true}
				>
					<option value="sort-cmg" selected={true}>Abbréviation CMG</option>
					<option value="sort-latin">Titre latin</option>
					<option value="sort-grec">Titre grec</option>
					<option value="sort-francais">Titre français</option>
					<option value="sort-anglais">Titre anglais</option>
					<option value="sort-cgt">Abbréviation CGT</option>
				</select>
			</div>

			<div class="flex items-center gap-2">
				<label for="trier" class="text-sm font-medium text-gray-700"> Trier : </label>
				<select
					id="trier"
					class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					disabled={true}
				>
					<option value="auteur">Par auteur</option>
					<option value="titre">Par titre</option>
					<option value="matiere" selected={true}>Par matière</option>
				</select>
			</div>

			<div class="flex items-center gap-2">
				<input
					type="checkbox"
					id="tout-cocher"
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					disabled={true}
				/>
				<label for="tout-cocher" class="text-sm font-medium text-gray-700">
					Tout cocher/décocher
				</label>
			</div>

			<div class="flex items-center gap-2">
				<input
					type="checkbox"
					id="ignorer-doublons"
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					disabled={true}
				/>
				<label for="ignorer-doublons" class="text-sm font-medium text-gray-700">
					Ignorer doublons
				</label>
			</div>
		</div>

		<div class="flex flex-wrap items-center gap-6">
			<div class="flex items-center gap-2">
				<input
					type="checkbox"
					id="gal"
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
				<label for="gal" class="text-sm font-medium text-gray-700"> Gal. </label>
			</div>

			<div class="flex items-center gap-2">
				<input
					type="checkbox"
					id="ps-gal"
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
				<label for="ps-gal" class="text-sm font-medium text-gray-700"> Ps.-Gal. </label>
			</div>

			<div class="flex items-center gap-3">
				<span class="text-sm font-medium text-gray-700"> Gommettes : </span>
				<div class="flex gap-2">
					{#each allTags as tag (tag)}
						<input
							type="checkbox"
							id={`_${tag}`}
							class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							bind:group={gommettes}
							onchange={filterEditions}
							value={`_${tag}`}
						/>
						<label for="therap" class="text-sm font-medium text-gray-700"> {tag}. </label>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<div class="overflow-x-auto">
		<div class="inline-block min-w-full py-2 align-middle">
			<table class="divide-y divide-gray-300 dark:divide-white/15">
				<thead>
          <tr>
            <th
              scope="col"
              class="p-2 text-left text-sm font-semibold text-gray-900 dark:text-white"
            >
              Editeur(s)
            </th>
						<th
							scope="col"
							class="p-2 text-left text-sm font-semibold text-gray-900 dark:text-white"
						>
							Titre grec
						</th>
						<th
							scope="col"
							class="p-2 text-left text-sm font-semibold text-gray-900 dark:text-white"
						>
							Titre latin
						</th>
						<th
							scope="col"
							class="p-2 text-left text-sm font-semibold text-gray-900 dark:text-white"
						>
							Titre français
						</th>
						<th
							scope="col"
							class="p-2 text-left text-sm font-semibold text-gray-900 dark:text-white"
						>
							Titre anglais
						</th>
					</tr>
				</thead>
				<tbody class="bg-white dark:bg-gray-900">
					{#each shownEditions as edition (edition.id)}
						<tr class="even:bg-gray-50 dark:even:bg-gray-800/50">
              <td class="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                {edition.editors.split(",")[0]}
              </td>
							<td class="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
								<a
									href={edition.cts}
									title={edition.cts}
									class="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
								>
									{edition.titles.greek}
								</a>
							</td>
							<td class="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
								{edition.titles.latin}
							</td>
							<td class="px-2 py-1 text-xs text-gray-900 dark:text-white">
								{edition.titles.french}
							</td>
							<td class="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
								{edition.titles.english}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
