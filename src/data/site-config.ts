/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://amendeetpoints.fr";
export const SITE_NAMES: Record<string, string> = {"fr": "Amende et Points", "en": "Amende et Points"};
export const LANG_TAGS: Record<string, string> = {"fr": "fr-FR", "en": "en-FR"};
export const OG_LOCALES: Record<string, string> = {"fr": "fr_FR", "en": "en_GB"};
export const LOCALE_TAG = 'fr-FR';
export const LOCALE_BY_LANG: Record<string, string> = { fr: 'fr-FR', en: 'en-GB' };
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-22';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"fr": "Éditeur d'un calculateur indépendant des sanctions routières : vitesse retenue, amende, points et radars fixes", "en": "Publisher of an independent calculator of French traffic penalties: recorded speed, fine, points and fixed cameras"};
export const AUTHOR_DESC: Record<string, string> = {"fr": "Radif Partners applique la marge technique des cinémomètres à la vitesse lue sur l'avis, en déduit la ligne exacte du Code de la route (article R413-14 ou délit L413-1), puis affiche l'amende minorée, forfaitaire et majorée, les points retirés et le délai pour les récupérer. La carte reprend les 3 309 radars fixes publiés par le ministère de l'Intérieur.", "en": "Radif Partners subtracts the legal speed-camera margin from the speed printed on your notice, finds the exact line of the French Highway Code (article R413-14, or the L413-1 offence above 50 km/h), then shows the reduced, standard and increased fine, the points lost and when they come back. The map uses the 3,309 fixed cameras published by the French Interior Ministry."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"fr": ["Barème des excès de vitesse (article R413-14 du Code de la route)", "Délit de grand excès de vitesse (article L413-1)", "Marge technique des radars fixes et embarqués", "Permis à points, récupération et stage", "Amende minorée, forfaitaire et majorée", "Radars automatiques fixes par département"], "en": ["French speeding penalty scale (Highway Code article R413-14)", "The 50 km/h-over speeding offence (article L413-1)", "Technical margin of fixed and in-car speed cameras", "French points licence and point recovery", "Reduced, standard and increased fixed fines", "Fixed speed cameras by French département"]};
export const CONTACT_EMAIL = "contact@amendeetpoints.fr";
export const THEME_COLOR = '#A3271D';
export const LOGO_SYMBOL = 'km/h';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'z25z4lcztt';
export const INDEXNOW_KEY = '6aeb48a54ceb6ef8285a2ddd3a39354d';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',            // raison sociale ou nom commercial exploité
  legalForm: '',  // vide : publication à titre personnel, pas de société
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "TVA",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
