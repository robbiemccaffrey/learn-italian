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

  // Presente (simple)
  { key: "pres_io", it: "Presente – io", en: "Present (io)" },
  { key: "pres_tu", it: "Presente – tu", en: "Present (tu)" },
  { key: "pres_lui", it: "Presente – lui/lei", en: "Present (lui/lei)" },
  { key: "pres_noi", it: "Presente – noi", en: "Present (noi)" },
  { key: "pres_voi", it: "Presente – voi", en: "Present (voi)" },
  { key: "pres_loro", it: "Presente – loro", en: "Present (loro)" },

  // Participles
  { key: "pp_avere", it: "Participio passato (con avere)", en: "Past Participle (with avere)" },
  { key: "pp_essere", it: "Participio passato (con essere)", en: "Past Participle (with essere; include agreement if needed)" },

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
  { title: "Dati base", keys: ["infinitive", "type", "aux"] },
  {
    title: "Presente (semplice)",
    keys: ["pres_io", "pres_tu", "pres_lui", "pres_noi", "pres_voi", "pres_loro"],
  },
  { title: "Participi", keys: ["pp_avere", "pp_essere"] },
  {
    title: "Imperfetto (semplice)",
    keys: ["impf_io", "impf_tu", "impf_lui", "impf_noi", "impf_voi", "impf_loro"],
  },
  {
    title: "Futuro (semplice)",
    keys: ["fut_io", "fut_tu", "fut_lui", "fut_noi", "fut_voi", "fut_loro"],
  },
  {
    title: "Imperfetto progressivo (stare all’imperfetto + gerundio)",
    keys: [
      "imp_prog_io",
      "imp_prog_tu",
      "imp_prog_lui",
      "imp_prog_noi",
      "imp_prog_voi",
      "imp_prog_loro",
    ],
  },
  { title: "Verbo riflessivo?", keys: ["is_refl", "refl_pron"] },
  {
    title: "Presente progressivo (stare al presente + gerundio)",
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
    keys: ["imp_prog_refl", "fut_prog_refl", "refl_pres_io", "refl_fut_io", "refl_pp_notes"],
  },
];

// ====== Verb list (50 common mostly-regular verbs) ======
const VERBS = [
  { infinitive: "abitare", type: "-are", aux: "avere" },
  { infinitive: "aiutare", type: "-are", aux: "avere" },
  { infinitive: "arrivare", type: "-are", aux: "essere" },
  { infinitive: "ascoltare", type: "-are", aux: "avere" },
  { infinitive: "aspettare", type: "-are", aux: "avere" },
  { infinitive: "ballare", type: "-are", aux: "avere" },
  { infinitive: "cambiare", type: "-are", aux: "avere" },
  { infinitive: "camminare", type: "-are", aux: "avere" },
  { infinitive: "cantare", type: "-are", aux: "avere" },
  { infinitive: "capire", type: "-ire (-isc)", aux: "avere" },
  { infinitive: "cercare", type: "-are", aux: "avere" },
  { infinitive: "chiamare", type: "-are", aux: "avere" },
  { infinitive: "comprare", type: "-are", aux: "avere" },
  { infinitive: "costare", type: "-are", aux: "essere" },
  { infinitive: "costruire", type: "-ire (-isc)", aux: "avere" },
  { infinitive: "credere", type: "-ere", aux: "avere" },
  { infinitive: "cucinare", type: "-are", aux: "avere" },
  { infinitive: "desiderare", type: "-are", aux: "avere" },
  { infinitive: "diventare", type: "-are", aux: "essere" },
  { infinitive: "dormire", type: "-ire", aux: "avere" },
  { infinitive: "durare", type: "-are", aux: "essere" },
  { infinitive: "entrare", type: "-are", aux: "essere" },
  { infinitive: "finire", type: "-ire (-isc)", aux: "avere" },
  { infinitive: "giocare", type: "-are", aux: "avere" },
  { infinitive: "guardare", type: "-are", aux: "avere" },
  { infinitive: "guidare", type: "-are", aux: "avere" },
  { infinitive: "imparare", type: "-are", aux: "avere" },
  { infinitive: "incontrare", type: "-are", aux: "avere" },
  { infinitive: "insegnare", type: "-are", aux: "avere" },
  { infinitive: "invitare", type: "-are", aux: "avere" },
  { infinitive: "lavare", type: "-are", aux: "avere" },
  { infinitive: "lavorare", type: "-are", aux: "avere" },
  { infinitive: "mandare", type: "-are", aux: "avere" },
  { infinitive: "mangiare", type: "-are", aux: "avere" },
  { infinitive: "mentire", type: "-ire", aux: "avere" },
  { infinitive: "ordinare", type: "-are", aux: "avere" },
  { infinitive: "pagare", type: "-are", aux: "avere" },
  { infinitive: "parlare", type: "-are", aux: "avere" },
  { infinitive: "partire", type: "-ire", aux: "essere" },
  { infinitive: "passare", type: "-are", aux: "both" },
  { infinitive: "pensare", type: "-are", aux: "avere" },
  { infinitive: "portare", type: "-are", aux: "avere" },
  { infinitive: "preferire", type: "-ire (-isc)", aux: "avere" },
  { infinitive: "prenotare", type: "-are", aux: "avere" },
  { infinitive: "preparare", type: "-are", aux: "avere" },
  { infinitive: "provare", type: "-are", aux: "avere" },
  { infinitive: "pulire", type: "-ire (-isc)", aux: "avere" },
  { infinitive: "restare", type: "-are", aux: "essere" },
  { infinitive: "ricevere", type: "-ere", aux: "avere" },
  { infinitive: "ricordare", type: "-are", aux: "avere" },
];

// ====== English glosses for translator ======
const EN_GLOSS = {
  abitare: "live", aiutare: "help", arrivare: "arrive", ascoltare: "listen",
  aspettare: "wait", ballare: "dance", cambiare: "change", camminare: "walk",
  cantare: "sing", capire: "understand", cercare: "look for", chiamare: "call",
  comprare: "buy", costare: "cost", costruire: "build", credere: "believe",
  cucinare: "cook", desiderare: "desire", diventare: "become", dormire: "sleep",
  durare: "last", entrare: "enter", finire: "finish", giocare: "play",
  guardare: "watch", guidare: "drive", imparare: "learn", incontrare: "meet",
  insegnare: "teach", invitare: "invite", lavare: "wash", lavorare: "work",
  mandare: "send", mangiare: "eat", mentire: "lie", ordinare: "order",
  pagare: "pay", parlare: "speak", partire: "leave", passare: "pass",
  pensare: "think", portare: "bring", preferire: "prefer", prenotare: "book",
  preparare: "prepare", provare: "try", pulire: "clean", restare: "stay",
  ricevere: "receive", ricordare: "remember",
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

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{children}</div>
    </div>
  );
}

// ====== Conjugation engine (regular patterns + basic orthography) ======
function endsWithAny(str, arr) { return arr.some((s) => str.endsWith(s)); }
const persons = ["io","tu","lui/lei","noi","voi","loro"];

function getType(verbType) {
  if ((verbType || "").includes("-isc")) return "-ire-isc";
  if ((verbType || "").includes("-ire")) return "-ire";
  if ((verbType || "").includes("-ere")) return "-ere";
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

// Expected answers (normalized) for auto-check
function expectedForField(verbObj, key) {
  if (!verbObj) return [];
  const inf = verbObj.infinitive;
  const type = getType(verbObj.type);
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
      const forms = presentConj(inf, type);
      const idx = { pres_io:0, pres_tu:1, pres_lui:2, pres_noi:3, pres_voi:4, pres_loro:5 }[key];
      return [forms[idx]];
    }
    // participi
    case "pp_avere":
    case "pp_essere": return [participioPassato(inf, type)];
    // imperfetto
    case "impf_io":
    case "impf_tu":
    case "impf_lui":
    case "impf_noi":
    case "impf_voi":
    case "impf_loro": {
      const forms = imperfetto(inf);
      const idx = { impf_io:0, impf_tu:1, impf_lui:2, impf_noi:3, impf_voi:4, impf_loro:5 }[key];
      return [forms[idx]];
    }
    // futuro
    case "fut_io":
    case "fut_tu":
    case "fut_lui":
    case "fut_noi":
    case "fut_voi":
    case "fut_loro": {
      const forms = futuro(inf, type);
      const idx = { fut_io:0, fut_tu:1, fut_lui:2, fut_noi:3, fut_voi:4, fut_loro:5 }[key];
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
      return [STARE_PRES[idx] + " " + gerundio(inf, type)];
    }
    case "imp_prog_io":
    case "imp_prog_tu":
    case "imp_prog_lui":
    case "imp_prog_noi":
    case "imp_prog_voi":
    case "imp_prog_loro": {
      const idx = { imp_prog_io:0,imp_prog_tu:1,imp_prog_lui:2,imp_prog_noi:3,imp_prog_voi:4,imp_prog_loro:5 }[key];
      return [STARE_IMPF[idx] + " " + gerundio(inf, type)];
    }
    case "fut_prog_io":
    case "fut_prog_tu":
    case "fut_prog_lui":
    case "fut_prog_noi":
    case "fut_prog_voi":
    case "fut_prog_loro": {
      const idx = { fut_prog_io:0,fut_prog_tu:1,fut_prog_lui:2,fut_prog_noi:3,fut_prog_voi:4,fut_prog_loro:5 }[key];
      return [STARE_FUT[idx] + " " + gerundio(inf, type)];
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
function englishForField(verbObj, key) {
  const base = EN_GLOSS[verbObj.infinitive] || verbObj.infinitive;
  const youPL = "you (pl)";
  const en = {
    pres_io: `I ${base}`, pres_tu: `you ${base}`,
    pres_lui: `he/she ${base}${base.startsWith("be ")? "" : (base.endsWith("s")? "" : "s")}`,
    pres_noi: `we ${base}`, pres_voi: `${youPL} ${base}`, pres_loro: `they ${base}`,

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

    pp_avere: `past participle (with avere)`,
    pp_essere: `past participle (with essere)`,
  };
  return en[key] || null;
}

export default function App() {
  const [store, setStore] = useLocalStore();
  const [query, setQuery] = useState("");
  const [activeVerb, setActiveVerb] = useState(VERBS[0].infinitive);
  const [activeFieldKey, setActiveFieldKey] = useState("infinitive");

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

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Italian Verb Trainer — 50 Verbs
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
                <Section title={sec.title}>
                  {sec.keys.map((k) => {
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
                          placeholder={k === "is_refl" ? "sì / no" : "Scrivi qui…"}
                        />
                        {showIcon && (
                          <span
                            className={`absolute right-3 top-9 select-none ${ok ? "text-emerald-600" : "text-rose-600"}`}
                            aria-label={ok ? "Correct" : "Incorrect"}
                            title={ok ? "Looks good (regular pattern)" : `Expected: ${expRaw.join("  •  ")}`}
                          >
                            {ok ? "✅" : "❌"}
                          </span>
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

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-slate-500">
          Made for Italian A1–A2 practice — saves to your browser only.
        </footer>
      </div>
    </div>
  );
}
