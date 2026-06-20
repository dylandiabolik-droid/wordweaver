import { useState, useEffect, useRef } from "react";

// ─── TRANSLATIONS ────────────────────────────────────────────────────────────
const T = {
  de: {
    subtitle: "BEGRIFFE → SPRACHE · KI-TEXTGENERATOR",
    tagline: "Gib Begriffe ein — erhalte Sprache, die bewegt.",
    taglineSub: "Gedichte · Verkaufstexte · Slogans · Storys · Biographien — alles aus deinen Schlüsselwörtern.",
    chooseMode: "TEXTART WÄHLEN",
    inputLabel: "DEINE BEGRIFFE (kommagetrennt)",
    outputLang: "AUSGABESPRACHE",
    placeholder: "z.B. Herbst, Nostalgie, Kaffee, Regen, Zuhause",
    termCount: (n) => `${n} Begriff${n !== 1 ? "e" : ""} · max. 20`,
    shortcut: "⌘↵ zum Generieren",
    generate: (label) => `✦ ${label} erstellen`,
    generating: "Generiere…",
    result: "ERGEBNIS",
    copy: "KOPIEREN",
    copied: "✓ KOPIERT",
    history: "VERLAUF",
    tipsTitle: "Tipps für bessere Texte",
    tips: ["Emotionale Begriffe wirken stärker", "Gegensätze erzeugen Spannung", "Orte + Stimmungen = Atmosphäre", "3–7 Begriffe sind ideal"],
    useCasesTitle: "Wofür eignet sich ListingWriter?",
    useCases: [
      { title: "Marketing & Werbung", text: "Erstelle in Sekunden überzeugende Copy für Social Media, Newsletter oder Landingpages." },
      { title: "Kreatives Schreiben", text: "Lass dich von KI-Gedichten und Mini-Storys inspirieren — perfekt für Grußkarten oder Geschenke." },
      { title: "Branding & Namen", text: "Finde prägnante Taglines und Slogans für deine Marke, dein Produkt oder Event." },
    ],
    errMin: "Bitte mindestens einen Begriff eingeben.",
    errMax: "Maximal 20 Begriffe erlaubt.",
    errApi: "Fehler beim Generieren. Bitte erneut versuchen.",
    footer: "LISTINGWRITER · KI-TEXTGENERATOR · DATENSCHUTZ · IMPRESSUM",
    dailyQuote: "PHILOSOPHIE DES TAGES",
    shareBtn: "TEILEN",
  },
  en: {
    subtitle: "WORDS → LANGUAGE · AI TEXT GENERATOR",
    tagline: "Enter words — receive language that moves.",
    taglineSub: "Poems · Sales Copy · Slogans · Stories · Biographies — all from your keywords.",
    chooseMode: "CHOOSE TEXT TYPE",
    inputLabel: "YOUR WORDS (comma-separated)",
    outputLang: "OUTPUT LANGUAGE",
    placeholder: "e.g. autumn, nostalgia, coffee, rain, home",
    termCount: (n) => `${n} word${n !== 1 ? "s" : ""} · max. 20`,
    shortcut: "⌘↵ to generate",
    generate: (label) => `✦ Create ${label}`,
    generating: "Generating…",
    result: "RESULT",
    copy: "COPY",
    copied: "✓ COPIED",
    history: "HISTORY",
    tipsTitle: "Tips for Better Texts",
    tips: ["Emotional words have stronger impact", "Contrasts create tension", "Places + moods = atmosphere", "3–7 words is ideal"],
    useCasesTitle: "What is ListingWriter good for?",
    useCases: [
      { title: "Marketing & Ads", text: "Create compelling copy in seconds for social media, newsletters, or landing pages." },
      { title: "Creative Writing", text: "Get inspired by AI poems and mini-stories — perfect for greeting cards or gifts." },
      { title: "Branding & Names", text: "Find punchy taglines and slogans for your brand, product, or event." },
    ],
    errMin: "Please enter at least one word.",
    errMax: "Maximum 20 words allowed.",
    errApi: "Error generating. Please try again.",
    footer: "LISTINGWRITER · AI TEXT GENERATOR · PRIVACY · IMPRINT",
    dailyQuote: "PHILOSOPHY OF THE DAY",
    shareBtn: "SHARE",
  },
  it: {
    subtitle: "PAROLE → LINGUAGGIO · GENERATORE DI TESTI IA",
    tagline: "Inserisci parole — ricevi linguaggio che emoziona.",
    taglineSub: "Poesie · Testi vendita · Slogan · Storie · Biografie — tutto dalle tue parole chiave.",
    chooseMode: "SCEGLI TIPO DI TESTO",
    inputLabel: "LE TUE PAROLE (separate da virgola)",
    outputLang: "LINGUA DI OUTPUT",
    placeholder: "es. autunno, nostalgia, caffè, pioggia, casa",
    termCount: (n) => `${n} parol${n !== 1 ? "e" : "a"} · max. 20`,
    shortcut: "⌘↵ per generare",
    generate: (label) => `✦ Crea ${label}`,
    generating: "Generazione…",
    result: "RISULTATO",
    copy: "COPIA",
    copied: "✓ COPIATO",
    history: "CRONOLOGIA",
    tipsTitle: "Consigli per testi migliori",
    tips: ["Le parole emotive hanno più impatto", "I contrasti creano tensione", "Luoghi + atmosfere = magia", "3–7 parole è l'ideale"],
    useCasesTitle: "A cosa serve ListingWriter?",
    useCases: [
      { title: "Marketing & Pubblicità", text: "Crea copy convincenti in secondi per social media, newsletter o landing page." },
      { title: "Scrittura Creativa", text: "Lasciati ispirare da poesie e mini-storie IA — perfetto per biglietti o regali." },
      { title: "Branding & Nomi", text: "Trova tagline e slogan incisivi per il tuo marchio, prodotto o evento." },
    ],
    errMin: "Inserisci almeno una parola.",
    errMax: "Massimo 20 parole consentite.",
    errApi: "Errore durante la generazione. Riprova.",
    footer: "LISTINGWRITER · GENERATORE TESTI IA · PRIVACY · IMPRINT",
    dailyQuote: "FILOSOFIA DEL GIORNO",
    shareBtn: "CONDIVIDI",
  },
};

// ─── MODES ───────────────────────────────────────────────────────────────────
const MODES = {
  de: [
    { id: "poem",    label: "Gedicht",    icon: "✦", desc: "Poetischer, stimmungsvoller Text" },
    { id: "sales",   label: "Sales Copy", icon: "◈", desc: "Überzeugender Verkaufstext" },
    { id: "story",   label: "Mini-Story", icon: "◉", desc: "Kurze kreative Erzählung" },
    { id: "tagline", label: "Taglines",   icon: "⟡", desc: "5 prägnante Slogans" },
    { id: "bio",     label: "Bio / About",icon: "▣", desc: "Professionelle Kurzbiographie" },
  ],
  en: [
    { id: "poem",    label: "Poem",       icon: "✦", desc: "Poetic, atmospheric text" },
    { id: "sales",   label: "Sales Copy", icon: "◈", desc: "Persuasive sales text" },
    { id: "story",   label: "Mini-Story", icon: "◉", desc: "Short creative narrative" },
    { id: "tagline", label: "Taglines",   icon: "⟡", desc: "5 punchy slogans" },
    { id: "bio",     label: "Bio / About",icon: "▣", desc: "Professional short biography" },
  ],
  it: [
    { id: "poem",    label: "Poesia",     icon: "✦", desc: "Testo poetico e suggestivo" },
    { id: "sales",   label: "Sales Copy", icon: "◈", desc: "Testo di vendita persuasivo" },
    { id: "story",   label: "Mini-Storia",icon: "◉", desc: "Breve racconto creativo" },
    { id: "tagline", label: "Tagline",    icon: "⟡", desc: "5 slogan incisivi" },
    { id: "bio",     label: "Bio / About",icon: "▣", desc: "Breve biografia professionale" },
  ],
};

// ─── PROMPTS ──────────────────────────────────────────────────────────────────
const LANG_NAMES = { de: "Deutsch", en: "English", it: "Italiano" };

const buildPrompt = (modeId, words, outLang) => {
  const lang = LANG_NAMES[outLang];
  const w = words.join(", ");
  const prompts = {
    poem:    `Write a short, atmospheric poem (4–8 lines) based on these words: ${w}. Language: ${lang}. Only the poem, no title, no explanation.`,
    sales:   `Write a short, convincing sales text (3–5 sentences) for a product/offer related to these words: ${w}. Language: ${lang}. Direct, clear, with a benefit promise. Only the text, no headline.`,
    story:   `Write a short, gripping mini-story (4–6 sentences) that weaves in these words: ${w}. Language: ${lang}. Atmospheric and vivid. Only the story.`,
    tagline: `Create 5 short, memorable taglines/slogans (max. 8 words each) based on: ${w}. Language: ${lang}. Numbered, one per line. Only the taglines.`,
    bio:     `Write a professional, likeable short biography (3–4 sentences) for someone whose core themes are: ${w}. Language: ${lang}. Third person. Only the text.`,
  };
  return prompts[modeId];
};

// ─── DAILY QUOTES ─────────────────────────────────────────────────────────────
const QUOTES = [
  { de: { text: "Das Wort ist des Menschen einzige Medizin.", author: "Anton Tschechow" }, en: { text: "The word is man's only medicine.", author: "Anton Chekhov" }, it: { text: "La parola è l'unica medicina dell'uomo.", author: "Anton Čechov" } },
  { de: { text: "Sprache ist das Haus des Seins.", author: "Martin Heidegger" }, en: { text: "Language is the house of being.", author: "Martin Heidegger" }, it: { text: "Il linguaggio è la casa dell'essere.", author: "Martin Heidegger" } },
  { de: { text: "Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.", author: "Ludwig Wittgenstein" }, en: { text: "The limits of my language mean the limits of my world.", author: "Ludwig Wittgenstein" }, it: { text: "I limiti del mio linguaggio significano i limiti del mio mondo.", author: "Ludwig Wittgenstein" } },
  { de: { text: "Worte sind die mächtigste Droge, die die Menschheit kennt.", author: "Rudyard Kipling" }, en: { text: "Words are, of course, the most powerful drug used by mankind.", author: "Rudyard Kipling" }, it: { text: "Le parole sono la droga più potente usata dall'umanità.", author: "Rudyard Kipling" } },
  { de: { text: "Im Anfang war das Wort.", author: "Johannes 1:1" }, en: { text: "In the beginning was the Word.", author: "John 1:1" }, it: { text: "In principio era il Verbo.", author: "Giovanni 1:1" } },
  { de: { text: "Schreiben ist eine Art zu denken.", author: "Joan Didion" }, en: { text: "Writing is a way of thinking.", author: "Joan Didion" }, it: { text: "Scrivere è un modo di pensare.", author: "Joan Didion" } },
  { de: { text: "Wer die Sprache beherrscht, beherrscht die Gedanken.", author: "George Orwell" }, en: { text: "Who controls the language controls thought.", author: "George Orwell" }, it: { text: "Chi controlla il linguaggio controlla il pensiero.", author: "George Orwell" } },
  { de: { text: "Poesie ist das, was verloren geht, wenn man sie übersetzt.", author: "Robert Frost" }, en: { text: "Poetry is what gets lost in translation.", author: "Robert Frost" }, it: { text: "La poesia è ciò che si perde nella traduzione.", author: "Robert Frost" } },
  { de: { text: "Der Stil ist der Mensch selbst.", author: "Georges-Louis Buffon" }, en: { text: "The style is the man himself.", author: "Georges-Louis Buffon" }, it: { text: "Lo stile è l'uomo stesso.", author: "Georges-Louis Buffon" } },
  { de: { text: "Ich schreibe, also bin ich.", author: "Simone de Beauvoir" }, en: { text: "I write, therefore I am.", author: "Simone de Beauvoir" }, it: { text: "Scrivo, dunque sono.", author: "Simone de Beauvoir" } },
  { de: { text: "Dichten heißt: hinter dem Wort das Schweigen hörbar machen.", author: "Peter Handke" }, en: { text: "Writing poetry means making the silence behind the word audible.", author: "Peter Handke" }, it: { text: "Fare poesia significa rendere udibile il silenzio dietro la parola.", author: "Peter Handke" } },
  { de: { text: "Ein Schriftsteller ist jemand, für den Schreiben schwieriger ist als für andere Menschen.", author: "Thomas Mann" }, en: { text: "A writer is someone for whom writing is more difficult than for other people.", author: "Thomas Mann" }, it: { text: "Uno scrittore è qualcuno per cui scrivere è più difficile che per gli altri.", author: "Thomas Mann" } },
  { de: { text: "Wörter sind Fenster oder sie sind Mauern.", author: "Marshall B. Rosenberg" }, en: { text: "Words are windows, or they are walls.", author: "Marshall B. Rosenberg" }, it: { text: "Le parole sono finestre, oppure sono muri.", author: "Marshall B. Rosenberg" } },
  { de: { text: "Sprache ist die Kleidung der Gedanken.", author: "Samuel Johnson" }, en: { text: "Language is the dress of thought.", author: "Samuel Johnson" }, it: { text: "Il linguaggio è il vestito del pensiero.", author: "Samuel Johnson" } },
  { de: { text: "Das Schreiben bringt die Gedanken erst zur Klarheit.", author: "Johann Wolfgang von Goethe" }, en: { text: "Writing brings thoughts to clarity for the first time.", author: "Johann Wolfgang von Goethe" }, it: { text: "La scrittura porta i pensieri alla chiarezza per la prima volta.", author: "Johann Wolfgang von Goethe" } },
  { de: { text: "Die Musik beginnt dort, wo die Möglichkeiten der Sprache enden.", author: "Heinrich Heine" }, en: { text: "Music begins where the possibilities of language end.", author: "Heinrich Heine" }, it: { text: "La musica inizia dove finiscono le possibilità del linguaggio.", author: "Heinrich Heine" } },
  { de: { text: "Ein Gedicht ist nie fertig, es wird nur aufgegeben.", author: "Paul Valéry" }, en: { text: "A poem is never finished, only abandoned.", author: "Paul Valéry" }, it: { text: "Una poesia non è mai finita, viene solo abbandonata.", author: "Paul Valéry" } },
  { de: { text: "Tue Gutes und schreib darüber.", author: "Unbekannt" }, en: { text: "Do good and write about it.", author: "Unknown" }, it: { text: "Fa' del bene e scrivine.", author: "Sconosciuto" } },
  { de: { text: "Der erste Entwurf von allem ist Mist.", author: "Ernest Hemingway" }, en: { text: "The first draft of anything is garbage.", author: "Ernest Hemingway" }, it: { text: "La prima bozza di qualsiasi cosa è spazzatura.", author: "Ernest Hemingway" } },
  { de: { text: "Lesen ist träumen mit offenen Augen.", author: "Voltaire" }, en: { text: "Reading is dreaming with open eyes.", author: "Voltaire" }, it: { text: "Leggere è sognare ad occhi aperti.", author: "Voltaire" } },
  { de: { text: "Sprache ist nicht nur ein Werkzeug der Kommunikation, sondern der Gedanken selbst.", author: "Noam Chomsky" }, en: { text: "Language is not just a tool for communication, but for thought itself.", author: "Noam Chomsky" }, it: { text: "Il linguaggio non è solo uno strumento di comunicazione, ma del pensiero stesso.", author: "Noam Chomsky" } },
  { de: { text: "Das Wort ist das mächtigste Werkzeug des Menschen.", author: "Konfuzius" }, en: { text: "The word is the most powerful tool of man.", author: "Confucius" }, it: { text: "La parola è lo strumento più potente dell'uomo.", author: "Confucio" } },
  { de: { text: "Was du nicht in Worte fassen kannst, das kannst du nicht denken.", author: "Ludwig Wittgenstein" }, en: { text: "What you cannot express in words, you cannot think.", author: "Ludwig Wittgenstein" }, it: { text: "Ciò che non puoi esprimere in parole, non puoi pensarlo.", author: "Ludwig Wittgenstein" } },
  { de: { text: "Schreibe, was du weißt. Schreibe, was du kennst.", author: "Mark Twain" }, en: { text: "Write what you know. Write what you understand.", author: "Mark Twain" }, it: { text: "Scrivi ciò che sai. Scrivi ciò che conosci.", author: "Mark Twain" } },
  { de: { text: "Das Geheimnis des Könnens liegt im Wollen.", author: "Giuseppe Mazzini" }, en: { text: "The secret of ability lies in the will.", author: "Giuseppe Mazzini" }, it: { text: "Il segreto del saper fare sta nel voler fare.", author: "Giuseppe Mazzini" } },
  { de: { text: "Stille ist die Sprache Gottes, alles andere ist schlechte Übersetzung.", author: "Rumi" }, en: { text: "Silence is the language of God; everything else is a poor translation.", author: "Rumi" }, it: { text: "Il silenzio è il linguaggio di Dio; tutto il resto è una cattiva traduzione.", author: "Rumi" } },
  { de: { text: "Ein Dichter ist jemand, der Worte wie kein anderer anordnet.", author: "W. H. Auden" }, en: { text: "A poet is someone who arranges words like no one else.", author: "W. H. Auden" }, it: { text: "Un poeta è qualcuno che dispone le parole come nessun altro.", author: "W. H. Auden" } },
  { de: { text: "Jedes Wort war einmal ein Gedicht.", author: "Ralph Waldo Emerson" }, en: { text: "Every word was once a poem.", author: "Ralph Waldo Emerson" }, it: { text: "Ogni parola era una volta una poesia.", author: "Ralph Waldo Emerson" } },
  { de: { text: "Das einzige Mittel, die Sprache zu reinigen, ist die Poesie.", author: "T. S. Eliot" }, en: { text: "The only way to purify language is through poetry.", author: "T. S. Eliot" }, it: { text: "L'unico modo per purificare il linguaggio è attraverso la poesia.", author: "T. S. Eliot" } },
  { de: { text: "Wer keine Neugier hat, kann nichts schreiben.", author: "Graham Greene" }, en: { text: "If you have no curiosity, you can write nothing.", author: "Graham Greene" }, it: { text: "Chi non ha curiosità non può scrivere nulla.", author: "Graham Greene" } },
  { de: { text: "Alles Denken geschieht in Zeichen.", author: "Charles Sanders Peirce" }, en: { text: "All thinking takes place in signs.", author: "Charles Sanders Peirce" }, it: { text: "Tutto il pensiero avviene per segni.", author: "Charles Sanders Peirce" } },
  { de: { text: "Die Poesie ist Wahrheit in ihrer schönsten Form.", author: "Khalil Gibran" }, en: { text: "Poetry is truth in its finest garb.", author: "Khalil Gibran" }, it: { text: "La poesia è la verità nella sua forma più bella.", author: "Kahlil Gibran" } },
  { de: { text: "Worte können verletzen oder heilen — entscheide selbst.", author: "Dalai Lama" }, en: { text: "Words can hurt or heal — you choose.", author: "Dalai Lama" }, it: { text: "Le parole possono ferire o guarire — scegli tu.", author: "Dalai Lama" } },
  { de: { text: "Die Literatur ist das Gedächtnis der Menschheit.", author: "Isaac Bashevis Singer" }, en: { text: "Literature is the memory of humanity.", author: "Isaac Bashevis Singer" }, it: { text: "La letteratura è la memoria dell'umanità.", author: "Isaac Bashevis Singer" } },
  { de: { text: "Wer liest, lebt viele Leben. Wer nicht liest, lebt nur eines.", author: "George R. R. Martin" }, en: { text: "A reader lives a thousand lives. One who never reads lives only one.", author: "George R. R. Martin" }, it: { text: "Chi legge vive mille vite. Chi non legge ne vive solo una.", author: "George R. R. Martin" } },
  { de: { text: "Der Mensch ist ein Wesen, das Geschichten erzählt.", author: "Alasdair MacIntyre" }, en: { text: "Man is essentially a story-telling animal.", author: "Alasdair MacIntyre" }, it: { text: "L'uomo è essenzialmente un animale che racconta storie.", author: "Alasdair MacIntyre" } },
  { de: { text: "Schönheit liegt im Auge des Betrachters — und im Ohr des Zuhörers.", author: "Oscar Wilde" }, en: { text: "Beauty is in the eye of the beholder — and the ear of the listener.", author: "Oscar Wilde" }, it: { text: "La bellezza è negli occhi di chi guarda — e nelle orecchie di chi ascolta.", author: "Oscar Wilde" } },
  { de: { text: "Die einfachste Sprache ist oft die tiefste.", author: "Friedrich Nietzsche" }, en: { text: "The simplest language is often the deepest.", author: "Friedrich Nietzsche" }, it: { text: "Il linguaggio più semplice è spesso il più profondo.", author: "Friedrich Nietzsche" } },
  { de: { text: "Sprache ist Macht.", author: "Rosina Lippi-Green" }, en: { text: "Language is power.", author: "Rosina Lippi-Green" }, it: { text: "Il linguaggio è potere.", author: "Rosina Lippi-Green" } },
  { de: { text: "Wer schreibt, der bleibt.", author: "Deutsches Sprichwort" }, en: { text: "Who writes, remains.", author: "German proverb" }, it: { text: "Chi scrive, resta.", author: "Proverbio tedesco" } },
  { de: { text: "Das Wort ist das Bild des Gedankens.", author: "Aristoteles" }, en: { text: "The word is the image of the thought.", author: "Aristotle" }, it: { text: "La parola è l'immagine del pensiero.", author: "Aristotele" } },
  { de: { text: "Wenn du nicht weißt, was du schreibst, wirst du es beim Schreiben herausfinden.", author: "E. M. Forster" }, en: { text: "How do I know what I think until I see what I say?", author: "E. M. Forster" }, it: { text: "Come faccio a sapere cosa penso finché non vedo cosa dico?", author: "E. M. Forster" } },
  { de: { text: "Die Kunst des Schreibens ist die Kunst, das Überflüssige zu streichen.", author: "Anton Tschechow" }, en: { text: "The art of writing is the art of cutting out the superfluous.", author: "Anton Chekhov" }, it: { text: "L'arte della scrittura è l'arte di eliminare il superfluo.", author: "Anton Čechov" } },
  { de: { text: "Ein guter Schriftsteller hat mehr als einen Stil.", author: "Gore Vidal" }, en: { text: "A good writer has more than one style.", author: "Gore Vidal" }, it: { text: "Un buon scrittore ha più di uno stile.", author: "Gore Vidal" } },
  { de: { text: "Jede Sprache ist eine Weltansicht.", author: "Wilhelm von Humboldt" }, en: { text: "Every language is a view of the world.", author: "Wilhelm von Humboldt" }, it: { text: "Ogni lingua è una visione del mondo.", author: "Wilhelm von Humboldt" } },
  { de: { text: "Lesen bildet den ganzen Menschen.", author: "Francis Bacon" }, en: { text: "Reading makes a full man.", author: "Francis Bacon" }, it: { text: "La lettura forma l'uomo completo.", author: "Francis Bacon" } },
  { de: { text: "Die Poesie ist das Mutterland der Sprache.", author: "Novalis" }, en: { text: "Poetry is the mother tongue of language.", author: "Novalis" }, it: { text: "La poesia è la lingua madre del linguaggio.", author: "Novalis" } },
  { de: { text: "Bücher sind Spiegel: Man sieht in ihnen nur, was man schon in sich trägt.", author: "Carlos Ruiz Zafón" }, en: { text: "Books are mirrors: you only see in them what you already carry inside.", author: "Carlos Ruiz Zafón" }, it: { text: "I libri sono specchi: vi vedi solo ciò che porti già dentro di te.", author: "Carlos Ruiz Zafón" } },
  { de: { text: "Das Schweigen ist auch eine Antwort.", author: "Griechisches Sprichwort" }, en: { text: "Silence is also an answer.", author: "Greek proverb" }, it: { text: "Anche il silenzio è una risposta.", author: "Proverbio greco" } },
  { de: { text: "Schreiben ist die Malerei der Stimme.", author: "Voltaire" }, en: { text: "Writing is the painting of the voice.", author: "Voltaire" }, it: { text: "La scrittura è la pittura della voce.", author: "Voltaire" } },
  { de: { text: "Eine Sprache zu lernen bedeutet, eine neue Seele zu bekommen.", author: "Tschechisches Sprichwort" }, en: { text: "To learn a new language is to gain a new soul.", author: "Czech proverb" }, it: { text: "Imparare una nuova lingua significa acquisire una nuova anima.", author: "Proverbio ceco" } },
];

const getDailyQuoteFallback = () => {
  const day = Math.floor(Date.now() / 86400000);
  return QUOTES[day % QUOTES.length];
};

// ─── AD BANNER ────────────────────────────────────────────────────────────────
const AdBanner = ({ slot, size = "leaderboard" }) => {
  const sizes = { leaderboard: "w-full h-24", rectangle: "w-72 h-24", square: "w-48 h-48" };
  return (
    <div className={`${sizes[size]} bg-stone-100 border border-stone-200 rounded flex items-center justify-center text-stone-400 text-xs tracking-widest uppercase font-mono`}>
      {/* Replace with: <ins className="adsbygoogle" data-ad-client="ca-pub-XXXXXX" data-ad-slot={slot} /> */}
      Advertisement · {slot}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ListingWriter() {
  const [uiLang, setUiLang]       = useState("de");
  const [outLang, setOutLang]     = useState("de");
  const [input, setInput]         = useState("");
  const [mode, setMode]           = useState("poem");
  const [result, setResult]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [copied, setCopied]       = useState(false);
  const [shared, setShared]       = useState(false);
  const [history, setHistory]     = useState([]);
  const [aiQuote, setAiQuote]     = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const resultRef = useRef(null);

  const t = T[uiLang];
  const modes = MODES[uiLang];
  const currentMode = modes.find((m) => m.id === mode);

  // Daily quote: use date as seed so it's stable for all users that day
  const todayStr = new Date().toISOString().slice(0, 10); // "2025-05-28"

  useEffect(() => {
    const cacheKey = `ww_quote_${todayStr}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try { setAiQuote(JSON.parse(cached)); setQuoteLoading(false); return; } catch {}
    }
    setQuoteLoading(true);
    const prompt = `Generate one short philosophical quote (max 20 words) about language, words, writing, or creativity. It must be an ACTUAL real quote from a real philosopher, author, poet, or thinker — not invented. Respond ONLY with valid JSON, no markdown, no backticks, no explanation. Format: {"de":"...","en":"...","it":"...","author":"Name (original language label)"}`;
    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
      .then(r => r.json())
      .then(data => {
        const raw = data.content?.map(c => c.text || "").join("").trim();
        const parsed = JSON.parse(raw);
        sessionStorage.setItem(cacheKey, JSON.stringify(parsed));
        setAiQuote(parsed);
      })
      .catch(() => setAiQuote(null))
      .finally(() => setQuoteLoading(false));
  }, [todayStr]);

  const dailyQuote = aiQuote
    ? { text: aiQuote[uiLang] || aiQuote.en, author: aiQuote.author }
    : getDailyQuoteFallback()[uiLang];

  // keep mode id stable when switching UI language
  useEffect(() => {
    const ids = modes.map(m => m.id);
    if (!ids.includes(mode)) setMode("poem");
  }, [uiLang]);

  const parseWords = (raw) =>
    raw.split(/[\s,;]+/).map(w => w.trim()).filter(w => w.length > 0);

  const generate = async () => {
    const words = parseWords(input);
    if (words.length < 1) { setError(t.errMin); return; }
    if (words.length > 20) { setError(t.errMax); return; }
    setError(""); setLoading(true); setResult("");
    const promptText = buildPrompt(mode, words, outLang);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      setResult(text);
      setHistory(prev => [
        { mode: currentMode.label, words: words.slice(0, 3).join(", ") + (words.length > 3 ? "…" : ""), text, outLang },
        ...prev.slice(0, 4),
      ]);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    } catch {
      setError(t.errApi);
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = () => {
    if (navigator.share) {
      navigator.share({ title: "ListingWriter", text: result });
    } else {
      navigator.clipboard.writeText(result);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const langFlags = { de: "🇩🇪", en: "🇬🇧", it: "🇮🇹" };
  const langLabels = { de: "DE", en: "EN", it: "IT" };

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", background: "#faf9f7", minHeight: "100vh", color: "#1a1714" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inconsolata:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#faf9f7;}
        .playfair{font-family:'Playfair Display',serif;}
        .mono{font-family:'Inconsolata',monospace;}
        .fade-in{animation:fadeIn 0.5s ease forwards;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .shimmer{background:linear-gradient(90deg,#e8e4de 25%,#f5f2ee 50%,#e8e4de 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .mode-btn{border:1.5px solid #d4cfc8;background:white;cursor:pointer;border-radius:6px;padding:10px 14px;transition:all 0.18s;text-align:left;}
        .mode-btn:hover{border-color:#8b7355;background:#fdf8f3;}
        .mode-btn.active{border-color:#8b7355;background:#fdf3e7;}
        .gen-btn{background:#2c1810;color:#f5ede3;border:none;cursor:pointer;font-family:'Inconsolata',monospace;font-size:15px;font-weight:600;letter-spacing:0.08em;padding:14px 32px;border-radius:4px;transition:all 0.2s;}
        .gen-btn:hover:not(:disabled){background:#4a2c1a;transform:translateY(-1px);}
        .gen-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .icon-btn{background:transparent;border:1.5px solid #8b7355;color:#8b7355;cursor:pointer;font-family:'Inconsolata',monospace;font-size:12px;letter-spacing:0.1em;padding:6px 14px;border-radius:3px;transition:all 0.15s;}
        .icon-btn:hover{background:#8b7355;color:white;}
        textarea{font-family:'Georgia',serif;font-size:15px;line-height:1.6;border:1.5px solid #d4cfc8;border-radius:6px;padding:14px;width:100%;resize:vertical;background:white;color:#1a1714;outline:none;transition:border-color 0.2s;}
        textarea:focus{border-color:#8b7355;}
        .hist-item{border-left:2px solid #d4cfc8;padding:8px 12px;cursor:pointer;transition:border-color 0.15s;}
        .hist-item:hover{border-color:#8b7355;}
        .lang-toggle{display:flex;gap:0;border:1.5px solid #d4cfc8;border-radius:4px;overflow:hidden;}
        .lang-btn{background:white;border:none;cursor:pointer;padding:6px 12px;font-family:'Inconsolata',monospace;font-size:13px;letter-spacing:0.05em;transition:all 0.15s;display:flex;align-items:center;gap:4px;}
        .lang-btn.active{background:#2c1810;color:#f5ede3;}
        .lang-btn:not(.active):hover{background:#fdf3e7;}
        .quote-box{background:linear-gradient(135deg,#fdf3e7 0%,#faf9f7 100%);border:1px solid #e8dfd4;border-left:3px solid #8b7355;border-radius:6px;padding:18px 20px;margin-bottom:28px;}
      `}</style>

      {/* Header */}
      <header style={{ borderBottom:"1px solid #e4dfd7", padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"white" }}>
        <div>
          <h1 className="playfair" style={{ fontSize:26, fontWeight:700, letterSpacing:"-0.01em", color:"#2c1810" }}>
            Word<em>Weaver</em>
          </h1>
          <p className="mono" style={{ fontSize:11, color:"#a09080", letterSpacing:"0.12em", marginTop:2 }}>
            {t.subtitle}
          </p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          {/* UI Language Switcher */}
          <div className="lang-toggle">
            {["de","en","it"].map(l => (
              <button key={l} className={`lang-btn ${uiLang === l ? "active" : ""}`} onClick={() => setUiLang(l)}>
                <span>{langFlags[l]}</span>
                <span>{langLabels[l]}</span>
              </button>
            ))}
          </div>
          <AdBanner slot="top-banner" size="rectangle" />
        </div>
      </header>

      <main style={{ maxWidth:900, margin:"0 auto", padding:"32px 20px" }}>

        {/* Top Ad */}
        <div style={{ marginBottom:28, display:"flex", justifyContent:"center" }}>
          <AdBanner slot="header-leaderboard" />
        </div>

        {/* Etsy Tool Promo */}
        <a href="/etsy-listing-generator" style={{ textDecoration:"none", display:"block", marginBottom:28 }}>
          <div style={{ background:"linear-gradient(135deg,#e8f5ee 0%,#f0faf5 100%)", border:"1.5px solid #b5dcc7", borderRadius:8, padding:"16px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", transition:"box-shadow 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow="0 2px 12px rgba(44,122,75,0.15)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow="none"}
          >
            <div>
              <p style={{ fontFamily:"'Inconsolata',monospace", fontSize:10, letterSpacing:"0.15em", color:"#2c7a4b", marginBottom:4 }}>NEUES TOOL</p>
              <p className="playfair" style={{ fontSize:16, color:"#1a4a2e", fontWeight:700 }}>🛍️ Etsy Listing Generator</p>
              <p style={{ fontSize:13, color:"#2c5a3a", marginTop:3 }}>SEO-Titel · 13 Tags · Beschreibung — in Sekunden</p>
            </div>
            <span style={{ fontFamily:"'Inconsolata',monospace", fontSize:13, color:"#2c7a4b", fontWeight:600 }}>Jetzt testen →</span>
          </div>
        </a>

        {/* Daily Quote */}
        <div className="quote-box fade-in">
          <p className="mono" style={{ fontSize:10, letterSpacing:"0.15em", color:"#a09080", marginBottom:8 }}>{t.dailyQuote}</p>
          {quoteLoading ? (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div className="shimmer" style={{ height:14, width:"85%", borderRadius:3 }} />
              <div className="shimmer" style={{ height:14, width:"60%", borderRadius:3 }} />
              <div className="shimmer" style={{ height:11, width:"30%", borderRadius:3, marginTop:2 }} />
            </div>
          ) : (
            <>
              <p className="playfair" style={{ fontSize:15, fontStyle:"italic", color:"#2c1810", lineHeight:1.7 }}>
                „{dailyQuote.text}"
              </p>
              <p className="mono" style={{ fontSize:11, color:"#8b7355", marginTop:6 }}>— {dailyQuote.author}</p>
            </>
          )}
        </div>

        {/* Intro */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <h2 className="playfair" style={{ fontSize:22, fontStyle:"italic", color:"#5c4a38", marginBottom:8 }}>
            {t.tagline}
          </h2>
          <p style={{ fontSize:14, color:"#8a7868", lineHeight:1.7 }}>{t.taglineSub}</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:28 }}>
          {/* Main Panel */}
          <div>
            {/* Mode Selection */}
            <div style={{ marginBottom:20 }}>
              <p className="mono" style={{ fontSize:11, letterSpacing:"0.12em", color:"#a09080", marginBottom:10 }}>
                {t.chooseMode}
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {modes.map(m => (
                  <button key={m.id} className={`mode-btn ${mode === m.id ? "active" : ""}`} onClick={() => setMode(m.id)}>
                    <span className="mono" style={{ fontSize:13, fontWeight:600, display:"block", color: mode === m.id ? "#8b7355" : "#2c1810" }}>
                      {m.icon} {m.label}
                    </span>
                    <span style={{ fontSize:12, color:"#a09080", marginTop:2, display:"block" }}>{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Row */}
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <p className="mono" style={{ fontSize:11, letterSpacing:"0.12em", color:"#a09080" }}>{t.inputLabel}</p>
              </div>
              <textarea
                rows={3}
                placeholder={t.placeholder}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && e.metaKey) generate(); }}
              />
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                <span style={{ fontSize:11, color:"#b0a898" }}>{t.termCount(parseWords(input).length)}</span>
                <span style={{ fontSize:11, color:"#b0a898" }}>{t.shortcut}</span>
              </div>
            </div>

            {/* Output Language */}
            <div style={{ marginBottom:20 }}>
              <p className="mono" style={{ fontSize:11, letterSpacing:"0.12em", color:"#a09080", marginBottom:8 }}>{t.outputLang}</p>
              <div className="lang-toggle" style={{ display:"inline-flex" }}>
                {["de","en","it"].map(l => (
                  <button key={l} className={`lang-btn ${outLang === l ? "active" : ""}`} onClick={() => setOutLang(l)}>
                    <span>{langFlags[l]}</span>
                    <span>{langLabels[l]}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p style={{ color:"#b34a2a", fontSize:13, marginBottom:12, padding:"8px 12px", background:"#fdf0ec", borderRadius:4, borderLeft:"3px solid #b34a2a" }}>
                {error}
              </p>
            )}

            <button className="gen-btn" onClick={generate} disabled={loading}>
              {loading ? t.generating : t.generate(currentMode.label)}
            </button>

            {/* Result */}
            {(loading || result) && (
              <div ref={resultRef} className="fade-in" style={{ marginTop:28 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <p className="mono" style={{ fontSize:11, letterSpacing:"0.12em", color:"#a09080" }}>{t.result}</p>
                  {result && !loading && (
                    <div style={{ display:"flex", gap:8 }}>
                      <button className="icon-btn" onClick={copyText}>{copied ? t.copied : t.copy}</button>
                      <button className="icon-btn" onClick={shareText}>{shared ? "✓" : t.shareBtn}</button>
                    </div>
                  )}
                </div>
                <div style={{ background:"white", border:"1.5px solid #e4dfd7", borderRadius:8, padding:"24px 28px", minHeight:120 }}>
                  {loading ? (
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {[100,80,90,60].map((w,i) => (
                        <div key={i} className="shimmer" style={{ height:16, width:`${w}%`, borderRadius:3 }} />
                      ))}
                    </div>
                  ) : (
                    <p className="playfair" style={{ fontSize:16, lineHeight:1.85, color:"#2c1810", whiteSpace:"pre-wrap" }}>
                      {result}
                    </p>
                  )}
                </div>
                {result && !loading && (
                  <div style={{ marginTop:20, display:"flex", justifyContent:"center" }}>
                    <AdBanner slot="after-result" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <AdBanner slot="sidebar-top" size="square" />

            {history.length > 0 && (
              <div>
                <p className="mono" style={{ fontSize:11, letterSpacing:"0.12em", color:"#a09080", marginBottom:10 }}>{t.history}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {history.map((h,i) => (
                    <div key={i} className="hist-item" onClick={() => setResult(h.text)}>
                      <span className="mono" style={{ fontSize:11, color:"#8b7355", display:"block" }}>
                        {h.mode} · {langFlags[h.outLang]}
                      </span>
                      <span style={{ fontSize:12, color:"#5c4a38", display:"block", marginTop:2 }}>{h.words}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background:"#fdf8f3", border:"1px solid #e8dfd4", borderRadius:8, padding:16 }}>
              <p className="playfair" style={{ fontSize:14, fontStyle:"italic", color:"#5c4a38", marginBottom:10 }}>{t.tipsTitle}</p>
              {t.tips.map((tip,i) => (
                <p key={i} style={{ fontSize:12, color:"#8a7868", marginBottom:6, paddingLeft:12, borderLeft:"2px solid #d4cfc8" }}>{tip}</p>
              ))}
            </div>

            <AdBanner slot="sidebar-bottom" size="square" />
          </div>
        </div>

        {/* Use Cases */}
        <div style={{ marginTop:48, borderTop:"1px solid #e4dfd7", paddingTop:36 }}>
          <h3 className="playfair" style={{ fontSize:20, color:"#2c1810", marginBottom:20, textAlign:"center" }}>
            {t.useCasesTitle}
          </h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
            {t.useCases.map((c,i) => (
              <div key={i} style={{ background:"white", border:"1px solid #e4dfd7", borderRadius:8, padding:20 }}>
                <h4 className="playfair" style={{ fontSize:15, color:"#2c1810", marginBottom:8 }}>{c.title}</h4>
                <p style={{ fontSize:13, color:"#8a7868", lineHeight:1.7 }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Ad */}
        <div style={{ marginTop:32, display:"flex", justifyContent:"center" }}>
          <AdBanner slot="footer-leaderboard" />
        </div>
      </main>

      <footer style={{ borderTop:"1px solid #e4dfd7", padding:"20px 24px", textAlign:"center", marginTop:20 }}>
        <p className="mono" style={{ fontSize:11, color:"#b0a898", letterSpacing:"0.1em" }}>
          {t.footer}
        </p>
      </footer>
    </div>
  );
}
