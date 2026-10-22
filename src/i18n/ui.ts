import type { Locale } from './routes';
const fr = {
  updatedOn: 'Mis à jour le', editorialPolicy: 'Charte éditoriale', contactLabel: 'Contact', reviewedBy: 'Vérifié par',
  skipToContent: 'Aller au contenu', mainNav: 'Navigation principale', breadcrumbLabel: 'Fil d’Ariane', breadcrumbHome: 'Accueil', menuOpen: 'Ouvrir le menu',
  faqTitle: 'Questions fréquentes', relatedCalculators: 'Pages et calculs associés', sourcesTitle: 'Sources', writtenBy: 'Rédigé par',
  asOf: 'Barème en vigueur', lastUpdated: 'textes relus le', footerValidated: 'Sources : Code de la route et Code de procédure pénale (Légifrance), radars fixes du ministère de l’Intérieur (data.gouv.fr, Licence Ouverte 2.0)', footerBrowser: 'Sans compte · aucun e-mail ni numéro demandé · résultat immédiat · gratuit',
  footerDisclaimer: 'Site indépendant édité par Radif Partners. Ce n’est pas un site de l’administration, de l’ANTAI ni de la Sécurité routière, et il ne vend ni stage, ni conseil d’avocat, ni assurance : aucun lien commercial, aucune commission. Les calculs appliquent les textes en vigueur à titre indicatif : seul l’avis de contravention reçu, ou la décision du juge, fait foi.', footerPopular: '', notFound: 'Cette page n’existe pas.',
  readMore: 'Lire la suite',
};
const en: typeof fr = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Frequently asked questions', relatedCalculators: 'Related pages and calculations', sourcesTitle: 'Sources', writtenBy: 'Written by',
  asOf: 'Penalty scale in force', lastUpdated: 'texts reread on', footerValidated: 'Sources: French Highway Code and Code of Criminal Procedure (Légifrance), fixed speed cameras from the Interior Ministry (data.gouv.fr, Licence Ouverte 2.0)', footerBrowser: 'No account · no email or phone number asked · instant result · free',
  footerDisclaimer: 'Independent site published by Radif Partners. It is not a government site, nor the ANTAI or the Sécurité routière, and it sells no course, legal advice or insurance: no commercial link, no commission. The calculations apply the texts in force for guidance only: only the notice you receive, or a court decision, is binding.', footerPopular: '', notFound: 'This page does not exist.',
  readMore: 'Read more',
};
export function t(lang: Locale) { return lang === 'en' ? en : fr; }
