import { useState, useRef, useEffect } from "react";

// ─── SEO HEAD ─────────────────────────────────────────────────────────────────
const SEO_META = {
  title: "Etsy Listing Generator – KI-Tool für Titel, Tags & Beschreibung",
  description:
    "Erstelle in Sekunden optimierte Etsy-Listings: SEO-Titel, alle 13 Tags und eine verkaufsstarke Beschreibung – kostenlos, KI-gestützt.",
};

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inconsolata:wght@400;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#faf9f7;}
  .playfair{font-family:'Playfair Display',serif;}
  .mono{font-family:'Inconsolata',monospace;}
  .fade-in{animation:fadeIn 0.5s ease forwards;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .shimmer{background:linear-gradient(90deg,#e8e4de 25%,#f5f2ee 50%,#e8e4de 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  .gen-btn{background:#2c7a4b;color:#f5ede3;border:none;cursor:pointer;font-family:'Inconsolata',monospace;font-size:15px;font-weight:600;letter-spacing:0.08em;padding:14px 32px;border-radius:4px;transition:all 0.2s;width:100%;}
  .gen-btn:hover:not(:disabled){background:#235f3a;transform:translateY(-1px);}
  .gen-btn:disabled{opacity:0.5;cursor:not-allowed;}
  .icon-btn{background:transparent;border:1.5px solid #2c7a4b;color:#2c7a4b;cursor:pointer;font-family:'Inconsolata',monospace;font-size:12px;letter-spacing:0.1em;padding:6px 14px;border-radius:3px;transition:all 0.15s;}
  .icon-btn:hover{background:#2c7a4b;color:white;}
  textarea,input[type=text]{font-family:'Georgia',serif;font-size:15px;line-height:1.6;border:1.5px solid #d4cfc8;border-radius:6px;padding:12px 14px;width:100%;resize:vertical;background:white;color:#1a1714;outline:none;transition:border-color 0.2s;}
  textarea:focus,input[type=text]:focus{border-color:#2c7a4b;}
  .tag-chip{display:inline-block;background:#e8f5ee;border:1px solid #b5dcc7;color:#1a4a2e;border-radius:20px;padding:4px 12px;font-size:12px;font-family:'Inconsolata',monospace;margin:3px;}
  .section-box{background:white;border:1px solid #e4dfd7;border-radius:8px;padding:20px 24px;margin-bottom:16px;}
  .affiliate-box{background:#f0faf5;border:1px solid #b5dcc7;border-left:3px solid #2c7a4b;border-radius:6px;padding:16px 20px;margin-top:8px;}
  .affiliate-link{color:#2c7a4b;text-decoration:none;font-weight:600;border-bottom:1px solid #2c7a4b;}
  .affiliate-link:hover{color:#1a4a2e;}
  .breadcrumb{font-family:'Inconsolata',monospace;font-size:11px;color:#a09080;letter-spacing:0.1em;}
  .breadcrumb a{color:#8b7355;text-decoration:none;}
  .breadcrumb a:hover{text-decoration:underline;}
  .faq-item{border-bottom:1px solid #e4dfd7;padding:16px 0;}
  .faq-item:last-child{border-bottom:none;}
  .faq-q{font-weight:600;color:#2c1810;font-size:15px;margin-bottom:8px;}
  .faq-a{color:#5c4a38;font-size:14px;line-height:1.7;}
`;

// ─── CATEGORY OPTIONS ────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "print", label: "🖼️ Print / Poster / Digital Art" },
  { value: "jewelry", label: "💍 Schmuck / Jewelry" },
  { value: "clothing", label: "👕 Kleidung / Clothing" },
  { value: "home", label: "🏠 Wohnen / Home Decor" },
  { value: "stationery", label: "📝 Papeterie / Stationery" },
  { value: "craft", label: "✂️ Handgemacht / Handmade Craft" },
  { value: "digital", label: "💾 Digitales Produkt / Digital Download" },
  { value: "vintage", label: "🕰️ Vintage" },
];

// ─── BUILD PROMPT ─────────────────────────────────────────────────────────────
const buildEtsyPrompt = (productDesc, category, keywords, language) => {
  const langName = language === "de" ? "German" : language === "it" ? "Italian" : "English";
  const kw = keywords ? keywords.substring(0, 100) : "none";
  const desc = productDesc.substring(0, 200);
  return `Etsy SEO expert. Create listing in ${langName} for: ${desc}. Category: ${category}. Keywords: ${kw}. Return ONLY JSON: {"title":"140 char SEO title","tags":["t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11","t12","t13"],"description":"3 paragraphs 150 words","seoTips":["tip1","tip2","tip3"]}. Exactly 13 tags max 20 chars each. No markdown backticks.`;
};

// ─── FAQ CONTENT ──────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: "Wie viele Tags sollte ein Etsy-Listing haben?",
    a: "Etsy erlaubt genau 13 Tags pro Listing. Du solltest immer alle 13 ausschöpfen — jeder Tag ist eine zusätzliche Chance, in der Etsy-Suche gefunden zu werden. Verwende eine Mischung aus breiten Begriffen (z.B. 'watercolor print') und spezifischen Long-Tail-Tags (z.B. 'italian village watercolor').",
  },
  {
    q: "Wie lang sollte ein Etsy-Titel sein?",
    a: "Etsy erlaubt bis zu 140 Zeichen. Experten empfehlen, die wichtigsten Keywords ganz am Anfang zu platzieren, da Etsy nur die ersten ~55 Zeichen in den Suchergebnissen anzeigt. Trenne Keyword-Gruppen mit Kommas oder Bindestrichen.",
  },
  {
    q: "Was macht eine gute Etsy-Beschreibung aus?",
    a: "Eine erfolgreiche Beschreibung beginnt mit einem emotionalen Hook (warum ist dieses Produkt besonders?), gefolgt von konkreten Produktdetails (Maße, Material, Technik) und endet mit einem klaren Call-to-Action plus Infos zu Versand und Pflege. Die ersten 160 Zeichen sind besonders wichtig, da sie in Google-Suchergebnissen erscheinen.",
  },
  {
    q: "Wie verbessere ich mein Etsy SEO?",
    a: "Die wichtigsten Hebel: (1) Keywords im Titel, Tags UND Beschreibung verwenden, (2) regelmäßig neue Listings hinzufügen, (3) Fotos optimieren mit Alt-Text, (4) Kundenbewertungen sammeln, (5) Etsy Ads für neue Listings testen. Tools wie eRank oder Marmalead helfen dir, Suchvolumen und Konkurrenz für Keywords zu analysieren.",
  },
  {
    q: "Ist dieser Generator kostenlos?",
    a: "Ja, der Etsy Listing Generator ist kostenlos nutzbar. Du kannst täglich mehrere Listings generieren lassen.",
  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function EtsyListingGenerator() {
  const [productDesc, setProductDesc] = useState("");
  const [category, setCategory] = useState("print");
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState("");
  const resultRef = useRef(null);

  // Update document title for SEO
  useEffect(() => {
    document.title = SEO_META.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", SEO_META.description);
  }, []);

  const generate = async () => {
    if (!productDesc.trim()) {
      setError("Bitte beschreibe dein Produkt.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    const prompt = buildEtsyPrompt(productDesc, category, keywords, language);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      const raw = (data.content?.map((c) => c.text || "").join("") || "").trim();
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found: " + cleaned.substring(0, 200));
      const parsed = JSON.parse(jsonMatch[0]);
      setResult(parsed);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setError("Fehler: " + (err.message || "Unbekannt"));
    } finally {
      setLoading(false);
    }
  };

  const copyField = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const langFlags = { de: "🇩🇪", en: "🇬🇧", it: "🇮🇹" };

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", background: "#faf9f7", minHeight: "100vh", color: "#1a1714" }}>
      <style>{SHARED_STYLES}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #e4dfd7", padding: "18px 24px", background: "white" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <a href="/" style={{ textDecoration: "none" }}>
              <h1 className="playfair" style={{ fontSize: 22, fontWeight: 700, color: "#2c1810" }}>
                Word<em>Weaver</em>
              </h1>
            </a>
            <p className="mono" style={{ fontSize: 10, color: "#a09080", letterSpacing: "0.12em", marginTop: 2 }}>
              ETSY LISTING GENERATOR
            </p>
          </div>
          <a href="/" className="icon-btn" style={{ fontSize: 11 }}>← Zur Hauptseite</a>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px" }}>

        {/* Breadcrumb */}
        <p className="breadcrumb" style={{ marginBottom: 20 }}>
          <a href="/">WordWeaver</a> › Etsy Listing Generator
        </p>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 className="playfair" style={{ fontSize: 28, color: "#2c1810", marginBottom: 10 }}>
            Etsy Listing Generator
          </h2>
          <p style={{ fontSize: 15, color: "#5c4a38", lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
            Generiere in Sekunden einen <strong>SEO-optimierten Titel</strong>, alle <strong>13 Tags</strong> und eine 
            verkaufsstarke <strong>Beschreibung</strong> für dein Etsy-Listing — kostenlos, KI-gestützt.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 24 }}>

          {/* Left: Form */}
          <div>
            {/* Product Description */}
            <div style={{ marginBottom: 18 }}>
              <label className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#a09080", display: "block", marginBottom: 8 }}>
                PRODUKTBESCHREIBUNG *
              </label>
              <textarea
                rows={4}
                placeholder="z.B. Aquarell-Poster eines kleinen italienischen Bergdorfes, handgemalt, A4 Digitaldruck, warme Erdtöne"
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: 18 }}>
              <label className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#a09080", display: "block", marginBottom: 8 }}>
                KATEGORIE
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #d4cfc8", borderRadius: 6, background: "white", fontSize: 14, color: "#1a1714", outline: "none" }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Keywords */}
            <div style={{ marginBottom: 18 }}>
              <label className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#a09080", display: "block", marginBottom: 8 }}>
                EIGENE KEYWORDS (optional, kommagetrennt)
              </label>
              <input
                type="text"
                placeholder="z.B. italian village, wall art, gift idea"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            {/* Output Language */}
            <div style={{ marginBottom: 22 }}>
              <label className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#a09080", display: "block", marginBottom: 8 }}>
                LISTING-SPRACHE
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {["en", "de", "it"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    style={{
                      padding: "8px 18px", border: "1.5px solid", borderRadius: 4, cursor: "pointer",
                      fontSize: 13, fontFamily: "'Inconsolata',monospace",
                      borderColor: language === l ? "#2c7a4b" : "#d4cfc8",
                      background: language === l ? "#2c7a4b" : "white",
                      color: language === l ? "white" : "#5c4a38",
                    }}
                  >
                    {langFlags[l]} {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p style={{ color: "#b34a2a", fontSize: 13, marginBottom: 14, padding: "8px 12px", background: "#fdf0ec", borderRadius: 4, borderLeft: "3px solid #b34a2a" }}>
                {error}
              </p>
            )}

            <button className="gen-btn" onClick={generate} disabled={loading}>
              {loading ? "⟳ Generiere Listing…" : "✦ Etsy-Listing generieren"}
            </button>
          </div>

          {/* Right: Info sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#f0faf5", border: "1px solid #b5dcc7", borderRadius: 8, padding: 16 }}>
              <p className="playfair" style={{ fontSize: 14, color: "#1a4a2e", marginBottom: 10, fontWeight: 700 }}>
                💡 Warum SEO-Listings?
              </p>
              {["Etsy durchsuchen täglich Millionen Käufer", "90% klicken nur auf Seite 1", "Titel & Tags = dein wichtigster Hebel", "13 Tags = 13 Chancen gefunden zu werden"].map((tip, i) => (
                <p key={i} style={{ fontSize: 12, color: "#2c5a3a", marginBottom: 6, paddingLeft: 10, borderLeft: "2px solid #2c7a4b" }}>{tip}</p>
              ))}
            </div>

            <div style={{ background: "white", border: "1px solid #e4dfd7", borderRadius: 8, padding: 16 }}>
              <p className="mono" style={{ fontSize: 11, color: "#a09080", letterSpacing: "0.1em", marginBottom: 10 }}>
                ETSY SEO TOOLS
              </p>
              <p style={{ fontSize: 12, color: "#5c4a38", lineHeight: 1.7, marginBottom: 10 }}>
                Für tiefere Keyword-Analyse empfehlen wir:
              </p>
              <a href="https://erank.com/?ref=wordweaver" target="_blank" rel="noopener noreferrer" className="affiliate-link" style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
                📊 eRank – Etsy Keyword Tool
              </a>
              <a href="https://www.marmalead.com/?ref=wordweaver" target="_blank" rel="noopener noreferrer" className="affiliate-link" style={{ display: "block", fontSize: 13 }}>
                🍊 Marmalead – Etsy SEO
              </a>
              <p style={{ fontSize: 11, color: "#b0a898", marginTop: 10 }}>
                * Affiliate-Links · Für dich kostenlos
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        {(loading || result) && (
          <div ref={resultRef} className="fade-in" style={{ marginTop: 36 }}>
            <h3 className="playfair" style={{ fontSize: 20, color: "#2c1810", marginBottom: 20, borderBottom: "1px solid #e4dfd7", paddingBottom: 12 }}>
              ✦ Dein generiertes Etsy-Listing
            </h3>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[100, 80, 90, 70, 85, 60].map((w, i) => (
                  <div key={i} className="shimmer" style={{ height: 18, width: `${w}%`, borderRadius: 3 }} />
                ))}
              </div>
            ) : result && (
              <>
                {/* Title */}
                <div className="section-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <p className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#a09080" }}>TITEL ({result.title?.length || 0}/140 Zeichen)</p>
                    <button className="icon-btn" onClick={() => copyField(result.title, "title")}>
                      {copiedField === "title" ? "✓ Kopiert" : "Kopieren"}
                    </button>
                  </div>
                  <p className="playfair" style={{ fontSize: 16, color: "#2c1810", lineHeight: 1.6 }}>{result.title}</p>
                </div>

                {/* Tags */}
                <div className="section-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <p className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#a09080" }}>
                      TAGS ({result.tags?.length || 0}/13)
                    </p>
                    <button className="icon-btn" onClick={() => copyField(result.tags?.join(", "), "tags")}>
                      {copiedField === "tags" ? "✓ Kopiert" : "Alle kopieren"}
                    </button>
                  </div>
                  <div>
                    {result.tags?.map((tag, i) => (
                      <span key={i} className="tag-chip">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="section-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <p className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#a09080" }}>BESCHREIBUNG</p>
                    <button className="icon-btn" onClick={() => copyField(result.description, "desc")}>
                      {copiedField === "desc" ? "✓ Kopiert" : "Kopieren"}
                    </button>
                  </div>
                  <p style={{ fontSize: 14, color: "#2c1810", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{result.description}</p>
                </div>

                {/* SEO Tips */}
                {result.seoTips && (
                  <div className="section-box" style={{ background: "#fdf8f3" }}>
                    <p className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#a09080", marginBottom: 10 }}>
                      💡 SPEZIFISCHE SEO-TIPPS FÜR DIESES LISTING
                    </p>
                    {result.seoTips.map((tip, i) => (
                      <p key={i} style={{ fontSize: 13, color: "#5c4a38", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid #8b7355" }}>{tip}</p>
                    ))}
                  </div>
                )}

                {/* Affiliate CTA */}
                <div className="affiliate-box">
                  <p style={{ fontSize: 14, color: "#1a4a2e", fontWeight: 600, marginBottom: 6 }}>
                    🚀 Nächster Schritt: Keywords validieren
                  </p>
                  <p style={{ fontSize: 13, color: "#2c5a3a", lineHeight: 1.7 }}>
                    Prüfe mit <a href="https://erank.com/?ref=wordweaver" target="_blank" rel="noopener noreferrer" className="affiliate-link">eRank</a> oder{" "}
                    <a href="https://www.marmalead.com/?ref=wordweaver" target="_blank" rel="noopener noreferrer" className="affiliate-link">Marmalead</a>,
                    wie oft deine Tags gesucht werden und wie hoch die Konkurrenz ist.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Info Article Section — SEO Content */}
        <div style={{ marginTop: 60, borderTop: "1px solid #e4dfd7", paddingTop: 40 }}>
          <h2 className="playfair" style={{ fontSize: 22, color: "#2c1810", marginBottom: 16 }}>
            Etsy SEO: So wirst du auf Etsy gefunden
          </h2>
          <p style={{ fontSize: 14, color: "#5c4a38", lineHeight: 1.85, marginBottom: 16 }}>
            Etsy hat über 90 Millionen aktive Käufer — aber nur wer von der Etsy-Suchmaschine gefunden wird, macht Umsatz.
            Der Etsy-Algorithmus heißt <strong>Etsy Search</strong> und bewertet deine Listings nach Relevanz, Qualität und Erfahrung.
            Die drei wichtigsten Faktoren: <strong>Titel</strong>, <strong>Tags</strong> und <strong>Beschreibung</strong>.
          </p>
          <p style={{ fontSize: 14, color: "#5c4a38", lineHeight: 1.85, marginBottom: 16 }}>
            Ein optimierter Etsy-Titel beginnt mit dem wichtigsten Keyword, enthält Stil und Material, und ist dennoch lesbar —
            kein Keyword-Spam. Die 13 Tags sollten eine Mischung sein: breite Begriffe für Reichweite, spezifische Long-Tail-Tags
            für Conversion. Die Beschreibung nutzt du nicht nur für Käufer, sondern auch als SEO-Fläche: wiederhole deine
            wichtigsten Keywords natürlich in den ersten 160 Zeichen.
          </p>
          <p style={{ fontSize: 14, color: "#5c4a38", lineHeight: 1.85 }}>
            Unser kostenloser Generator erstellt dir auf Knopfdruck einen vollständigen, SEO-optimierten Entwurf —
            den du dann mit deinem Produktwissen feinjustierst. Für die Keyword-Recherche empfehlen wir{" "}
            <a href="https://erank.com/?ref=wordweaver" target="_blank" rel="noopener noreferrer" className="affiliate-link">eRank</a> als
            das führende Etsy-SEO-Tool.
          </p>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 48 }}>
          <h2 className="playfair" style={{ fontSize: 22, color: "#2c1810", marginBottom: 20 }}>
            Häufige Fragen zum Etsy Listing Generator
          </h2>
          <div>
            {FAQ.map((item, i) => (
              <div key={i} className="faq-item">
                <p className="faq-q">{item.q}</p>
                <p className="faq-a">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <footer style={{ borderTop: "1px solid #e4dfd7", padding: "20px 24px", textAlign: "center", marginTop: 40 }}>
        <p className="mono" style={{ fontSize: 11, color: "#b0a898", letterSpacing: "0.1em" }}>
          WORDWEAVER · ETSY LISTING GENERATOR · <a href="/" style={{ color: "#8b7355" }}>HAUPTSEITE</a> ·{" "}
          <a href="/datenschutz" style={{ color: "#8b7355" }}>DATENSCHUTZ</a> ·{" "}
          <a href="/impressum" style={{ color: "#8b7355" }}>IMPRESSUM</a>
        </p>
      </footer>
    </div>
  );
}
