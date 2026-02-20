import React, { useEffect, useMemo, useState } from "react";

// Unified Italian Verb Practice - All verbs in one place
// Organized by tense and verb type (regular/irregular/all)

// ====== Styling helpers ======
const labelCls = "text-sm font-medium text-slate-700";
const inputCls =
  "w-full rounded-xl border border-slate-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400";
const chip =
  "inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700";

// ====== English translations ======
const EN_GLOSS: Record<string, string> = {
  "abitare": "live",
  "aiutare": "help", 
  "arrivare": "arrive",
  "ascoltare": "listen",
  "aspettare": "wait",
  "ballare": "dance",
  "cambiare": "change",
  "camminare": "walk",
  "cantare": "sing",
  "comprare": "buy",
  "cucinare": "cook",
  "dimenticare": "forget",
  "frequentare": "attend",
  "giocare": "play",
  "guardare": "watch",
  "imparare": "learn",
  "incontrare": "meet",
  "lavare": "wash",
  "lavorare": "work",
  "mandare": "send",
  "parlare": "speak",
  "portare": "bring",
  "preparare": "prepare",
  "ricordare": "remember",
  "studiare": "study",
  "telefonare": "call",
  "tornare": "return",
  "trovare": "find",
  "usare": "use",
  "viaggiare": "travel",
  "battere": "beat",
  "cadere": "fall",
  "chiedere": "ask",
  "chiudere": "close",
  "conoscere": "know",
  "credere": "believe",
  "leggere": "read",
  "mettere": "put",
  "perdere": "lose",
  "prendere": "take",
  "rispondere": "answer",
  "scrivere": "write",
  "vedere": "see",
  "vendere": "sell",
  "vincere": "win",
  "aprire": "open",
  "capire": "understand",
  "dormire": "sleep",
  "finire": "finish",
  "partire": "leave",
  "seguire": "follow",
  "sentire": "hear",
  "servire": "serve",
  "vestire": "dress",
  "andare": "go",
  "avere": "have",
  "bere": "drink",
  "dare": "give",
  "dire": "say",
  "dovere": "must",
  "essere": "be",
  "fare": "do",
  "potere": "can",
  "sapere": "know",
  "stare": "stay",
  "uscire": "go out",
  "venire": "come",
  "volere": "want"
};

// ====== Helper functions ======
function getType(typeStr: string): string {
  if (typeStr.includes("(-isc)")) return "-ire (-isc)";
  return typeStr;
}

function presentConj(inf: string, type: string): string[] {
  const root = inf.slice(0, -3);
  switch (type) {
    case "-are":
      return [
        root + "o",    // io
        root + "i",    // tu  
        root + "a",    // lui/lei
        root + "iamo", // noi
        root + "ate",  // voi
        root + "ano"   // loro
      ];
    case "-ere":
      return [
        root + "o",    // io
        root + "i",    // tu
        root + "e",    // lui/lei
        root + "iamo", // noi
        root + "ete",  // voi
        root + "ono"   // loro
      ];
    case "-ire":
      return [
        root + "o",    // io
        root + "i",    // tu
        root + "e",    // lui/lei
        root + "iamo", // noi
        root + "ite",  // voi
        root + "ono"   // loro
      ];
    case "-ire (-isc)":
      return [
        root + "isco", // io
        root + "isci", // tu
        root + "isce", // lui/lei
        root + "iamo", // noi
        root + "ite",  // voi
        root + "iscono" // loro
      ];
    default:
      return ["", "", "", "", "", ""];
  }
}

function participioPassato(inf: string, type: string): string {
  const root = inf.slice(0, -3);
  switch (type) {
    case "-are":
      return root + "ato";
    case "-ere":
      return root + "uto";
    case "-ire":
    case "-ire (-isc)":
      return root + "ito";
    default:
      return "";
  }
}

const AVERE_PRES = ["ho", "hai", "ha", "abbiamo", "avete", "hanno"];
const ESSERE_PRES = ["sono", "sei", "è", "siamo", "siete", "sono"];

function expectedForField(verbObj: any, key: string): string[] {
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
    
    // imperativo
    case "impv_tu": {
      const forms = presentConj(inf, type);
      const form = (type === "-are") ? forms[2] : forms[1];
      return [form];
    }
    case "impv_noi": {
      const forms = presentConj(inf, type);
      return [forms[3]];
    }
    case "impv_voi": {
      const forms = presentConj(inf, type);
      return [forms[4]];
    }
    
    // passato prossimo
    case "pp_io":
    case "pp_tu":
    case "pp_lui":
    case "pp_noi":
    case "pp_voi":
    case "pp_loro": {
      const idx = { pp_io:0, pp_tu:1, pp_lui:2, pp_noi:3, pp_voi:4, pp_loro:5 }[key];
      const aux = verbObj.aux === "essere" ? ESSERE_PRES[idx] : AVERE_PRES[idx];
      const pp = participioPassato(inf, type);
      return [aux + " " + pp];
    }
    
    // imperfetto
    case "impf_io":
    case "impf_tu":
    case "impf_lui":
    case "impf_noi":
    case "impf_voi":
    case "impf_loro": {
      const root = inf.slice(0, -3);
      let endings: string[];
      switch (type) {
        case "-are":
          endings = ["avo", "avi", "ava", "avamo", "avate", "avano"];
          break;
        case "-ere":
        case "-ire":
        case "-ire (-isc)":
          endings = ["evo", "evi", "eva", "evamo", "evate", "evano"];
          break;
        default:
          endings = ["", "", "", "", "", ""];
      }
      const idx = { impf_io:0, impf_tu:1, impf_lui:2, impf_noi:3, impf_voi:4, impf_loro:5 }[key];
      return [root + endings[idx]];
    }
    
    // condizionale
    case "cond_io":
    case "cond_tu":
    case "cond_lui":
    case "cond_noi":
    case "cond_voi":
    case "cond_loro": {
      const root = inf.slice(0, -3);
      const endings = ["rei", "resti", "rebbe", "remmo", "reste", "rebbero"];
      const idx = { cond_io:0, cond_tu:1, cond_lui:2, cond_noi:3, cond_voi:4, cond_loro:5 }[key];
      return [root + endings[idx]];
    }
    
    default:
      return [];
  }
}

function normalize(s: string): string {
  return (s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");
}

function pastParticiple(base: string): string {
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

function englishForField(verbObj: any, key: string): string {
  const base = EN_GLOSS[verbObj.infinitive] || verbObj.infinitive;
  const youPL = "you (pl)";
  const ppEn = pastParticiple(base);
  
  const en: Record<string, string> = {
    pres_io: `I ${base}`, 
    pres_tu: `you ${base}`,
    pres_lui: `he/she ${base}${base.startsWith("be ") ? "" : (base.endsWith("s") ? "" : "s")}`,
    pres_noi: `we ${base}`, 
    pres_voi: `${youPL} ${base}`, 
    pres_loro: `they ${base}`,
    
    impv_tu: `(you) ${base}!`,
    impv_noi: `let's ${base}!`,
    impv_voi: `(you pl) ${base}!`,
    
    pp_io: `I have ${ppEn}`,
    pp_tu: `you have ${ppEn}`,
    pp_lui: `he/she has ${ppEn}`,
    pp_noi: `we have ${ppEn}`,
    pp_voi: `you (pl) have ${ppEn}`,
    pp_loro: `they have ${ppEn}`,
    
    impf_io: `I was ${base}ing`,
    impf_tu: `you were ${base}ing`,
    impf_lui: `he/she was ${base}ing`,
    impf_noi: `we were ${base}ing`,
    impf_voi: `you (pl) were ${base}ing`,
    impf_loro: `they were ${base}ing`,
    
    cond_io: `I would ${base}`,
    cond_tu: `you would ${base}`,
    cond_lui: `he/she would ${base}`,
    cond_noi: `we would ${base}`,
    cond_voi: `you (pl) would ${base}`,
    cond_loro: `they would ${base}`,
  };
  
  return en[key] || "";
}

// ====== All verbs combined ======
const ALL_VERBS = [
  // Regular -are verbs
  { infinitive: "abitare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "aiutare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "arrivare", type: "-are", aux: "essere", category: "regular" },
  { infinitive: "ascoltare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "aspettare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "ballare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "cambiare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "camminare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "cantare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "comprare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "cucinare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "dimenticare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "frequentare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "giocare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "guardare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "imparare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "incontrare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "lavare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "lavorare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "mandare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "parlare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "portare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "preparare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "ricordare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "studiare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "telefonare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "tornare", type: "-are", aux: "essere", category: "regular" },
  { infinitive: "trovare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "usare", type: "-are", aux: "avere", category: "regular" },
  { infinitive: "viaggiare", type: "-are", aux: "avere", category: "regular" },

  // Regular -ere verbs
  { infinitive: "battere", type: "-ere", aux: "avere", category: "regular" },
  { infinitive: "cadere", type: "-ere", aux: "essere", category: "regular" },
  { infinitive: "chiedere", type: "-ere", aux: "avere", category: "regular" },
  { infinitive: "chiudere", type: "-ere", aux: "avere", category: "regular" },
  { infinitive: "conoscere", type: "-ere", aux: "avere", category: "regular" },
  { infinitive: "credere", type: "-ere", aux: "avere", category: "regular" },
  { infinitive: "leggere", type: "-ere", aux: "avere", category: "regular" },
  { infinitive: "mettere", type: "-ere", aux: "avere", category: "regular" },
  { infinitive: "perdere", type: "-ere", aux: "avere", category: "regular" },
  { infinitive: "prendere", type: "-ere", aux: "avere", category: "regular" },
  { infinitive: "rispondere", type: "-ere", aux: "avere", category: "regular" },
  { infinitive: "scrivere", type: "-ere", aux: "avere", category: "regular" },
  { infinitive: "vedere", type: "-ere", aux: "avere", category: "regular" },
  { infinitive: "vendere", type: "-ere", aux: "avere", category: "regular" },
  { infinitive: "vincere", type: "-ere", aux: "avere", category: "regular" },

  // Regular -ire verbs
  { infinitive: "aprire", type: "-ire", aux: "avere", category: "regular" },
  { infinitive: "capire", type: "-ire (-isc)", aux: "avere", category: "regular" },
  { infinitive: "dormire", type: "-ire", aux: "avere", category: "regular" },
  { infinitive: "finire", type: "-ire (-isc)", aux: "avere", category: "regular" },
  { infinitive: "partire", type: "-ire", aux: "essere", category: "regular" },
  { infinitive: "seguire", type: "-ire", aux: "avere", category: "regular" },
  { infinitive: "sentire", type: "-ire", aux: "avere", category: "regular" },
  { infinitive: "servire", type: "-ire", aux: "avere", category: "regular" },
  { infinitive: "vestire", type: "-ire (-isc)", aux: "avere", category: "regular" },

  // Irregular verbs
  { infinitive: "andare", type: "irregular", aux: "essere", category: "irregular" },
  { infinitive: "avere", type: "irregular", aux: "avere", category: "irregular" },
  { infinitive: "bere", type: "irregular", aux: "avere", category: "irregular" },
  { infinitive: "dare", type: "irregular", aux: "avere", category: "irregular" },
  { infinitive: "dire", type: "irregular", aux: "avere", category: "irregular" },
  { infinitive: "dovere", type: "irregular", aux: "avere", category: "irregular" },
  { infinitive: "essere", type: "irregular", aux: "essere", category: "irregular" },
  { infinitive: "fare", type: "irregular", aux: "avere", category: "irregular" },
  { infinitive: "potere", type: "irregular", aux: "avere", category: "irregular" },
  { infinitive: "sapere", type: "irregular", aux: "avere", category: "irregular" },
  { infinitive: "stare", type: "irregular", aux: "avere", category: "irregular" },
  { infinitive: "uscire", type: "irregular", aux: "essere", category: "irregular" },
  { infinitive: "venire", type: "irregular", aux: "essere", category: "irregular" },
  { infinitive: "volere", type: "irregular", aux: "avere", category: "irregular" },
];

// ====== Tense definitions ======
const TENSES = [
  {
    id: "presente",
    name: "Presente",
    description: "Present tense",
    fields: [
      { key: "pres_io", it: "io", en: "I" },
      { key: "pres_tu", it: "tu", en: "you" },
      { key: "pres_lui", it: "lui/lei", en: "he/she" },
      { key: "pres_noi", it: "noi", en: "we" },
      { key: "pres_voi", it: "voi", en: "you (pl.)" },
      { key: "pres_loro", it: "loro", en: "they" },
    ]
  },
  {
    id: "imperativo",
    name: "Imperativo",
    description: "Imperative mood",
    fields: [
      { key: "impv_tu", it: "tu", en: "you" },
      { key: "impv_noi", it: "noi", en: "let's" },
      { key: "impv_voi", it: "voi", en: "you (pl.)" },
    ]
  },
  {
    id: "passato_prossimo",
    name: "Passato Prossimo",
    description: "Present perfect",
    fields: [
      { key: "pp_io", it: "io", en: "I" },
      { key: "pp_tu", it: "tu", en: "you" },
      { key: "pp_lui", it: "lui/lei", en: "he/she" },
      { key: "pp_noi", it: "noi", en: "we" },
      { key: "pp_voi", it: "voi", en: "you (pl.)" },
      { key: "pp_loro", it: "loro", en: "they" },
    ]
  },
  {
    id: "imperfetto",
    name: "Imperfetto",
    description: "Imperfect tense",
    fields: [
      { key: "impf_io", it: "io", en: "I" },
      { key: "impf_tu", it: "tu", en: "you" },
      { key: "impf_lui", it: "lui/lei", en: "he/she" },
      { key: "impf_noi", it: "noi", en: "we" },
      { key: "impf_voi", it: "voi", en: "you (pl.)" },
      { key: "impf_loro", it: "loro", en: "they" },
    ]
  },
  {
    id: "condizionale",
    name: "Condizionale",
    description: "Conditional tense",
    fields: [
      { key: "cond_io", it: "io", en: "I" },
      { key: "cond_tu", it: "tu", en: "you" },
      { key: "cond_lui", it: "lui/lei", en: "he/she" },
      { key: "cond_noi", it: "noi", en: "we" },
      { key: "cond_voi", it: "voi", en: "you (pl.)" },
      { key: "cond_loro", it: "loro", en: "they" },
    ]
  },
  {
    id: "all_tenses",
    name: "All Tenses",
    description: "Practice all tenses together",
    fields: [
      // Presente
      { key: "pres_io", it: "Presente - io", en: "Present - I" },
      { key: "pres_tu", it: "Presente - tu", en: "Present - you" },
      { key: "pres_lui", it: "Presente - lui/lei", en: "Present - he/she" },
      { key: "pres_noi", it: "Presente - noi", en: "Present - we" },
      { key: "pres_voi", it: "Presente - voi", en: "Present - you (pl.)" },
      { key: "pres_loro", it: "Presente - loro", en: "Present - they" },
      
      // Imperativo
      { key: "impv_tu", it: "Imperativo - tu", en: "Imperative - you" },
      { key: "impv_noi", it: "Imperativo - noi", en: "Imperative - let's" },
      { key: "impv_voi", it: "Imperativo - voi", en: "Imperative - you (pl.)" },
      
      // Passato Prossimo
      { key: "pp_io", it: "Passato Prossimo - io", en: "Present Perfect - I" },
      { key: "pp_tu", it: "Passato Prossimo - tu", en: "Present Perfect - you" },
      { key: "pp_lui", it: "Passato Prossimo - lui/lei", en: "Present Perfect - he/she" },
      { key: "pp_noi", it: "Passato Prossimo - noi", en: "Present Perfect - we" },
      { key: "pp_voi", it: "Passato Prossimo - voi", en: "Present Perfect - you (pl.)" },
      { key: "pp_loro", it: "Passato Prossimo - loro", en: "Present Perfect - they" },
      
      // Imperfetto
      { key: "impf_io", it: "Imperfetto - io", en: "Imperfect - I" },
      { key: "impf_tu", it: "Imperfetto - tu", en: "Imperfect - you" },
      { key: "impf_lui", it: "Imperfetto - lui/lei", en: "Imperfect - he/she" },
      { key: "impf_noi", it: "Imperfetto - noi", en: "Imperfect - we" },
      { key: "impf_voi", it: "Imperfetto - voi", en: "Imperfect - you (pl.)" },
      { key: "impf_loro", it: "Imperfetto - loro", en: "Imperfect - they" },
      
      // Condizionale
      { key: "cond_io", it: "Condizionale - io", en: "Conditional - I" },
      { key: "cond_tu", it: "Condizionale - tu", en: "Conditional - you" },
      { key: "cond_lui", it: "Condizionale - lui/lei", en: "Conditional - he/she" },
      { key: "cond_noi", it: "Condizionale - noi", en: "Conditional - we" },
      { key: "cond_voi", it: "Condizionale - voi", en: "Conditional - you (pl.)" },
      { key: "cond_loro", it: "Condizionale - loro", en: "Conditional - they" },
    ]
  }
];

// ====== Verb type filters ======
const VERB_TYPES = [
  { id: "all", name: "All Verbs", description: "Practice all verbs" },
  { id: "regular", name: "Regular Only", description: "Focus on regular verb patterns" },
  { id: "irregular", name: "Irregular Only", description: "Focus on irregular verbs" },
  { id: "-are", name: "-are Verbs", description: "First conjugation verbs" },
  { id: "-ere", name: "-ere Verbs", description: "Second conjugation verbs" },
  { id: "-ire", name: "-ire Verbs", description: "Third conjugation verbs" },
  { id: "irregular", name: "Irregular Verbs", description: "Common irregular verbs" },
];

// ====== Main Component ======
export default function VerbPractice() {
  const [activeVerb, setActiveVerb] = useState(ALL_VERBS[0].infinitive);
  const [selectedTense, setSelectedTense] = useState("presente");
  const [selectedVerbType, setSelectedVerbType] = useState("all");
  const [query, setQuery] = useState("");
  const [store, setStore] = useState<Record<string, Record<string, string>>>({});
  const [activeFieldKey, setActiveFieldKey] = useState("");

  // Load saved answers from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("verb-practice-answers");
    if (saved) {
      try {
        setStore(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved answers:", e);
      }
    }
  }, []);

  // Save answers to localStorage
  useEffect(() => {
    localStorage.setItem("verb-practice-answers", JSON.stringify(store));
  }, [store]);

  // Filter verbs based on selected type
  const filteredVerbs = useMemo(() => {
    let verbs = ALL_VERBS;
    
    if (selectedVerbType !== "all") {
      if (selectedVerbType === "regular") {
        verbs = verbs.filter(v => v.category === "regular");
      } else if (selectedVerbType === "irregular") {
        verbs = verbs.filter(v => v.category === "irregular");
      } else {
        verbs = verbs.filter(v => v.type === selectedVerbType);
      }
    }

    if (query) {
      verbs = verbs.filter(v => 
        v.infinitive.toLowerCase().includes(query.toLowerCase())
      );
    }

    return verbs;
  }, [selectedVerbType, query]);

  const currentVerb = useMemo(
    () => filteredVerbs.find(v => v.infinitive === activeVerb) || filteredVerbs[0],
    [activeVerb, filteredVerbs]
  );

  const currentTense = useMemo(
    () => TENSES.find(t => t.id === selectedTense) || TENSES[0],
    [selectedTense]
  );

  const answers = store[activeVerb] || {};

  const updateAnswer = (field: string, value: string) => {
    setStore(prev => ({
      ...prev,
      [activeVerb]: {
        ...prev[activeVerb],
        [field]: value
      }
    }));
  };

  const speak = (text: string) => {
    if (!text) return;
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "it-IT";
    utterance.rate = 0.7;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis error:", e);
    }
  };

  const fillAllAnswers = () => {
    currentTense.fields.forEach(field => {
      const expected = expectedForField(currentVerb, field.key);
      if (expected.length > 0 && expected[0]) {
        updateAnswer(field.key, expected[0]);
      }
    });
  };

  const clearAllAnswers = () => {
    currentTense.fields.forEach(field => {
      updateAnswer(field.key, "");
    });
  };

  const renderField = (field: any) => {
    const val = answers[field.key] || "";
    const valNorm = normalize(val);
    const expRaw = expectedForField(currentVerb, field.key);
    const exp = expRaw.map(normalize);
    const showIcon = valNorm.length > 0 && exp.length > 0;
    const isCorrect = showIcon && exp.includes(valNorm);
    
    return (
      <div key={field.key} className="relative">
        <label className={labelCls}>
          {field.it} ({field.en})
        </label>
        <input
          type="text"
          id={`f-${field.key}`}
          value={val}
          onFocus={() => setActiveFieldKey(field.key)}
          onChange={(e) => updateAnswer(field.key, e.target.value)}
          className={inputCls}
          placeholder="Enter conjugation..."
        />
        {showIcon && (
          <button
            type="button"
            onClick={() => speak(expRaw[0] || "")}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
              isCorrect 
                ? 'text-emerald-600 hover:bg-emerald-50' 
                : 'text-rose-600 hover:bg-rose-50'
            }`}
            title={isCorrect ? 'Correct! Click to hear' : 'Incorrect. Click to hear correct answer'}
          >
            {isCorrect ? '✅' : '❌'}
          </button>
        )}
        {!showIcon && val && (
          <button
            onClick={() => speak(val)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-sky-100 hover:bg-sky-200 rounded transition-colors"
            title="Pronounce"
          >
            🔊
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Italian Verb Practice
          </h1>
          <p className="text-slate-600">
            Master all Italian verbs with comprehensive practice by tense and type
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Verb Type Filter */}
            <div>
              <label className={labelCls}>Verb Type</label>
              <select
                value={selectedVerbType}
                onChange={(e) => setSelectedVerbType(e.target.value)}
                className={inputCls}
              >
                {VERB_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tense Filter */}
            <div>
              <label className={labelCls}>Tense</label>
              <select
                value={selectedTense}
                onChange={(e) => setSelectedTense(e.target.value)}
                className={inputCls}
              >
                {TENSES.map(tense => (
                  <option key={tense.id} value={tense.id}>
                    {tense.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className={labelCls}>Search Verbs</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by infinitive..."
                className={inputCls}
              />
            </div>
          </div>

          {/* Current Selection Info */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={chip}>
              📚 {filteredVerbs.length} verbs
            </span>
            <span className={chip}>
              🎯 {selectedVerbType === "all" ? "All Types" : VERB_TYPES.find(t => t.id === selectedVerbType)?.name}
            </span>
            <span className={chip}>
              ⏰ {currentTense.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Verb List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Select Verb ({filteredVerbs.length})
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredVerbs.map(verb => (
                  <button
                    key={verb.infinitive}
                    onClick={() => setActiveVerb(verb.infinitive)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeVerb === verb.infinitive
                        ? "bg-sky-100 border-2 border-sky-300 text-sky-800"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="font-medium">{verb.infinitive}</div>
                    <div className="text-sm text-slate-500">
                      {verb.type} • {verb.aux} • {verb.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Practice Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {currentVerb && (
                <>
                  {/* Verb Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-slate-800">
                          {currentVerb.infinitive}
                        </h2>
                        <span className="text-lg text-slate-600 font-medium">
                          ({EN_GLOSS[currentVerb.infinitive] || "meaning"})
                        </span>
                      </div>
                      <button
                        onClick={() => speak(currentVerb.infinitive)}
                        className="p-2 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors"
                        title="Pronounce"
                      >
                        🔊
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={chip}>
                        {currentVerb.type}
                      </span>
                      <span className={chip}>
                        Aux: {currentVerb.aux}
                      </span>
                      <span className={chip}>
                        {currentVerb.category}
                      </span>
                    </div>
                    
                    {/* Quick Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={fillAllAnswers}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                        title="Fill all fields with correct answers"
                      >
                        ✅ Fill All Answers
                      </button>
                      <button
                        onClick={clearAllAnswers}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm"
                        title="Clear all fields"
                      >
                        🗑️ Clear All
                      </button>
                    </div>
                  </div>

                  {/* Tense Practice */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        {currentTense.name} - {currentTense.description}
                      </h3>
                      
                      {selectedTense === "all_tenses" ? (
                        <div className="space-y-6">
                          {/* Presente */}
                          <div>
                            <h4 className="text-md font-semibold text-slate-700 mb-3 border-b border-slate-200 pb-2">
                              📝 Presente (Present Tense)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {currentTense.fields.filter(f => f.key.startsWith('pres_')).map(field => renderField(field))}
                            </div>
                          </div>
                          
                          {/* Imperativo */}
                          <div>
                            <h4 className="text-md font-semibold text-slate-700 mb-3 border-b border-slate-200 pb-2">
                              ⚡ Imperativo (Imperative)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {currentTense.fields.filter(f => f.key.startsWith('impv_')).map(field => renderField(field))}
                            </div>
                          </div>
                          
                          {/* Passato Prossimo */}
                          <div>
                            <h4 className="text-md font-semibold text-slate-700 mb-3 border-b border-slate-200 pb-2">
                              ⏰ Passato Prossimo (Present Perfect)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {currentTense.fields.filter(f => f.key.startsWith('pp_')).map(field => renderField(field))}
                            </div>
                          </div>
                          
                          {/* Imperfetto */}
                          <div>
                            <h4 className="text-md font-semibold text-slate-700 mb-3 border-b border-slate-200 pb-2">
                              🔄 Imperfetto (Imperfect)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {currentTense.fields.filter(f => f.key.startsWith('impf_')).map(field => renderField(field))}
                            </div>
                          </div>
                          
                          {/* Condizionale */}
                          <div>
                            <h4 className="text-md font-semibold text-slate-700 mb-3 border-b border-slate-200 pb-2">
                              🤔 Condizionale (Conditional)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {currentTense.fields.filter(f => f.key.startsWith('cond_')).map(field => renderField(field))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentTense.fields.map(field => renderField(field))}
                        </div>
                      )}
                    </div>

                    {/* Meaning & Pronunciation Panel */}
                    <div className="lg:col-span-1">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h3 className="mb-2 text-base font-semibold text-slate-800">Meaning & Pronunciation</h3>
                        <div className="space-y-2 text-sm text-slate-700">
                          <div>
                            <span className="font-medium">Plain English:</span> 
                            <span className="ml-2">{activeFieldKey ? englishForField(currentVerb, activeFieldKey) || "—" : "Select a field"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Model (regular):</span>
                            <code className="rounded bg-slate-100 px-2 py-0.5">
                              {activeFieldKey ? (expectedForField(currentVerb, activeFieldKey)[0] || "—") : "—"}
                            </code>
                            {activeFieldKey && expectedForField(currentVerb, activeFieldKey)[0] && (
                              <button
                                type="button"
                                onClick={() => speak(expectedForField(currentVerb, activeFieldKey)[0] || "")}
                                className="p-1 bg-sky-100 hover:bg-sky-200 rounded transition-colors"
                                title="Pronounce model answer"
                              >
                                🔊
                              </button>
                            )}
                          </div>
                          <div className="pt-2 border-t border-slate-200">
                            <div className="font-medium text-slate-800 mb-1">Verb Info:</div>
                            <div className="text-xs text-slate-600">
                              <div>Type: {currentVerb.type}</div>
                              <div>Auxiliary: {currentVerb.aux}</div>
                              <div>Category: {currentVerb.category}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
