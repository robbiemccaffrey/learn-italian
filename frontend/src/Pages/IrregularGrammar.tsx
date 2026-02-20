import React, { useEffect, useMemo, useState } from "react";

// Single-file React app – Italian Verb Trainer for 50 common (mostly regular) verbs
// Added:
// - Translator panel for the active field (plain-English rendering)
// - Pronunciation buttons (Web Speech API)
// - ✅/❌ auto-check for regular patterns (-are/-ere/-ire and -ire -isc; basic spelling rules)
// - Hover on ❌ shows the expected regular answer(s)
//
// Notes:
// - This checker is rule-based for regulars only; irregulars/variants may show ❌ even if valid.
// - Participles with essere: agreement not enforced; base participle used.
// - Tailwind classes expected.
// ====== Styling helpers (Tailwind classes expected) ======
const labelCls = "text-sm font-medium text-slate-700";
const inputCls =
  "w-full rounded-xl border border-slate-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400";
const chip =
  "inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700";

// ====== The fields we’ll collect per verb ======
// Each field has: key, it (Italian prompt), en (English hint)
const FIELDS = [
  { key: "infinitive", it: "Infinito", en: "Infinitive" },
  { key: "type", it: "Coniugazione (tipo)", en: "Conjugation type (-are / -ere / -ire / -ire -isc)" },
  { key: "aux", it: "Ausiliare (passato prossimo)", en: "Usual auxiliary in passato prossimo (avere / essere / both)" },
  { key: "has_pp_avere", it: "Questo verbo usa 'avere' nel passato prossimo? (sì/no)", en: "Does this verb use 'avere' in the passato prossimo? (yes/no)" },
  { key: "has_pp_essere", it: "Questo verbo usa 'essere' nel passato prossimo? (sì/no)", en: "Does this verb use 'essere' in the passato prossimo? (yes/no)" },

  // Presente (simple)
  { key: "pres_io", it: "Presente – io", en: "Present (io)" },
  { key: "pres_tu", it: "Presente – tu", en: "Present (tu)" },
  { key: "pres_lui", it: "Presente – lui/lei", en: "Present (lui/lei)" },
  { key: "pres_noi", it: "Presente – noi", en: "Present (noi)" },
  { key: "pres_voi", it: "Presente – voi", en: "Present (voi)" },
  { key: "pres_loro", it: "Presente – loro", en: "Present (loro)" },

  // Imperativo (simple)
  { key: "impv_tu",  it: "Imperativo – tu",  en: "Imperative – (you)" },
  { key: "impv_noi", it: "Imperativo – noi", en: "Imperative – (let’s)" },
  { key: "impv_voi", it: "Imperativo – voi", en: "Imperative – (you pl.)" },

  // Passato prossimo – avere (present of avere + participio passato)
  { key: "pp_avere_io",   it: "Passato prossimo con avere – io",   en: "Passato prossimo with avere – io" },
  { key: "pp_avere_tu",   it: "Passato prossimo con avere – tu",   en: "Passato prossimo with avere – tu" },
  { key: "pp_avere_lui",  it: "Passato prossimo con avere – lui/lei", en: "Passato prossimo with avere – lui/lei" },
  { key: "pp_avere_noi",  it: "Passato prossimo con avere – noi",  en: "Passato prossimo with avere – noi" },
  { key: "pp_avere_voi",  it: "Passato prossimo con avere – voi",  en: "Passato prossimo with avere – voi" },
  { key: "pp_avere_loro", it: "Passato prossimo con avere – loro", en: "Passato prossimo with avere – loro" },

  // Passato prossimo – essere (present of essere + participio passato)
  { key: "pp_essere_io",   it: "Passato prossimo con essere – io",   en: "Passato prossimo with essere – io" },
  { key: "pp_essere_tu",   it: "Passato prossimo con essere – tu",   en: "Passato prossimo with essere – tu" },
  { key: "pp_essere_lui",  it: "Passato prossimo con essere – lui/lei", en: "Passato prossimo with essere – lui/lei" },
  { key: "pp_essere_noi",  it: "Passato prossimo con essere – noi",  en: "Passato prossimo with essere – noi" },
  { key: "pp_essere_voi",  it: "Passato prossimo con essere – voi",  en: "Passato prossimo with essere – voi" },
  { key: "pp_essere_loro", it: "Passato prossimo con essere – loro", en: "Passato prossimo with essere – loro" },

  // Imperfetto (simple)
  { key: "impf_io", it: "Imperfetto – io", en: "Imperfetto (io)" },
  { key: "impf_tu", it: "Imperfetto – tu", en: "Imperfetto (tu)" },
  { key: "impf_lui", it: "Imperfetto – lui/lei", en: "Imperfetto (lui/lei)" },
  { key: "impf_noi", it: "Imperfetto – noi", en: "Imperfetto (noi)" },
  { key: "impf_voi", it: "Imperfetto – voi", en: "Imperfetto (voi)" },
  { key: "impf_loro", it: "Imperfetto – loro", en: "Imperfetto (loro)" },

  // Futuro (simple)
  { key: "fut_io", it: "Futuro – io", en: "Future (io)" },
  { key: "fut_tu", it: "Futuro – tu", en: "Future (tu)" },
  { key: "fut_lui", it: "Futuro – lui/lei", en: "Future (lui/lei)" },
  { key: "fut_noi", it: "Futuro – noi", en: "Future (noi)" },
  { key: "fut_voi", it: "Futuro – voi", en: "Future (voi)" },
  { key: "fut_loro", it: "Futuro – loro", en: "Future (loro)" },

  // Progressive tenses – Imperfetto
  { key: "imp_prog_io", it: "Imperfetto progressivo – io (stavo + gerundio)", en: "Imperfect progressive – io (stavo + gerund)" },
  { key: "imp_prog_tu", it: "Imperfetto progressivo – tu", en: "Imperfect progressive – tu" },
  { key: "imp_prog_lui", it: "Imperfetto progressivo – lui/lei", en: "Imperfect progressive – he/she" },
  { key: "imp_prog_noi", it: "Imperfetto progressivo – noi", en: "Imperfect progressive – we" },
  { key: "imp_prog_voi", it: "Imperfetto progressivo – voi", en: "Imperfect progressive – you (pl)" },
  { key: "imp_prog_loro", it: "Imperfetto progressivo – loro", en: "Imperfect progressive – they" },

  // Reflexive toggle & pronouns
  { key: "is_refl", it: "È riflessivo? (sì/no)", en: "Is reflexive? (yes/no)" },
  { key: "refl_pron", it: "Pronomi riflessivi", en: "Reflexive pronouns (mi/ti/si/ci/vi/si)" },

  // Presente progressivo
  { key: "pres_prog_io", it: "Presente progressivo – io (sto + gerundio)", en: "Present progressive – I am ...ing" },
  { key: "pres_prog_tu", it: "Presente progressivo – tu", en: "Present progressive – you are ...ing" },
  { key: "pres_prog_lui", it: "Presente progressivo – lui/lei", en: "Present progressive – he/she is ...ing" },
  { key: "pres_prog_noi", it: "Presente progressivo – noi", en: "Present progressive – we are ...ing" },
  { key: "pres_prog_voi", it: "Presente progressivo – voi", en: "Present progressive – you (pl) are ...ing" },
  { key: "pres_prog_loro", it: "Presente progressivo – loro", en: "Present progressive – they are ...ing" },

  // Futuro progressivo
  { key: "fut_prog_io", it: "Futuro progressivo – io (starò + gerundio)", en: "Future progressive – I will be ...ing" },
  { key: "fut_prog_tu", it: "Futuro progressivo – tu", en: "Future progressive – you will be ...ing" },
  { key: "fut_prog_lui", it: "Futuro progressivo – lui/lei", en: "Future progressive – he/she will be ...ing" },
  { key: "fut_prog_noi", it: "Futuro progressivo – noi", en: "Future progressive – we will be ...ing" },
  { key: "fut_prog_voi", it: "Futuro progressivo – voi", en: "Future progressive – you (pl) will be ...ing" },
  { key: "fut_prog_loro", it: "Futuro progressivo – loro", en: "Future progressive – they will be ...ing" },

  // Reflexive progressive examples & notes
  { key: "imp_prog_refl", it: "Imperfetto progressivo riflessivo (es. mi stavo + gerundio)", en: "Imperfect progressive – reflexive pattern" },
  { key: "fut_prog_refl", it: "Futuro progressivo riflessivo (es. mi starò + gerundio)", en: "Future progressive – reflexive pattern" },
  { key: "refl_pres_io", it: "Riflessivo – Presente (io)", en: "Reflexive – Present (io)" },
  { key: "refl_fut_io", it: "Riflessivo – Futuro (io)", en: "Reflexive – Future (io)" },
  { key: "refl_pp_notes", it: "Riflessivo – Participio passato (accordo)", en: "Reflexive – Past participle agreement notes" },
];

// Group fields into sections for nicer UI
const SECTIONS = [
  { title: "Dati base", desc: "Core verb info: the infinitive, its conjugation group (-are/-ere/-ire/-ire -isc), and the usual auxiliary for the passato prossimo.", keys: ["infinitive", "type", "aux", "has_pp_avere", "has_pp_essere"] },
  {
    title: "Presente (semplice)",
    desc: "Simple present tense – actions happening now, habits, or general truths.",
    keys: ["pres_io", "pres_tu", "pres_lui", "pres_noi", "pres_voi", "pres_loro"],
  },
  {
    title: "Imperativo (semplice)",
    desc: "Commands: tu / noi / voi. For -are, tu uses the 3rd-singular form (parla!); otherwise tu uses the 2nd-singular (prendi!, dormi!).",
    keys: ["impv_tu", "impv_noi", "impv_voi"],
  },
  { title: "Participi", desc: "Full passato prossimo forms: present of the auxiliary (avere/essere) + past participle. Agreement with essere not enforced.", keys: [
    "pp_avere_io","pp_avere_tu","pp_avere_lui","pp_avere_noi","pp_avere_voi","pp_avere_loro",
    "pp_essere_io","pp_essere_tu","pp_essere_lui","pp_essere_noi","pp_essere_voi","pp_essere_loro",
  ] },
  {
    title: "Imperfetto (semplice)",
    desc: "Imperfect tense – ongoing, repeated, or background actions in the past (‘used to’, ‘was/were …ing’).",
    keys: ["impf_io", "impf_tu", "impf_lui", "impf_noi", "impf_voi", "impf_loro"],
  },
  {
    title: "Futuro (semplice)",
    desc: "Simple future – predictions, intentions, or assumptions about the present (polite/attenuated).",
    keys: ["fut_io", "fut_tu", "fut_lui", "fut_noi", "fut_voi", "fut_loro"],
  },
  {
    title: "Imperfetto progressivo (stare all’imperfetto + gerundio)",
    desc: "Past progressive – ‘was/were …ing’: stare in the imperfect (stavo, stavi, …) + gerund.",
    keys: [
      "imp_prog_io",
      "imp_prog_tu",
      "imp_prog_lui",
      "imp_prog_noi",
      "imp_prog_voi",
      "imp_prog_loro",
    ],
  },
  { title: "Verbo riflessivo?", desc: "Whether the verb is reflexive and, if so, the pronouns used (mi/ti/si/ci/vi/si).", keys: ["is_refl", "refl_pron"] },
  {
    title: "Presente progressivo (stare al presente + gerundio)",
    desc: "Present progressive – ‘am/is/are …ing’: stare in the present (sto, stai, …) + gerund.",
    keys: [
      "pres_prog_io",
      "pres_prog_tu",
      "pres_prog_lui",
      "pres_prog_noi",
      "pres_prog_voi",
      "pres_prog_loro",
    ],
  },
  {
    title: "Futuro progressivo (stare al futuro + gerundio)",
    desc: "Future progressive – ‘will be …ing’: stare in the future (starò, starai, …) + gerund.",
    keys: [
      "fut_prog_io",
      "fut_prog_tu",
      "fut_prog_lui",
      "fut_prog_noi",
      "fut_prog_voi",
      "fut_prog_loro",
    ],
  },
  {
    title: "Forme riflessive – esempi & note",
    desc: "Examples and notes for reflexive usage and participle agreement with essere.",
    keys: ["imp_prog_refl", "fut_prog_refl", "refl_pres_io", "refl_fut_io", "refl_pp_notes"],
  },
];

// ====== Verb list (50 top irregular verbs) ======
const VERBS = [
  { infinitive: "essere",    type: "irreg", aux: "essere" },
  { infinitive: "avere",     type: "irreg", aux: "avere"  },
  { infinitive: "fare",      type: "irreg", aux: "avere"  },
  { infinitive: "andare",    type: "irreg", aux: "essere" },
  { infinitive: "venire",    type: "irreg", aux: "essere" },
  { infinitive: "uscire",    type: "irreg", aux: "essere" },
  { infinitive: "stare",     type: "irreg", aux: "essere" },
  { infinitive: "dire",      type: "irreg", aux: "avere"  },
  { infinitive: "dare",      type: "irreg", aux: "avere"  },
  { infinitive: "sapere",    type: "irreg", aux: "avere"  },
  { infinitive: "potere",    type: "irreg", aux: "avere"  },
  { infinitive: "volere",    type: "irreg", aux: "avere"  },
  { infinitive: "dovere",    type: "irreg", aux: "avere"  },
  { infinitive: "bere",      type: "irreg", aux: "avere"  },
  { infinitive: "tenere",    type: "irreg", aux: "avere"  },
  { infinitive: "rimanere",  type: "irreg", aux: "essere" },
  { infinitive: "salire",    type: "irreg", aux: "essere" },
  { infinitive: "scendere",  type: "irreg", aux: "essere" },
  { infinitive: "cadere",    type: "irreg", aux: "essere" },
  { infinitive: "morire",    type: "irreg", aux: "essere" },
  { infinitive: "nascere",   type: "irreg", aux: "essere" },
  { infinitive: "vivere",    type: "irreg", aux: "both"   },
  { infinitive: "mettere",   type: "irreg", aux: "avere"  },
  { infinitive: "scrivere",  type: "irreg", aux: "avere"  },
  { infinitive: "leggere",   type: "irreg", aux: "avere"  },
  { infinitive: "chiedere",  type: "irreg", aux: "avere"  },
  { infinitive: "rispondere",type: "irreg", aux: "avere"  },
  { infinitive: "perdere",   type: "irreg", aux: "avere"  },
  { infinitive: "chiudere",  type: "irreg", aux: "avere"  },
  { infinitive: "aprire",    type: "irreg", aux: "avere"  },
  { infinitive: "correre",   type: "irreg", aux: "both"   },
  { infinitive: "rompere",   type: "irreg", aux: "avere"  },
  { infinitive: "prendere",  type: "irreg", aux: "avere"  },
  { infinitive: "vincere",   type: "irreg", aux: "avere"  },
  { infinitive: "convincere",type: "irreg", aux: "avere"  },
  { infinitive: "scegliere", type: "irreg", aux: "avere"  },
  { infinitive: "cogliere",  type: "irreg", aux: "avere"  },
  { infinitive: "togliere",  type: "irreg", aux: "avere"  },
  { infinitive: "porre",     type: "irreg", aux: "avere"  },
  { infinitive: "trarre",    type: "irreg", aux: "avere"  },
  { infinitive: "tradurre",  type: "irreg", aux: "avere"  },
  { infinitive: "produrre",  type: "irreg", aux: "avere"  },
  { infinitive: "condurre",  type: "irreg", aux: "avere"  },
  { infinitive: "spegnere",  type: "irreg", aux: "avere"  },
  { infinitive: "accendere", type: "irreg", aux: "avere"  },
  { infinitive: "ridere",    type: "irreg", aux: "avere"  },
  { infinitive: "piangere",  type: "irreg", aux: "avere"  },
  { infinitive: "piacere",   type: "irreg", aux: "essere" },
  { infinitive: "vedere",    type: "irreg", aux: "avere"  },
  { infinitive: "permettere",type: "irreg", aux: "avere"  },
];

// ====== English glosses for translator ======
const EN_GLOSS = {
  essere: "be", avere: "have", fare: "do/make", andare: "go",
  venire: "come", uscire: "go out", stare: "stay/be", dire: "say/tell",
  dare: "give", sapere: "know (a fact)", potere: "can/be able",
  volere: "want", dovere: "must/have to", bere: "drink",
  tenere: "hold/keep", rimanere: "remain/stay", salire: "go up/climb",
  scendere: "go down/descend", cadere: "fall", morire: "die",
  nascere: "be born", vivere: "live", mettere: "put",
  scrivere: "write", leggere: "read", chiedere: "ask",
  rispondere: "answer", perdere: "lose", chiudere: "close",
  aprire: "open", correre: "run", rompere: "break",
  prendere: "take", vincere: "win", convincere: "convince",
  scegliere: "choose", cogliere: "pick/gather", togliere: "remove/take off",
  porre: "put/place", trarre: "draw/bring", tradurre: "translate",
  produrre: "produce", condurre: "lead/drive", spegnere: "switch off",
  accendere: "switch on", ridere: "laugh", piangere: "cry",
  piacere: "please/like", vedere: "see", permettere: "allow/permit",
};

// ====== Irregular forms database (used to override the regular model) ======
// For each verb you can provide: pres[6], impv{tu,noi,voi}, pp, gerund, impf[6] (optional), fut[6] (optional).
const IRREG: Record<string, any> = {
  essere: {
    pres: ["sono","sei","è","siamo","siete","sono"],
    impv: { tu: "sii", noi: "siamo", voi: "siate" },
    pp: "stato", gerund: "essendo",
    impf: ["ero","eri","era","eravamo","eravate","erano"],
    fut: ["sarò","sarai","sarà","saremo","sarete","saranno"],
  },
  avere: {
    pres: ["ho","hai","ha","abbiamo","avete","hanno"],
    impv: { tu: "abbi", noi: "abbiamo", voi: "abbiate" },
    pp: "avuto", gerund: "avendo",
    impf: ["avevo","avevi","aveva","avevamo","avevate","avevano"],
    fut: ["avrò","avrai","avrà","avremo","avrete","avranno"],
  },
  fare: {
    pres: ["faccio","fai","fa","facciamo","fate","fanno"],
    impv: { tu: "fa'", noi: "facciamo", voi: "fate" },
    pp: "fatto", gerund: "facendo",
    impf: ["facevo","facevi","faceva","facevamo","facevate","facevano"],
    fut: ["farò","farai","farà","faremo","farete","faranno"],
  },
  andare: {
    pres: ["vado","vai","va","andiamo","andate","vanno"],
    impv: { tu: "va'", noi: "andiamo", voi: "andate" },
    pp: "andato", gerund: "andando",
    impf: ["andavo","andavi","andava","andavamo","andavate","andavano"],
    fut: ["andrò","andrai","andrà","andremo","andrete","andranno"],
  },
  venire: {
    pres: ["vengo","vieni","viene","veniamo","venite","vengono"],
    impv: { tu: "vieni", noi: "veniamo", voi: "venite" },
    pp: "venuto", gerund: "venendo",
    impf: ["venivo","venivi","veniva","venivamo","venivate","venivano"],
    fut: ["verrò","verrai","verrà","verremo","verrete","verranno"],
  },
  uscire: {
    pres: ["esco","esci","esce","usciamo","uscite","escono"],
    impv: { tu: "esci", noi: "usciamo", voi: "uscite" },
    pp: "uscito", gerund: "uscendo",
    impf: ["uscivo","uscivi","usciva","uscivamo","uscivate","uscivano"],
  },
  stare: {
    pres: ["sto","stai","sta","stiamo","state","stanno"],
    impv: { tu: "sta'", noi: "stiamo", voi: "state" },
    pp: "stato", gerund: "stando",
    impf: ["stavo","stavi","stava","stavamo","stavate","stavano"],
    fut: ["starò","starai","starà","staremo","starete","staranno"],
  },
  dire: {
    pres: ["dico","dici","dice","diciamo","dite","dicono"],
    impv: { tu: "di'", noi: "diciamo", voi: "dite" },
    pp: "detto", gerund: "dicendo",
    impf: ["dicevo","dicevi","diceva","dicevamo","dicevate","dicevano"],
  },
  dare: {
    pres: ["do","dai","dà","diamo","date","danno"],
    impv: { tu: "da'", noi: "diamo", voi: "date" },
    pp: "dato", gerund: "dando",
    impf: ["davo","davi","dava","davamo","davate","davano"],
    fut: ["darò","darai","darà","daremo","darete","daranno"],
  },
  sapere: {
    pres: ["so","sai","sa","sappiamo","sapete","sanno"],
    impv: { tu: "sappi", noi: "sappiamo", voi: "sappiate" },
    pp: "saputo", gerund: "sapendo",
    impf: ["sapevo","sapevi","sapeva","sapevamo","sapevate","sapevano"],
    fut: ["saprò","saprai","saprà","sapremo","saprete","sapranno"],
  },
  potere: {
    pres: ["posso","puoi","può","possiamo","potete","possono"],
    impv: { tu: "—", noi: "—", voi: "—" },
    pp: "potuto", gerund: "potendo",
    impf: ["potevo","potevi","poteva","potevamo","potevate","potevano"],
    fut: ["potrò","potrai","potrà","potremo","potrete","potranno"],
  },
  volere: {
    pres: ["voglio","vuoi","vuole","vogliamo","volete","vogliono"],
    impv: { tu: "—", noi: "—", voi: "—" },
    pp: "voluto", gerund: "volendo",
    impf: ["volevo","volevi","voleva","volevamo","volevate","volevano"],
    fut: ["vorrò","vorrai","vorrà","vorremo","vorrete","vorranno"],
  },
  dovere: {
    pres: ["devo","devi","deve","dobbiamo","dovete","devono"],
    impv: { tu: "—", noi: "—", voi: "—" },
    pp: "dovuto", gerund: "dovendo",
    impf: ["dovevo","dovevi","doveva","dovevamo","dovevate","dovevano"],
    fut: ["dovrò","dovrai","dovrà","dovremo","dovrete","dovranno"],
  },
  bere: {
    pres: ["bevo","bevi","beve","beviamo","bevete","bevono"],
    impv: { tu: "bevi", noi: "beviamo", voi: "bevete" },
    pp: "bevuto", gerund: "bevendo",
    impf: ["bevevo","bevevi","beveva","bevevamo","bevevate","bevevano"],
    fut: ["berrò","berrai","berrà","berremo","berrete","berranno"],
  },
  tenere: {
    pres: ["tengo","tieni","tiene","teniamo","tenete","tengono"],
    impv: { tu: "tieni", noi: "teniamo", voi: "tenete" },
    pp: "tenuto", gerund: "tenendo",
    impf: ["tenevo","tenevi","teneva","tenevamo","tenevate","tenevano"],
    fut: ["terrò","terrai","terrà","terremo","terrete","terranno"],
  },
  rimanere: {
    pres: ["rimango","rimani","rimane","rimaniamo","rimanete","rimangono"],
    impv: { tu: "rimani", noi: "rimaniamo", voi: "rimanete" },
    pp: "rimasto", gerund: "rimanendo",
    impf: ["rimanevo","rimanevi","rimaneva","rimanevamo","rimanevate","rimanevano"],
    fut: ["rimarrò","rimarrai","rimarrà","rimarremo","rimarrete","rimarranno"],
  },
  salire: { pres: ["salgo","sali","sale","saliamo","salite","salgono"], impv: { tu: "sali", noi: "saliamo", voi: "salite" }, pp: "salito", gerund: "salendo" },
  scendere: { pp: "sceso", gerund: "scendendo" },
  cadere: { pp: "caduto", gerund: "cadendo", fut: ["cadrò","cadrai","cadrà","cadremo","cadrete","cadranno"] },
  morire: { pp: "morto", gerund: "morendo" },
  nascere: { pp: "nato", gerund: "nascendo" },
  vivere: { pp: "vissuto", gerund: "vivendo" },
  mettere: { pp: "messo", gerund: "mettendo" },
  scrivere: { pp: "scritto", gerund: "scrivendo" },
  leggere: { pp: "letto", gerund: "leggendo" },
  chiedere: { pp: "chiesto", gerund: "chiedendo" },
  rispondere: { pp: "risposto", gerund: "rispondendo" },
  perdere: { pp: "perso", gerund: "perdendo" },
  chiudere: { pp: "chiuso", gerund: "chiudendo" },
  aprire: { pp: "aperto", gerund: "aprendo" },
  correre: { pp: "corso", gerund: "correndo" },
  rompere: { pp: "rotto", gerund: "rompendo" },
  prendere: { pp: "preso", gerund: "prendendo" },
  vincere: { pp: "vinto", gerund: "vincendo" },
  convincere: { pp: "convinto", gerund: "convincendo" },
  scegliere: { pp: "scelto", gerund: "scegliendo", pres: ["scelgo","scegli","sceglie","scegliamo","scegliete","scelgono"] },
  cogliere: { pp: "colto", gerund: "cogliendo" },
  togliere: { pp: "tolto", gerund: "togliendo" },
  porre: { pp: "posto", gerund: "ponendo", pres: ["pongo","poni","pone","poniamo","ponete","pongono"] },
  trarre: { pp: "tratto", gerund: "traendo", pres: ["traggo","trai","trae","traiamo","traete","traggono"] },
  tradurre: { pp: "tradotto", gerund: "traducendo", pres: ["traduco","traduci","traduce","traduciamo","traducete","traducono"] },
  produrre: { pp: "prodotto", gerund: "producendo", pres: ["produco","produci","produce","produciamo","producete","producono"] },
  condurre: { pp: "condotto", gerund: "conducendo", pres: ["conduco","conduci","conduce","conduciamo","conducete","conducono"] },
  spegnere: { pp: "spento", gerund: "spegnendo" },
  accendere: { pp: "acceso", gerund: "accendendo" },
  ridere: { pp: "riso", gerund: "ridendo" },
  piangere: { pp: "pianto", gerund: "piangendo" },
  piacere: { pp: "piaciuto", gerund: "piacendo", pres: ["piaccio","piaci","piace","piacciamo","piacete","piacciono"] },
  vedere: { pp: "visto", gerund: "vedendo", fut: ["vedrò","vedrai","vedrà","vedremo","vedrete","vedranno"] },
  permettere: { pp: "permesso", gerund: "permettendo" },
};

// ====== Utilities ======
const fieldMeta = Object.fromEntries(FIELDS.map((f) => [f.key, f]));
const STORAGE_KEY = "it-verb-trainer-answers-v1";

function useLocalStore() {
  const [store, setStore] = useState({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStore(JSON.parse(raw));
    } catch (e) {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {}
  }, [store]);
  return [store, setStore];
}

function Section({ title, desc, children }) {
  return (
    <div className="space-y-3">
      <div className="relative inline-block group">
        <h3
          className="text-base font-semibold text-slate-800 cursor-help"
          aria-describedby={desc ? `tip-${title}` : undefined}
        >
          {title}
        </h3>
        {desc && (
          <div
            id={`tip-${title}`}
            role="tooltip"
            className="pointer-events-none absolute left-0 top-full z-10 mt-1 max-w-xs rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {desc}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{children}</div>
    </div>
  );
}

// ====== Conjugation engine (regular patterns + basic orthography) ======
function endsWithAny(str, arr) { return arr.some((s) => str.endsWith(s)); }
const persons = ["io","tu","lui/lei","noi","voi","loro"];

function getType(verbType, infOpt?: string) {
  if ((verbType || "").includes("-isc")) return "-ire-isc";
  if ((verbType || "").includes("-ire")) return "-ire";
  if ((verbType || "").includes("-ere")) return "-ere";
  if (verbType === "irreg" && typeof infOpt === "string") {
    if (infOpt.endsWith("are")) return "-are";
    if (infOpt.endsWith("ere")) return "-ere";
    if (infOpt.endsWith("ire")) return "-ire";
  }
  return "-are";
}
function stem(inf) { return inf.slice(0, -3); }
function isCiGiAGroup(inf) { return endsWithAny(inf, ["ciare","giare"]); }
function isCareGare(inf) { return endsWithAny(inf, ["care","gare"]); }

function presentConj(inf, type) {
  const s = stem(inf);
  const base = {
    "-are": ["o","i","a","iamo","ate","ano"],
    "-ere": ["o","i","e","iamo","ete","ono"],
    "-ire": ["o","i","e","iamo","ite","ono"],
    "-ire-isc": ["isco","isci","isce","iamo","ite","iscono"],
  };
  const endings = base[type] || base["-are"];
  return persons.map((_, idx) => {
    let st = s;
    if (isCareGare(inf) && (idx === 1 || idx === 3)) st = s + "h";            // tu/noi hard sound
    if (isCiGiAGroup(inf) && (idx === 1 || idx === 3) && st.endsWith("i")) st = st.slice(0, -1); // drop i
    if (type === "-ire-isc" && (idx === 0 || idx === 1 || idx === 2 || idx === 5)) {
      return st + endings[idx];
    }
    return st + endings[idx];
  });
}
function imperfetto(inf) {
  const base = ["vo","vi","va","vamo","vate","vano"];
  // Imperfetto stem = infinitive minus -re (parla-RE -> parla-)
  const radicale = inf.slice(0, -2);
  return base.map((end) => radicale + end);
}
function futuro(inf, type) {
  const baseEnds = ["ò","ai","à","emo","ete","anno"];
  let theme = inf.slice(0, -3);
  let futBase;
  if (type === "-are") {
    // parlare -> parler- ; aiutare -> aiuter-
    futBase = theme + "er";
  } else {
    futBase = theme + "r";
  }
  if (isCareGare(inf)) futBase = theme + "her";      // pagher-
  if (isCiGiAGroup(inf)) {
    if (theme.endsWith("i")) theme = theme.slice(0, -1); // mang- / cominc-
    futBase = theme + "er";
  }
  return baseEnds.map((e) => futBase + e);
}
function participioPassato(inf, type) {
  if (type === "-are") return inf.slice(0, -3) + "ato";
  if (type === "-ere") return inf.slice(0, -3) + "uto";
  return inf.slice(0, -3) + "ito";
}
function gerundio(inf, type) {
  if (type === "-are") return inf.slice(0, -3) + "ando";
  return inf.slice(0, -3) + "endo";
}

const STARE_PRES = ["sto","stai","sta","stiamo","state","stanno"];
const STARE_IMPF = ["stavo","stavi","stava","stavamo","stavate","stavano"];
const STARE_FUT  = ["starò","starai","starà","staremo","starete","staranno"];

const AVERE_PRES  = ["ho","hai","ha","abbiamo","avete","hanno"];
const ESSERE_PRES = ["sono","sei","è","siamo","siete","sono"];

// Expected answers (normalized) for auto-check
function expectedForField(verbObj, key) {
  if (!verbObj) return [];
  const inf = verbObj.infinitive;
  const type = getType(verbObj.type, inf);
  const irr = IRREG[inf];
  switch (key) {
    case "infinitive": return [inf];
    case "type": return [verbObj.type];
    case "aux": return [verbObj.aux];
    // presente
    case "pres_io":
    case "pres_tu":
    case "pres_lui":
    case "pres_noi":
    case "pres_voi":
    case "pres_loro": {
      const idx = { pres_io:0, pres_tu:1, pres_lui:2, pres_noi:3, pres_voi:4, pres_loro:5 }[key];
      if (irr?.pres) return [irr.pres[idx]];
      const forms = presentConj(inf, type);
      return [forms[idx]];
    }
    // imperativo (simple)
    case "impv_tu": {
      if (irr?.impv) { const form = irr.impv["tu"]; if (form && form !== "—") return [form]; }
      const forms = presentConj(inf, type);
      const form = (type === "-are") ? forms[2] : forms[1];
      return [form];
    }
    case "impv_noi": {
      if (irr?.impv) { const form = irr.impv["noi"]; if (form && form !== "—") return [form]; }
      const forms = presentConj(inf, type);
      return [forms[3]];
    }
    case "impv_voi": {
      if (irr?.impv) { const form = irr.impv["voi"]; if (form && form !== "—") return [form]; }
      const forms = presentConj(inf, type);
      return [forms[4]];
    }
    // passato prossimo (aux + participio)
    case "pp_avere_io":
    case "pp_avere_tu":
    case "pp_avere_lui":
    case "pp_avere_noi":
    case "pp_avere_voi":
    case "pp_avere_loro": {
      const idx = { pp_avere_io:0, pp_avere_tu:1, pp_avere_lui:2, pp_avere_noi:3, pp_avere_voi:4, pp_avere_loro:5 }[key];
      const part = irr?.pp ? irr.pp : participioPassato(inf, type);
      return [AVERE_PRES[idx] + " " + part];
    }
    case "pp_essere_io":
    case "pp_essere_tu":
    case "pp_essere_lui":
    case "pp_essere_noi":
    case "pp_essere_voi":
    case "pp_essere_loro": {
      const idx = { pp_essere_io:0, pp_essere_tu:1, pp_essere_lui:2, pp_essere_noi:3, pp_essere_voi:4, pp_essere_loro:5 }[key];
      const part = irr?.pp ? irr.pp : participioPassato(inf, type);
      return [ESSERE_PRES[idx] + " " + part];
    }
    // imperfetto
    case "impf_io":
    case "impf_tu":
    case "impf_lui":
    case "impf_noi":
    case "impf_voi":
    case "impf_loro": {
      const idx = { impf_io:0, impf_tu:1, impf_lui:2, impf_noi:3, impf_voi:4, impf_loro:5 }[key];
      if (irr?.impf) return [irr.impf[idx]];
      const forms = imperfetto(inf);
      return [forms[idx]];
    }
    // futuro
    case "fut_io":
    case "fut_tu":
    case "fut_lui":
    case "fut_noi":
    case "fut_voi":
    case "fut_loro": {
      const idx = { fut_io:0, fut_tu:1, fut_lui:2, fut_noi:3, fut_voi:4, fut_loro:5 }[key];
      if (irr?.fut) return [irr.fut[idx]];
      const forms = futuro(inf, type);
      return [forms[idx]];
    }
    // progressivi
    case "pres_prog_io":
    case "pres_prog_tu":
    case "pres_prog_lui":
    case "pres_prog_noi":
    case "pres_prog_voi":
    case "pres_prog_loro": {
      const idx = { pres_prog_io:0,pres_prog_tu:1,pres_prog_lui:2,pres_prog_noi:3,pres_prog_voi:4,pres_prog_loro:5 }[key];
      const g = irr?.gerund ? irr.gerund : gerundio(inf, type);
      return [STARE_PRES[idx] + " " + g];
    }
    case "imp_prog_io":
    case "imp_prog_tu":
    case "imp_prog_lui":
    case "imp_prog_noi":
    case "imp_prog_voi":
    case "imp_prog_loro": {
      const idx = { imp_prog_io:0,imp_prog_tu:1,imp_prog_lui:2,imp_prog_noi:3,imp_prog_voi:4,imp_prog_loro:5 }[key];
      const g = irr?.gerund ? irr.gerund : gerundio(inf, type);
      return [STARE_IMPF[idx] + " " + g];
    }
    case "fut_prog_io":
    case "fut_prog_tu":
    case "fut_prog_lui":
    case "fut_prog_noi":
    case "fut_prog_voi":
    case "fut_prog_loro": {
      const idx = { fut_prog_io:0,fut_prog_tu:1,fut_prog_lui:2,fut_prog_noi:3,fut_prog_voi:4,fut_prog_loro:5 }[key];
      const g = irr?.gerund ? irr.gerund : gerundio(inf, type);
      return [STARE_FUT[idx] + " " + g];
    }
    // riflessivi & note fields – no grading
    case "is_refl":
    case "refl_pron":
    case "imp_prog_refl":
    case "fut_prog_refl":
    case "refl_pres_io":
    case "refl_fut_io":
    case "refl_pp_notes":
      return [];
    case "has_pp_avere": {
      // Correct if the verb can form passato prossimo with avere (aux === 'avere' or 'both')
      const exp = (verbObj.aux === "avere" || verbObj.aux === "both") ? "sì" : "no";
      return [exp];
    }
    case "has_pp_essere": {
      // Correct if the verb can form passato prossimo with essere (aux === 'essere' or 'both')
      const exp = (verbObj.aux === "essere" || verbObj.aux === "both") ? "sì" : "no";
      return [exp];
    }
    default:
      return [];
  }
}

// PRETTY (unnormalized) expected list for tooltips
function expectedForFieldRaw(verbObj, key) {
  return expectedForField(verbObj, key); // same strings are fine here
}

function normalize(s) {
  return (s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");
}

function ynToBool(v) {
  const t = normalize(v);
  if (!t) return false;
  return t === "si" || t === "s" || t.startsWith("si ") || t === "y" || t === "yes" || t === "true" || t === "1";
}

// ====== Translator (plain-English rendering for the active field) ======
function ingForm(base) {
  const parts = base.split(" ");
  const main = parts[0];
  let root = main;
  if (root.endsWith("e") && root !== "be" && !root.endsWith("ee")) root = root.slice(0, -1);
  let ger = root + "ing";
  if (main.endsWith("ie")) ger = main.slice(0, -2) + "ying";
  return [ger, ...parts.slice(1)].join(" ");
}

function pastParticiple(base) {
  // crude but good-enough for A1–A2 regulars
  const parts = base.split(" ");
  const main = parts[0];
  let root = main;
  if (main === "be") return "been";
  if (main === "have") return "had";
  if (main === "go") return "gone";
  if (main.endsWith("e")) return [main + "d", ...parts.slice(1)].join(" ");
  if (/[^aeiou]y$/.test(main)) return [main.slice(0, -1) + "ied", ...parts.slice(1)].join(" ");
  return [main + "ed", ...parts.slice(1)].join(" ");
}
function englishForField(verbObj, key) {
  const base = EN_GLOSS[verbObj.infinitive] || verbObj.infinitive;
  const youPL = "you (pl)";
  const ppEn = pastParticiple(base);
  const en = {
    pres_io: `I ${base}`, pres_tu: `you ${base}`,
    pres_lui: `he/she ${base}${base.startsWith("be ")? "" : (base.endsWith("s")? "" : "s")}`,
    pres_noi: `we ${base}`, pres_voi: `${youPL} ${base}`, pres_loro: `they ${base}`,

    // imperativo (simple)
    impv_tu: `(you) ${base}!`,
    impv_noi: `let’s ${base}`,
    impv_voi: `(you pl.) ${base}!`,

    impf_io: `I was ${ingForm(base)} / I used to ${base}`,
    impf_tu: `you were ${ingForm(base)} / you used to ${base}`,
    impf_lui: `he/she was ${ingForm(base)} / used to ${base}`,
    impf_noi: `we were ${ingForm(base)} / used to ${base}`,
    impf_voi: `${youPL} were ${ingForm(base)} / used to ${base}`,
    impf_loro: `they were ${ingForm(base)} / used to ${base}`,

    fut_io: `I will ${base}`, fut_tu: `you will ${base}`,
    fut_lui: `he/she will ${base}`, fut_noi: `we will ${base}`,
    fut_voi: `${youPL} will ${base}`, fut_loro: `they will ${base}`,

    pres_prog_io: `I am ${ingForm(base)}`, pres_prog_tu: `you are ${ingForm(base)}`,
    pres_prog_lui: `he/she is ${ingForm(base)}`, pres_prog_noi: `we are ${ingForm(base)}`,
    pres_prog_voi: `${youPL} are ${ingForm(base)}`, pres_prog_loro: `they are ${ingForm(base)}`,

    imp_prog_io: `I was ${ingForm(base)}`, imp_prog_tu: `you were ${ingForm(base)}`,
    imp_prog_lui: `he/she was ${ingForm(base)}`, imp_prog_noi: `we were ${ingForm(base)}`,
    imp_prog_voi: `${youPL} were ${ingForm(base)}`, imp_prog_loro: `they were ${ingForm(base)}`,

    fut_prog_io: `I will be ${ingForm(base)}`, fut_prog_tu: `you will be ${ingForm(base)}`,
    fut_prog_lui: `he/she will be ${ingForm(base)}`, fut_prog_noi: `we will be ${ingForm(base)}`,
    fut_prog_voi: `${youPL} will be ${ingForm(base)}`, fut_prog_loro: `they will be ${ingForm(base)}`,

    pp_avere_io: `I have ${ppEn}`,
    pp_avere_tu: `you have ${ppEn}`,
    pp_avere_lui: `he/she has ${ppEn}`,
    pp_avere_noi: `we have ${ppEn}`,
    pp_avere_voi: `${youPL} have ${ppEn}`,
    pp_avere_loro: `they have ${ppEn}`,

    // In English we still use "have" as the auxiliary even when Italian uses essere
    pp_essere_io: `I have ${ppEn}`,
    pp_essere_tu: `you have ${ppEn}`,
    pp_essere_lui: `he/she has ${ppEn}`,
    pp_essere_noi: `we have ${ppEn}`,
    pp_essere_voi: `${youPL} have ${ppEn}`,
    pp_essere_loro: `they have ${ppEn}`,
  };
  return en[key] || null;
}

export default function App() {
  const [store, setStore] = useLocalStore();
  const [query, setQuery] = useState("");
  const [activeVerb, setActiveVerb] = useState(VERBS[0].infinitive);
  const [activeFieldKey, setActiveFieldKey] = useState("infinitive");
  const [listeningKey, setListeningKey] = useState<string | null>(null);
  const [heardKey, setHeardKey] = useState<string | null>(null);
  const recRef = React.useRef<any>(null);
  // Per-section quiz state: { [sectionTitle]: { key: string; input: string } }
  const [quizBySection, setQuizBySection] = useState<Record<string, { key: string; input: string }>>({});
  useEffect(() => { setQuizBySection({}); }, [activeVerb]);

  const filtered = useMemo(() => {
    if (!query.trim()) return VERBS;
    const q = query.toLowerCase();
    return VERBS.filter((v) =>
      [v.infinitive, v.type, v.aux].some((x) => (x || "").toLowerCase().includes(q))
    );
  }, [query]);

  const currentVerb = useMemo(
    () => VERBS.find((v) => v.infinitive === activeVerb) || VERBS[0],
    [activeVerb]
  );

  const answers = store[activeVerb] || {};

  // Compute which participi blocks to show
  const hasAverePP = (answers.has_pp_avere != null)
    ? ynToBool(answers.has_pp_avere)
    : (currentVerb.aux === "avere" || currentVerb.aux === "both");
  const hasEsserePP = (answers.has_pp_essere != null)
    ? ynToBool(answers.has_pp_essere)
    : (currentVerb.aux === "essere" || currentVerb.aux === "both");

  function setAnswer(key, value) {
    setStore((prev) => ({
      ...prev,
      [activeVerb]: {
        ...(prev[activeVerb] || {}),
        [key]: value,
      },
    }));
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "italian-verb-trainer-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearVerb() {
    setStore((prev) => ({ ...prev, [activeVerb]: {} }));
  }

  function fillBaseDefaults() {
    // convenience: fill base meta from the list for the active verb
    setAnswer("infinitive", currentVerb.infinitive);
    setAnswer("type", currentVerb.type);
    setAnswer("aux", currentVerb.aux);
    setAnswer("has_pp_avere", (currentVerb.aux === "avere" || currentVerb.aux === "both") ? "sì" : "no");
    setAnswer("has_pp_essere", (currentVerb.aux === "essere" || currentVerb.aux === "both") ? "sì" : "no");
  }

  function fillAllModelAnswers() {
    // Fill every field that has a regular-model expected value
    FIELDS.forEach((f) => {
      const exp = expectedForFieldRaw(currentVerb, f.key);
      if (Array.isArray(exp) && exp.length > 0 && typeof exp[0] === "string" && exp[0].trim()) {
        setAnswer(f.key, exp[0]);
      }
    });
  }

  function gotoNextVerb() {
    if (!filtered || filtered.length === 0) return;
    const idx = filtered.findIndex((v) => v.infinitive === activeVerb);
    const next = filtered[(idx >= 0 ? idx + 1 : 0) % filtered.length];
    setActiveVerb(next.infinitive);
    // Optional: focus the first field of the form after switching
    try { document.getElementById("f-infinitive")?.focus(); } catch {}
  }

  function pickRandomVerb() {
    const list = (filtered && filtered.length > 0) ? filtered : VERBS;
    const rand = list[Math.floor(Math.random() * list.length)];
    setActiveVerb(rand.infinitive);
    // Optional: focus the first field of the form after switching
    try { document.getElementById("f-infinitive")?.focus(); } catch {}
  }

  // ---- Quiz helpers ----
  function eligibleQuizKeys(keys: string[]) {
    return keys.filter((k) => {
      const en = englishForField(currentVerb, k);
      const exp = expectedForFieldRaw(currentVerb, k);
      return !!en && Array.isArray(exp) && exp.length > 0;
    });
  }
  function rollSectionQuiz(sectionTitle: string, keys: string[]) {
    const options = eligibleQuizKeys(keys);
    if (options.length === 0) return;
    const key = options[Math.floor(Math.random() * options.length)];
    setQuizBySection((prev) => ({ ...prev, [sectionTitle]: { key, input: "" } }));
  }

  // ---- Global quiz (across all sections) ----
  const [globalQuiz, setGlobalQuiz] = useState<{ key: string; input: string } | null>(null);
  const recGlobalRef = React.useRef<any>(null);
  const [globalListening, setGlobalListening] = useState(false);
  const [globalHeard, setGlobalHeard] = useState(false);
  const [showGlobalAnswer, setShowGlobalAnswer] = useState(false);

  // Helper: show/hide participi keys
  function visibleKeysForSection(sec) {
    if (sec.title === "Participi") {
      return sec.keys.filter((k) =>
        (k.startsWith("pp_avere_") && hasAverePP) ||
        (k.startsWith("pp_essere_") && hasEsserePP)
      );
    }
    return sec.keys;
  }

  function rollGlobalQuiz() {
    const allKeys = SECTIONS.flatMap((sec) => visibleKeysForSection(sec));
    const options = allKeys.filter((k) => {
      const en = englishForField(currentVerb, k);
      const exp = expectedForFieldRaw(currentVerb, k);
      return !!en && Array.isArray(exp) && exp.length > 0;
    });
    if (options.length === 0) return;
    const key = options[Math.floor(Math.random() * options.length)];
    setGlobalQuiz({ key, input: "" });
    setShowGlobalAnswer(false);
    try { recGlobalRef.current?.stop?.(); } catch {}
    setGlobalListening(false);
  }
  useEffect(() => {
    rollGlobalQuiz();
    setShowGlobalAnswer(false);
    try { recGlobalRef.current?.stop?.(); } catch {}
    setGlobalListening(false);
  }, [activeVerb]);
  function stopGlobalListening() {
    try { recGlobalRef.current?.stop?.(); } catch {}
    recGlobalRef.current = null;
    setGlobalListening(false);
  }

  function startGlobalVoice(lang: string = "it-IT") {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (globalListening && recGlobalRef.current) {
      stopGlobalListening();
      return;
    }
    if (recGlobalRef.current) stopGlobalListening();

    const recognition = new SR();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      try {
        const transcript = (event.results?.[0]?.[0]?.transcript || "").trim();
        if (transcript) setGlobalQuiz((prev) => (prev ? { key: prev.key, input: transcript } : prev));
        setGlobalHeard(true);
        setTimeout(() => setGlobalHeard(false), 1200);
      } catch {}
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error (global quiz)", event?.error || event);
    };
    recognition.onend = () => {
      setGlobalListening(false);
      recGlobalRef.current = null;
    };

    try {
      recGlobalRef.current = recognition;
      setGlobalListening(true);
      recognition.start();
    } catch (e) {
      console.error(e);
      recGlobalRef.current = null;
      setGlobalListening(false);
    }
  }

  const activeField = fieldMeta[activeFieldKey];
  const activeValueRaw = answers[activeFieldKey] || "";
  const activeValue = normalize(activeValueRaw);
  const expectedListRaw = expectedForFieldRaw(currentVerb, activeFieldKey);
  const expectedList = expectedListRaw.map(normalize);
  const hasExpected = expectedList.length > 0;
  const isFilled = activeValue.length > 0;
  const isCorrect = isFilled && hasExpected && expectedList.includes(activeValue);
  const englishRender = englishForField(currentVerb, activeFieldKey);
  const expectedCurrent = expectedListRaw[0] || "";

  // Speech synthesis
  function speak(text) {
    if (!text) return;
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "it-IT";
    u.rate = 0.95;
    try { window.speechSynthesis.cancel(); } catch {}
    window.speechSynthesis.speak(u);
  }

  // Speech recognition (voice input)
  function stopListening() {
    try { recRef.current?.stop?.(); } catch {}
    recRef.current = null;
    setListeningKey(null);
  }

  function startVoiceInput(forKey: string, lang: string = "it-IT") {
    setActiveFieldKey(forKey);
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    // if the same key is already listening, stop it (acts as a closer)
    if (listeningKey === forKey && recRef.current) {
      stopListening();
      return;
    }
    // stop any other ongoing recognition
    if (recRef.current) stopListening();

    const recognition = new SR();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      try {
        const transcript = (event.results?.[0]?.[0]?.transcript || "").trim();
        if (transcript) setAnswer(forKey, transcript);
        setHeardKey(forKey);
        setTimeout(() => setHeardKey((k) => (k === forKey ? null : k)), 1200);
      } catch {}
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event?.error || event);
    };
    recognition.onend = () => {
      // recognition session ended
      setListeningKey((k) => (k === forKey ? null : k));
      recRef.current = null;
    };

    try {
      recRef.current = recognition;
      setListeningKey(forKey);
      recognition.start();
    } catch (e) {
      console.error(e);
      recRef.current = null;
      setListeningKey(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Italian Verb Trainer — 50 Irregular Verbs
            </h1>
            <p className="text-sm text-slate-600">
              Type the Italian forms on the left. The English meaning of the CURRENT field
              appears on the right. Your work saves automatically.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportJSON} className="rounded-xl bg-sky-600 px-4 py-2 text-white shadow hover:bg-sky-700">
              Export JSON
            </button>
            <button onClick={clearVerb} className="rounded-xl bg-slate-200 px-4 py-2 text-slate-900 hover:bg-slate-300">
              Clear current verb
            </button>
            <button onClick={fillAllModelAnswers} className="rounded-xl bg-violet-600 px-3 py-2 text-white hover:bg-violet-700" title="Fill every field with the regular model answer for this verb">
              Fill all (model)
            </button>
          </div>
        </header>

        {/* Top controls */}
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-4">
            <label className={labelCls}>Cerca verbo</label>
            <input
              className={inputCls}
              placeholder="Search infinitive / type / aux"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="md:col-span-4">
            <label className={labelCls}>Scegli il verbo</label>
            <select
              className={inputCls}
              value={activeVerb}
              onChange={(e) => setActiveVerb(e.target.value)}
            >
              {filtered.map((v) => (
                <option key={v.infinitive} value={v.infinitive}>
                  {v.infinitive} • {v.type} • aux: {v.aux}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-4">
            <label className={labelCls}>Azioni rapide</label>
            <div className="flex gap-2">
              <button onClick={fillBaseDefaults} className="rounded-xl bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700">
                Fill base from list
              </button>
              <button onClick={pickRandomVerb} className="rounded-xl bg-fuchsia-600 px-3 py-2 text-white hover:bg-fuchsia-700" title="Choose a random verb from the current list">
                Random verb 🎲
              </button>
              <span className={chip}>Verbo attivo: {currentVerb.infinitive}</span>
            </div>
          </div>
        </div>

        {/* Main grid: inputs (left) + English hint (right) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: form */}
          <div className="lg:col-span-8 space-y-6">
            {SECTIONS.map((sec) => (
              <div key={sec.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <Section title={sec.title} desc={sec.desc}>
                  {visibleKeysForSection(sec).map((k) => {
                    const val = answers[k] || "";
                    const valNorm = normalize(val);
                    const expRaw = expectedForFieldRaw(currentVerb, k);
                    const exp = expRaw.map(normalize);
                    const showIcon = valNorm.length > 0 && exp.length > 0;
                    const ok = showIcon && exp.includes(valNorm);
                    return (
                      <div key={k} className="space-y-1 relative">
                        <label className={labelCls} htmlFor={`f-${k}`}>
                          {fieldMeta[k].it}
                        </label>
                        <input
                          id={`f-${k}`}
                          className={inputCls}
                          value={val}
                          onFocus={() => setActiveFieldKey(k)}
                          onChange={(e) => setAnswer(k, e.target.value)}
                          placeholder={(k === "is_refl" || k === "has_pp_avere" || k === "has_pp_essere") ? "sì / no" : "Scrivi qui…"}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // Ensure the translator & pronunciation panel follows this field
                            setActiveFieldKey(k);
                            const current = (answers[k] || "").trim();
                            if (listeningKey === k) {
                              // stop listening for this field
                              stopListening();
                            } else if (current) {
                              setAnswer(k, "");
                            } else {
                              startVoiceInput(k, "it-IT");
                            }
                          }}
                          className={`absolute right-12 top-8 rounded-md px-2.5 py-1.5 text-xs shadow transition
  ${listeningKey === k
    ? "bg-rose-600 text-white animate-pulse hover:bg-rose-700"
    : ((answers[k]||"").trim()
      ? "bg-slate-400 text-white hover:bg-slate-500"
      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300")}`}
                          title={listeningKey === k ? "Stop listening" : ( (answers[k]||"").trim() ? "Clear this answer" : "Answer by voice (Italian)" )}
                          aria-label={listeningKey === k ? "Stop listening" : ( (answers[k]||"").trim() ? "Clear this answer" : "Answer by voice (Italian)" )}
                        >
                          <span className="inline-flex items-center gap-1">
                            {listeningKey === k ? "●" : ((answers[k]||"").trim() ? "✖️" : "🎤")}
                            {heardKey === k && listeningKey !== k ? "✓" : ""}
                          </span>
                        </button>
                        {showIcon && (
                          ok ? (
                            <button
                              type="button"
                              onClick={() => speak(expRaw[0] || "")}
                              className="absolute right-3 top-8 rounded-md px-1.5 py-1 text-emerald-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                              title="Pronounce the model (regular) answer"
                              aria-label="Pronounce the model (regular) answer"
                            >
                              ✅
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => speak(expRaw[0] || "")}
                              className="absolute right-3 top-8 rounded-md px-1.5 py-1 text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
                              title={`Expected: ${expRaw.join("  •  ")} — Click to pronounce model`}
                              aria-label="Pronounce the model (regular) answer"
                            >
                              ❌
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </Section>
              </div>
            ))}
          </div>

          {/* Right: English hint + translator + pronunciation */}
          <aside className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-2 text-base font-semibold text-slate-800">English hint</h3>
                <div className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-800">
                  <div className="mb-1 text-xs uppercase tracking-wide text-slate-500">Current field</div>
                  <div className="text-lg font-semibold">{activeField?.it}</div>
                  <div className="text-slate-600">{activeField?.en}</div>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  Tip: move with <kbd>Tab</kbd>/<kbd>Shift+Tab</kbd>. Click a field to see its meaning here.
                </div>
              </div>

              {/* Translator & Pronunciation */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-2 text-base font-semibold text-slate-800">Translator & Pronunciation</h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div><span className="font-medium">Plain English:</span> {englishRender || "—"}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Model (regular):</span>
                    <code className="rounded bg-slate-100 px-2 py-0.5">{expectedCurrent || "—"}</code>
                    {!!expectedCurrent && (
                      <button
                        onClick={() => speak(expectedCurrent)}
                        className="rounded-lg bg-slate-200 px-2 py-1 text-slate-900 hover:bg-slate-300"
                        title="Speak the model answer"
                      >
                        🔊
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Your input:</span>
                    <code className="rounded bg-slate-100 px-2 py-0.5">{activeValueRaw || "—"}</code>
                    {!!activeValueRaw && (
                      <button
                        onClick={() => speak(activeValueRaw)}
                        className="rounded-lg bg-emerald-600 px-2 py-1 text-white hover:bg-emerald-700"
                        title="Speak your input"
                      >
                        🔊
                      </button>
                    )}
                  </div>
                  {hasExpected && isFilled && (
                    <div className={`text-sm ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                      {isCorrect ? "✓ This matches the regular pattern." : "✗ This doesn’t match the regular pattern."}
                    </div>
                  )}
                  {!hasExpected && (
                    <div className="text-xs text-slate-500">
                      No regular “model” for this field; use it for free practice.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-2 text-base font-semibold text-slate-800">Cheat-sheet: quick rules</h3>
                <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                  <li><span className="font-medium">Futuro semplice</span>: -ò, -ai, -à, -emo, -ete, -anno. For -are, change -a- → -e- (parlerò). -care/-gare add <em>h</em>; -ciare/-giare drop the silent <em>i</em>.</li>
                  <li><span className="font-medium">Imperfetto</span>: infinitive minus -re + -vo, -vi, -va, -vamo, -vate, -vano.</li>
                  <li><span className="font-medium">Progressivo</span>: <em>stare</em> + gerundio (sto/stavo/starò + parlando).</li>
                  <li><span className="font-medium">Imperativo (semplice)</span>: commands for <em>tu / noi / voi</em>. For <strong>-are</strong> verbs, <em>tu</em> uses the 3rd-singular present (es. <em>parla!</em>); for <strong>-ere/-ire</strong>, <em>tu</em> uses the 2nd-singular (es. <em>prendi!</em>, <em>dormi!</em>). <em>noi</em>/<em>voi</em> match the present forms (<em>prendiamo!</em>, <em>prendete!</em>). Negatives: often <em>non</em> + infinitive for <em>tu</em> (<em>non parlare!</em>).</li>
                  <li><span className="font-medium">Passato prossimo</span>: present of the auxiliary (<em>avere/essere</em>) + past participle (es. <em>ho parlato</em>, <em>sono arrivato/a</em>). With <em>essere</em>, agreement is expected in real Italian, but this trainer doesn’t enforce it.</li>
                  <li><span className="font-medium">Riflessivi</span>: mi, ti, si, ci, vi, si. With progressives, prefer the pronoun before <em>stare</em> (mi sto lavando).</li>
                  <li><span className="font-medium">Aux</span>: many motion/state verbs → <em>essere</em> (arrivare, entrare, restare); most transitives → <em>avere</em>; some can be both (passare).</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-700">
                <div className="mb-2 text-slate-900 font-semibold">Auto-check scope</div>
                Regular patterns only. Irregulars can be right even if you see ❌.
              </div>
            </div>
          </aside>
        </div>

        {/* Global Test Section */}
        {globalQuiz && (() => {
          const qKey = globalQuiz.key;
          const enPrompt = englishForField(currentVerb, qKey) || "";
          const expected = expectedForFieldRaw(currentVerb, qKey);
          const expectedNorm = expected.map(normalize);
          const user = globalQuiz.input;
          const userNorm = normalize(user);
          const correct = !!user && expectedNorm.includes(userNorm);
          return (
            <div className="mt-8 rounded-xl border border-slate-300 bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-base font-semibold text-slate-800">Test rapido (tutte le sezioni)</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { rollGlobalQuiz(); }}
                    className="rounded-lg bg-fuchsia-600 px-3 py-1.5 text-white hover:bg-fuchsia-700"
                    title="Nuova domanda casuale da qualsiasi sezione"
                  >
                    🎲
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGlobalAnswer((v) => !v)}
                    className="rounded-lg bg-slate-200 px-3 py-1.5 text-slate-900 hover:bg-slate-300"
                    title={showGlobalAnswer ? "Nascondi la risposta" : "Mostra la risposta"}
                  >
                    {showGlobalAnswer ? "Hide answer" : "Reveal answer"}
                  </button>
                </div>
              </div>
              <div className="text-sm text-slate-700 mb-2">
                <span className="font-medium">Plain English:</span> {enPrompt || "—"}
              </div>
              <div className="relative">
                <input
                  className={inputCls}
                  value={user}
                  onChange={(e) => setGlobalQuiz({ key: qKey, input: e.target.value })}
                  placeholder="Write the Italian here…"
                />
                {/* Mic/Clear/Stop toggle for global quiz */}
                <button
                  type="button"
                  onClick={() => {
                    if (!globalQuiz) return;
                    if (globalListening) {
                      stopGlobalListening();
                    } else if ((globalQuiz.input || "").trim()) {
                      setGlobalQuiz({ key: qKey, input: "" });
                    } else {
                      startGlobalVoice("it-IT");
                    }
                  }}
                  className={`absolute right-12 top-2 rounded-md px-2.5 py-1.5 text-xs shadow transition ${globalListening
                    ? "bg-rose-600 text-white animate-pulse hover:bg-rose-700"
                    : ((user || "").trim()
                      ? "bg-slate-400 text-white hover:bg-slate-500"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300")}`}
                  title={globalListening ? "Stop listening" : ((user || "").trim() ? "Clear this answer" : "Answer by voice (Italian)")}
                  aria-label={globalListening ? "Stop listening" : ((user || "").trim() ? "Clear this answer" : "Answer by voice (Italian)")}
                >
                  <span className="inline-flex items-center gap-1">
                    {globalListening ? "●" : ((user || "").trim() ? "✖️" : "🎤")} {globalHeard && !globalListening ? "✓" : ""}
                  </span>
                </button>
                {/* Correct/incorrect icon replaced with pronounce button */}
                {user && (
                  <button
                    type="button"
                    onClick={() => speak((expected && expected[0]) || "")}
                    className={`absolute right-3 top-2.5 rounded-md px-1.5 py-1 focus:outline-none focus:ring-2 ${correct ? 'text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-400' : 'text-rose-600 hover:bg-rose-50 focus:ring-rose-400'}`}
                    title={correct ? 'Speak model answer' : 'Speak model answer'}
                    aria-label="Pronounce the model (regular) answer"
                  >
                    {correct ? '✅' : '❌'}
                  </button>
                )}
              </div>
              {showGlobalAnswer && !!expected[0] && (
                <div className="mt-2 text-xs text-slate-500">
                  Expected (model): <code className="rounded bg-slate-100 px-1 py-0.5">{expected[0]}</code>
                </div>
              )}
            </div>
          );
        })()}

        {/* Next verb control */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={gotoNextVerb}
            className="rounded-xl bg-sky-600 px-4 py-2 text-white shadow hover:bg-sky-700"
            title="Go to the next verb in the current list"
          >
            Next verb →
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-slate-500">
          Made for Italian A1–A2 practice — saves to your browser only.
        </footer>
      </div>
    </div>
  );
}
