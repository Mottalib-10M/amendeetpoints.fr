import { defineGuide, type Helpers } from '../../lib/guide-types';

const Pm = (h: Helpers) => h.P.permis;

export default defineGuide({
  id: 'stage-recuperation-points',
  group: 'points',
  order: 3,
  tool: 'points',
  outil: { defaults: [['feu', 3], ['tel', 9], ['v2', 16]] },
  related: ['recuperer-des-points', 'combien-de-points', 'permis-probatoire', 'exces-30-km-h', 'alcool-au-volant'],
  sources: ['l223_6', 'spRecup', 'l223_1'],
  fr: {
    slug: 'stage-recuperation-points',
    nav: 'Stage de récupération',
    card: '4 points une fois par an : quand le stage sert, et quand il est obligatoire.',
    title: 'Stage de récupération de points : 4 points, quand le faire',
    description: 'Stage de récupération de points : jusqu’à 4 points une fois par an, obligatoire en probatoire après 3 points perdus, impossible à zéro. Ce qu’il faut vérifier.',
    h1: 'Stage de récupération de points : combien il rend, et quand',
    intro: 'Indiquez vos infractions récentes : l’outil dit combien un stage vous rendrait aujourd’hui et quand le retour automatique l’aurait fait de toute façon.',
    resume: (h) => `Le stage de sensibilisation à la sécurité routière permet de récupérer jusqu’à ${h.num(Pm(h).stage_points)} points, dans la limite du maximum du permis, et une seule fois par an, selon l’article L223-6 du Code de la route et la fiche Service Public sur la récupération des points. Il est volontaire pour un permis de douze points, à une seule condition : que le permis ne soit pas invalidé, c’est-à-dire que le solde ne soit pas tombé à zéro. Il devient obligatoire pour un permis probatoire après un retrait d’au moins trois points : une lettre recommandée 48N impose alors de le suivre dans les quatre mois, sous peine d’une amende de ${h.eur(h.P.classes['4'].forfaitaire)} et d’une suspension du permis pouvant aller jusqu’à trois ans. Les stages sont organisés par des centres agréés par la préfecture ; leur prix est libre et n’est pas publié par l’administration, raison pour laquelle ce site n’en affiche aucun et ne vend aucune place. Avant de réserver, vérifiez avec l’outil que les points ne reviennent pas d’eux-mêmes dans quelques mois : à deux mois du retour automatique, le stage ne sert à rien.`,
    faqs: (h) => [
      { q: 'Un stage peut-il faire dépasser douze points ?', a: `Non. Le stage rend ${h.num(Pm(h).stage_points)} points au plus, dans la limite du maximum : un conducteur à dix points n’en récupère que deux. En permis probatoire, la limite est le capital du moment, pas douze : à six points, on ne peut pas dépasser six par le stage.` },
      { q: 'Peut-on faire un stage juste avant de perdre des points ?', a: 'C’est possible, et c’est souvent ce qui sauve un permis proche de zéro : un stage fait avant que le retrait ne soit enregistré ajoute des points tant que le solde est au-dessous du maximum. Le retrait suivant s’applique ensuite au solde augmenté. Il faut toutefois que le solde ne soit pas déjà nul.' },
      { q: 'Le stage obligatoire du permis probatoire rend-il des points ?', a: `Oui, comme le stage volontaire : jusqu’à ${h.num(Pm(h).stage_points)} points dans la limite du capital du moment, et le conducteur évite l’amende et la suspension prévues en cas de refus. Les majorations annuelles perdues, elles, ne reviennent pas, et le stage ne prolonge pas la période probatoire.` },
    ],
    body: (h) => `<h2>Faut-il faire un stage ? Trois questions</h2>
${h.table(['Question', 'Si oui', 'Si non'], [['Le solde est-il à zéro ?', 'stage impossible : permis invalidé', 'stage possible'], ['Un stage a-t-il été fait il y a moins d’un an ?', 'attendre la date anniversaire', 'stage possible'], ['Le retour automatique est-il proche ?', 'le stage n’apporte rien', `le stage rend jusqu’à ${h.num(Pm(h).stage_points)} points tout de suite`]], 'Décider à partir de la règle de l’article L223-6', ['l', 'l', 'l'])}
<!--mini:stage-->
<h2>Ce que le site ne fait pas</h2>
<p>Nous ne publions ni prix ni dates de stages, et ne recevons aucune commission de centres de stage. Les prix sont libres, varient selon les centres et les périodes, et l’administration n’en publie aucun relevé : un prix moyen affiché ailleurs n’a pas de source vérifiable. La liste des centres agréés est tenue par chaque préfecture.</p>
<h2>Le stage et le calcul des délais</h2>
<p>Le stage n’interrompt pas les délais de ${h.src('l223_6', 'l’article L223-6')} : si aucune nouvelle infraction n’est commise, le permis revient de toute façon au maximum deux ou trois ans après la dernière. Le stage avance seulement le retour de quatre points. Le calcul complet est sur la page ${h.a('recuperer-des-points', 'récupérer des points')}.</p>`,
  },
  en: {
    slug: 'points-recovery-course-france',
    nav: 'Points-recovery course',
    card: '4 points once a year: when a course helps, and when it is compulsory.',
    title: 'Points-recovery course in France: 4 points, when to go',
    description: 'French points-recovery course (stage): up to 4 points once a year, compulsory on a probationary licence after losing 3 points, impossible at zero. Checks.',
    h1: 'Points-recovery course: how many points, and when',
    intro: 'Enter your recent offences: the tool shows how many points a course would give back today and when the automatic return would have done it anyway.',
    resume: (h) => `The road-safety awareness course (stage de sensibilisation) restores up to ${h.num(Pm(h).stage_points)} points, within the licence maximum, and only once a year, under article L223-6 of the French Highway Code and the Service Public page on getting points back. It is voluntary for a twelve-point licence, on one condition: the licence must not be invalidated, meaning the balance has not fallen to zero. It becomes compulsory for a probationary licence after losing three points or more: a registered letter 48N then requires it within four months, or the driver faces a ${h.eur(h.P.classes['4'].forfaitaire)} fine and a licence suspension of up to three years. Courses are run by centres approved by the prefecture; their price is free and not published by the authorities, which is why this site shows none and sells no places. Before booking, check with the tool that the points will not come back on their own within a few months: two months before the automatic return, a course is pointless.`,
    faqs: (h) => [
      { q: 'Can a course take me above twelve points?', a: `No. The course restores at most ${h.num(Pm(h).stage_points)} points, up to the maximum: a driver on ten gets only two back. On a probationary licence, the cap is the current maximum, not twelve: at six points you cannot go above six through a course.` },
      { q: 'Can I take a course just before losing more points?', a: 'Yes, and it often saves a licence close to zero: a course taken before a deduction is recorded adds points while the balance is below the maximum. The next deduction then applies to the higher balance. The balance must not already be zero, though.' },
      { q: 'Does the compulsory probationary course restore points?', a: `Yes, like the voluntary one: up to ${h.num(Pm(h).stage_points)} points within the current maximum, and the driver avoids the fine and suspension for refusing. The lost yearly top-ups, however, do not come back, and the course does not extend the probationary period.` },
    ],
    body: (h) => `<h2>Should you take a course? Three questions</h2>
${h.table(['Question', 'If yes', 'If no'], [['Is the balance zero?', 'no course possible: licence invalidated', 'course possible'], ['Was a course taken less than a year ago?', 'wait for the anniversary', 'course possible'], ['Is the automatic return close?', 'the course adds nothing', `the course restores up to ${h.num(Pm(h).stage_points)} points at once`]], 'Deciding with the rule in article L223-6', ['l', 'l', 'l'])}
<!--mini:stage-->
<h2>What this site does not do</h2>
<p>We publish no course prices or dates and take no commission from course centres. Prices are free, vary by centre and season, and the authorities publish no survey of them: an average price shown elsewhere has no verifiable source. Each prefecture keeps the list of approved centres.</p>
<h2>The course and the recovery clock</h2>
<p>A course does not interrupt the periods in ${h.src('l223_6', 'article L223-6')}: with no new offence, the licence returns to the maximum two or three years after the last one anyway. The course only brings four points forward. The full calculation is on the ${h.a('recuperer-des-points', 'getting points back page')}.</p>`,
  },
});
