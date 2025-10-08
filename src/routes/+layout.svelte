<script lang="ts">
	import '../app.css';

	import favicon from '$lib/assets/favicon.svg';
	import banner from '$lib/assets/theme/galenus-verbatim.jpg';
	import enveloppe from '$lib/assets/theme/enveloppe.png';
	import hnLogo from '$lib/assets/theme/logo_hn.png';
	import humabiomedLogo from '$lib/assets/theme/logo_humabiomed.png';
	import iufLogo from '$lib/assets/theme/logo_IUF.png';
	import sorbonneLettresLogo from '$lib/assets/theme/logo_sorbonne-lettres.png';
	import umr8167Logo from '$lib/assets/theme/logo_UMR8167.png';
	import zoteroLogo from '$lib/assets/theme/logo_zotero.png';

	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	let { children } = $props();
	let selectedPage = $state('opera');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script src="https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.10.5/viewer.min.js"></script>
</svelte:head>

<header id="header" class="nav-down">
	<div class="banner">
		<div class="titles">
			<a href={`${base}/`}>
				<div class="title">Galenus verbatim</div>
				<div class="titlesub">Γαληνὸς κατὰ λέξιν</div>
			</a>
		</div>
		<div class="moto">Naviguer dans le texte de Galien de Pergame, éd. Kühn (1821–1833) & al.</div>
		<img class="banner" src={banner} alt="Galenus Verbatim banner" />
	</div>
</header>
<div id="all">
	<div id="content">
		<nav id="tabs" class="tabs">
			<a class="tab" href="https://galenus-verbatim.huma-num.fr/">
				Galenus
				<br />
				Verbatim
			</a>
			<form>
				<label for="cts">Accès rapide</label>
				<br />
				<input
					class="h-6"
					id="cts"
					name="cts"
					title="urn:cts ou référérence Kühn brève (ex : 18b.26.4)"
					placeholder="e.g. XVIII B, 559; 18a.553.3 ; urn:cts:greekLit:tlg0057.tlg001.1st1K-grc1…"
					value=""
				/>
			</form>
			<a href="{base}/opera" class="tab" class:selected={selectedPage === 'opera'}>
				I18N template.opera
			</a>

			<!--
					{/*                            <?php
					if ($page == 'tlg') {
					    // if doc visible, add a buttoon search in doc search in doc
					    Verbatim::qform(true);
					}
					// if in concordantia, keep it
					else if ($page == 'concordantia') {
					    Verbatim::qform(false,  'concordantia');
					}
					else {
					    Verbatim::qform();
					}

					?>*/}
				-->

			<a href="{base}/titres" class="tab" class:selected={selectedPage === 'titres'}> I18N titres </a>
			<a href="{base}/de_en" class="tab" class:selected={selectedPage === 'de'}> I18N template.de </a>
			<a href="{base}/novitates" class="tab" class:selected={selectedPage === 'de_en'}>
				I18N Actualités
			</a>

			<a
				class="tab zotero"
				target="_blank"
				rel="noopener"
				href="https://www.zotero.org/groups/4571007/galenus-verbatim/library"
			>
				<span>
					Ad
					<br />
					bibliothecam
				</span>
				<img height="40px" src={zoteroLogo} alt="Zotero logo" />
			</a>
		</nav>
		<div class="container">{@render children?.()}</div>
	</div>
	<footer id="footer">
		<nav id="logos">
			<a href="https://www.iufrance.fr/" title="Institut universitaire de France">
				<img alt="Institut Universitaire de France" src={iufLogo} />
			</a>

			<a
				href="http://www.orient-mediterranee.com/spip.php?rubrique314"
				title="UMR 8167 Orient et Méditerranée"
			>
				<img alt="UMR 8167 Orient et Méditerranée" src={umr8167Logo} />
			</a>

			<a
				href="https://lettres.sorbonne-universite.fr/faculte-des-lettres/ufr/lettres/grec/"
				title="Faculté des Lettres de Sorbonne Université"
			>
				<img alt="Faculté des Lettres de Sorbonne Université" src={sorbonneLettresLogo} />
			</a>

			<a
				href="https://humanites-biomedicales.sorbonne-universite.fr/"
				title="Initiative humanités biomédicales de l’Alliance Sorbonne Université"
			>
				<img
					alt="Initiative humanités biomédicales de l’Alliance Sorbonne Université"
					src={humabiomedLogo}
				/>
			</a>

			<a
				href="https://documentation.huma-num.fr/hebergement-web/"
				title="Site hébergé par Huma-Num"
			>
				<img alt="Site hébergé par Huma-Num" src={hnLogo} />
			</a>

			<a
				aria-label="email-link"
				href="_blank"
				onmouseover={() =>
					(this.href = 'ma' + 'i' + 'lto:' + 'etymologika' + '\u0040gm' + 'ail.com')}
				onfocus={() => (this.href = 'ma' + 'i' + 'lto:' + 'etymologika' + '\u0040gm' + 'ail.com')}
			>
				<img style="opacity: 0.7;" src={enveloppe} alt="enveloppe" />
			</a>
		</nav>
	</footer>
</div>

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
