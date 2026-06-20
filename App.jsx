import { useState, useEffect, useRef } from "react";

// ─── TEXT ────────────────────────────────────────────────────────────────────
const T = {
  subtitle: "WORDS → LANGUAGE · AI TEXT GENERATOR",
  tagline: "Enter words — receive language that moves.",
  taglineSub: "Poems · Sales Copy · Slogans · Stories · Biographies — all from your keywords.",
  chooseMode: "CHOOSE TEXT TYPE",
  inputLabel: "YOUR WORDS (comma-separated)",
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
};

// ─── MODES ───────────────────────────────────────────────────────────────────
const MODES = [
  { id: "poem",    label: "Poem",       icon: "✦", desc: "Poetic, atmospheric text" },
  { id: "sales",   label: "Sales Copy", icon: "◈", desc: "Persuasive sales text" },
  { id: "story",   label: "Mini-Story", icon: "◉", desc: "Short creative narrative" },
  { id: "tagline", label: "Taglines",   icon: "⟡", desc: "5 punchy slogans" },
  { id: "bio",     label: "Bio / About",icon: "▣", desc: "Professional short biography" },
];

// ─── PROMPTS ──────────────────────────────────────────────────────────────────
const buildPrompt = (modeId, words) => {
  const w = words.join(", ");
  const prompts = {
    poem:    `Write a short, atmospheric poem (4–8 lines) based on these words: ${w}. Language: English. Only the poem, no title, no explanation.`,
    sales:   `Write a short, convincing sales text (3–5 sentences) for a product/offer related to these words: ${w}. Language: English. Direct, clear, with a benefit promise. Only the text, no headline.`,
    story:   `Write a short, gripping mini-story (4–6 sentences) that weaves in these words: ${w}. Language: English. Atmospheric and vivid. Only the story.`,
    tagline: `Create 5 short, memorable taglines/slogans (max. 8 words each) based on: ${w}. Language: English. Numbered, one per line. Only the taglines.`,
    bio:     `Write a professional, likeable short biography (3–4 sentences) for someone whose core themes are: ${w}. Language: English. Third person. Only the text.`,
  };
  return prompts[modeId];
};

// ─── DAILY QUOTES ─────────────────────────────────────────────────────────────
const QUOTES = [
  { text: "The word is man's only medicine.", author: "Anton Chekhov" },
  { text: "Language is the house of being.", author: "Martin Heidegger" },
  { text: "The limits of my language mean the limits of my world.", author: "Ludwig Wittgenstein" },
  { text: "Words are, of course, the most powerful drug used by mankind.", author: "Rudyard Kipling" },
  { text: "In the beginning was the Word.", author: "John 1:1" },
  { text: "Writing is a way of thinking.", author: "Joan Didion" },
  { text: "Who controls the language controls thought.", author: "George Orwell" },
  { text: "Poetry is what gets lost in translation.", author: "Robert Frost" },
  { text: "The style is the man himself.", author: "Georges-Louis Buffon" },
  { text: "I write, therefore I am.", author: "Simone de Beauvoir" },
  { text: "Writing poetry means making the silence behind the word audible.", author: "Peter Handke" },
  { text: "A writer is someone for whom writing is more difficult than for other people.", author: "Thomas Mann" },
  { text: "Words are windows, or they are walls.", author: "Marshall B. Rosenberg" },
  { text: "Language is the dress of thought.", author: "Samuel Johnson" },
  { text: "Writing brings thoughts to clarity for the first time.", author: "Johann Wolfgang von Goethe" },
  { text: "Music begins where the possibilities of language end.", author: "Heinrich Heine" },
  { text: "A poem is never finished, only abandoned.", author: "Paul Valéry" },
  { text: "Do good and write about it.", author: "Unknown" },
  { text: "The first draft of anything is garbage.", author: "Ernest Hemingway" },
  { text: "Reading is dreaming with open eyes.", author: "Voltaire" },
  { text: "Language is not just a tool for communication, but for thought itself.", author: "Noam Chomsky" },
  { text: "The word is the most powerful tool of man.", author: "Confucius" },
  { text: "What you cannot express in words, you cannot think.", author: "Ludwig Wittgenstein" },
  { text: "Write what you know. Write what you understand.", author: "Mark Twain" },
  { text: "The secret of ability lies in the will.", author: "Giuseppe Mazzini" },
  { text: "Silence is the language of God; everything else is a poor translation.", author: "Rumi" },
  { text: "A poet is someone who arranges words like no one else.", author: "W. H. Auden" },
  { text: "Every word was once a poem.", author: "Ralph Waldo Emerson" },
  { text: "The only way to purify language is through poetry.", author: "T. S. Eliot" },
  { text: "If you have no curiosity, you can write nothing.", author: "Graham Greene" },
  { text: "All thinking takes place in signs.", author: "Charles Sanders Peirce" },
  { text: "Poetry is truth in its finest garb.", author: "Khalil Gibran" },
  { text: "Words can hurt or heal — you choose.", author: "Dalai Lama" },
  { text: "Literature is the memory of humanity.", author: "Isaac Bashevis Singer" },
  { text: "A reader lives a thousand lives. One who never reads lives only one.", author: "George R. R. Martin" },
  { text: "Man is essentially a story-telling animal.", author: "Alasdair MacIntyre" },
  { text: "Beauty is in the eye of the beholder — and the ear of the listener.", author: "Oscar Wilde" },
  { text: "The simplest language is often the deepest.", author: "Friedrich Nietzsche" },
  { text: "Language is power.", author: "Rosina Lippi-Green" },
  { text: "Who writes, remains.", author: "German proverb" },
  { text: "The word is the image of the thought.", author: "Aristotle" },
  { text: "How do I know what I think until I see what I say?", author: "E. M. Forster" },
  { text: "The art of writing is the art of cutting out the superfluous.", author: "Anton Chekhov" },
  { text: "A good writer has more than one style.", author: "Gore Vidal" },
  { text: "Every language is a view of the world.", author: "Wilhelm von Humboldt" },
  { text: "Reading makes a full man.", author: "Francis Bacon" },
  { text: "Poetry is the mother tongue of language.", author: "Novalis" },
  { text: "Books are mirrors: you only see in them what you already carry inside.", author: "Carlos Ruiz Zafón" },
  { text: "Silence is also an answer.", author: "Greek proverb" },
  { text: "Writing is the painting of the voice.", author: "Voltaire" },
  { text: "To learn a new language is to gain a new soul.", author: "Czech proverb" },
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

  const t = T;
  const modes = MODES;
  const currentMode = modes.find((m) => m.id === mode);

  // Daily quote: use date as seed so it's stable for all users that day
  const todayStr = new Date().toISOString().slice(0, 10); // "2025-05-28"

  useEffect(() => {
    const cacheKey = `lw_quote_${todayStr}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try { setAiQuote(JSON.parse(cached)); setQuoteLoading(false); return; } catch {}
    }
    setQuoteLoading(true);
    const prompt = `Generate one short philosophical quote (max 20 words) about language, words, writing, or creativity. It must be an ACTUAL real quote from a real philosopher, author, poet, or thinker — not invented. Respond ONLY with valid JSON, no markdown, no backticks, no explanation. Format: {"text":"...","author":"Name"}`;
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
    ? { text: aiQuote.text, author: aiQuote.author }
    : getDailyQuoteFallback();

  const parseWords = (raw) =>
    raw.split(/[\s,;]+/).map(w => w.trim()).filter(w => w.length > 0);

  const generate = async () => {
    const words = parseWords(input);
    if (words.length < 1) { setError(t.errMin); return; }
    if (words.length > 20) { setError(t.errMax); return; }
    setError(""); setLoading(true); setResult("");
    const promptText = buildPrompt(mode, words);
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
        { mode: currentMode.label, words: words.slice(0, 3).join(", ") + (words.length > 3 ? "…" : ""), text },
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

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", background: "#f0ece4", minHeight: "100vh", color: "#1a1714" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inconsolata:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#f0ece4;}
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
        .quote-box{background:linear-gradient(135deg,#fdf3e7 0%,#f0ece4 100%);border:1px solid #e8dfd4;border-left:3px solid #8b7355;border-radius:6px;padding:18px 20px;margin-bottom:28px;}
      `}</style>

      {/* Header */}
      <header style={{ borderBottom:"1px solid #e4dfd7", padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#f7f4ee" }}>
        <div>
          <h1 className="playfair" style={{ fontSize:26, fontWeight:700, letterSpacing:"-0.01em", color:"#2c1810" }}>
            Listing<em>Writer</em>
          </h1>
          <p className="mono" style={{ fontSize:11, color:"#a09080", letterSpacing:"0.12em", marginTop:2 }}>
            {t.subtitle}
          </p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
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
          <div style={{ background:"linear-gradient(135deg,#dceee2 0%,#e6f2ea 100%)", border:"1.5px solid #b5dcc7", borderRadius:8, padding:"16px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", transition:"box-shadow 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow="0 2px 12px rgba(44,122,75,0.15)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow="none"}
          >
            <div>
              <p style={{ fontFamily:"'Inconsolata',monospace", fontSize:10, letterSpacing:"0.15em", color:"#2c7a4b", marginBottom:4 }}>NEW TOOL</p>
              <p className="playfair" style={{ fontSize:16, color:"#1a4a2e", fontWeight:700 }}>🛍️ Etsy Listing Generator</p>
              <p style={{ fontSize:13, color:"#2c5a3a", marginTop:3 }}>SEO title · 13 tags · description — in seconds</p>
            </div>
            <span style={{ fontFamily:"'Inconsolata',monospace", fontSize:13, color:"#2c7a4b", fontWeight:600 }}>Try it now →</span>
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
                        {h.mode}
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
