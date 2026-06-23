import { useState, useRef, useEffect } from "react";

// ─── SEO HEAD ─────────────────────────────────────────────────────────────────
const SEO_META = {
  title: "Etsy Listing Generator – Title, Tags & Description in Seconds",
  description:
    "Create optimized Etsy listings in seconds: SEO title, all 13 tags, and a compelling description – free.",
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
  .gen-btn{background:#2c7a4b;color:#f5ede3;border:none;cursor:pointer;font-family:'Inconsolata',monospace;font-size:15px;font-weight:600;letter-spacing:0.08em;padding:16px 32px;border-radius:4px;transition:all 0.2s;width:100%;}
  .gen-btn:hover:not(:disabled){background:#235f3a;transform:translateY(-1px);}
  .gen-btn:disabled{opacity:0.5;cursor:not-allowed;}
  .icon-btn{background:transparent;border:1.5px solid #2c7a4b;color:#2c7a4b;cursor:pointer;font-family:'Inconsolata',monospace;font-size:12px;letter-spacing:0.1em;padding:6px 14px;border-radius:3px;transition:all 0.15s;}
  .icon-btn:hover{background:#2c7a4b;color:white;}
  textarea,input[type=text],select{font-family:'Georgia',serif;font-size:15px;line-height:1.6;border:1.5px solid #d4cfc8;border-radius:6px;padding:12px 14px;width:100%;background:white;color:#1a1714;outline:none;transition:border-color 0.2s;}
  textarea{resize:vertical;}
  textarea:focus,input[type=text]:focus,select:focus{border-color:#2c7a4b;}
  .tag-chip{display:inline-block;background:#e8f5ee;border:1px solid #b5dcc7;color:#1a4a2e;border-radius:20px;padding:4px 12px;font-size:12px;font-family:'Inconsolata',monospace;margin:3px;}
  .section-box{background:white;border:1px solid #e4dfd7;border-radius:8px;padding:20px 24px;margin-bottom:16px;}
  .affiliate-link{color:#2c7a4b;text-decoration:none;font-weight:600;border-bottom:1px solid #2c7a4b;}
  .affiliate-link:hover{color:#1a4a2e;}
  .faq-item{border-bottom:1px solid #e4dfd7;padding:20px 0;}
  .faq-item:last-child{border-bottom:none;}
  .faq-q{font-weight:600;color:#2c1810;font-size:15px;margin-bottom:8px;}
  .faq-a{color:#5c4a38;font-size:14px;line-height:1.75;}
  .sidebar-box{background:white;border:1px solid #e4dfd7;border-radius:8px;padding:20px;}
  .sidebar-label{font-family:'Inconsolata',monospace;font-size:10px;letter-spacing:0.14em;color:#a09080;text-transform:uppercase;margin-bottom:12px;display:block;}
  .stat-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;}
  .stat-icon{width:18px;height:18px;background:#e8f5ee;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;}
  .nav-link{font-family:'Inconsolata',monospace;font-size:12px;color:#5c4a38;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;transition:color 0.15s;}
  .nav-link:hover{color:#2c7a4b;}
`;

// ─── CATEGORY OPTIONS ────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "print", label: "🖼️ Print / Poster / Digital Art" },
  { value: "jewelry", label: "💍 Jewelry" },
  { value: "clothing", label: "👕 Clothing" },
  { value: "home", label: "🏠 Home Decor" },
  { value: "stationery", label: "📝 Stationery" },
  { value: "craft", label: "✂️ Handmade Craft" },
  { value: "digital", label: "💾 Digital Download" },
  { value: "vintage", label: "🕰️ Vintage" },
];

// ─── BUILD PROMPT ─────────────────────────────────────────────────────────────
const buildEtsyPrompt = (productDesc, category, keywords) => {
  return `You are an expert Etsy SEO specialist. Create an optimized Etsy listing in English for this product:

Product: ${productDesc}
Category: ${category}
Keywords to include: ${keywords || "none specified"}

Return ONLY valid JSON (no markdown, no backticks), with this exact structure:
{
  "title": "SEO-optimized title, max 140 chars, front-load main keywords, include style/material/occasion",
  "tags": ["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8","tag9","tag10","tag11","tag12","tag13"],
  "description": "3-paragraph description: 1) emotional hook 2) product details & dimensions 3) shipping/care/CTA. ~200 words.",
  "seoTips": ["short tip 1 specific to this listing","short tip 2","short tip 3"]
}

Rules:
- Exactly 13 tags, each max 20 chars, multi-word tags allowed (e.g. "watercolor print")
- Title: keyword-rich but readable, no ALL CAPS spam
- Description: warm, personal tone — typical of successful Etsy sellers`;
};

// ─── FAQ CONTENT ──────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: "How many tags should an Etsy listing have?",
    a: "Etsy allows exactly 13 tags per listing. You should always use all 13 — each tag is an extra chance to be found in Etsy search. Use a mix of broad terms (e.g. 'watercolor print') and specific long-tail tags (e.g. 'italian village watercolor').",
  },
  {
    q: "How long should an Etsy title be?",
    a: "Etsy allows up to 140 characters. Experts recommend placing the most important keywords right at the start, since Etsy only shows the first ~55 characters in search results. Separate keyword groups with commas or hyphens.",
  },
  {
    q: "What makes a good Etsy description?",
    a: "A successful description starts with an emotional hook (why is this product special?), followed by concrete product details (dimensions, material, technique), and ends with a clear call-to-action plus shipping and care info. The first 160 characters matter most, since they appear in Google search results.",
  },
  {
    q: "How do I improve my Etsy SEO?",
    a: "The key levers: (1) use keywords in the title, tags, AND description, (2) add new listings regularly, (3) optimize photos with alt text, (4) gather customer reviews, (5) test Etsy Ads for new listings. Tools like eRank help you analyze search volume and competition for keywords.",
  },
  {
    q: "Is this generator free?",
    a: "Yes, the Etsy Listing Generator is free to use. You can generate multiple listings every day.",
  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function EtsyListingGenerator() {
  const [productDesc, setProductDesc] = useState("");
  const [category, setCategory] = useState("print");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState("");
  const resultRef = useRef(null);

  useEffect(() => {
    document.title = SEO_META.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", SEO_META.description);
  }, []);

  const generate = async () => {
    if (!productDesc.trim()) {
      setError("Please describe your product.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    const prompt = buildEtsyPrompt(productDesc, category, keywords);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      const raw = data.content?.map((c) => c.text || "").join("").trim().replace(/```json\n?|```\n?/g, "").trim();
      const parsed = JSON.parse(raw);
      setResult(parsed);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch {
      setError("Error generating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyField = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", background: "#faf9f7", minHeight: "100vh", color: "#1a1714" }}>
      <style>{SHARED_STYLES}</style>

      {/* Header */}
      <header style={{ background: "white", borderBottom: "1px solid #e4dfd7" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 className="playfair" style={{ fontSize: 24, fontWeight: 700, color: "#2c1810", lineHeight: 1 }}>
              Listing<em>Writer</em>
            </h1>
            <p className="mono" style={{ fontSize: 9, color: "#b0a898", letterSpacing: "0.16em", marginTop: 4 }}>
              ETSY LISTING GENERATOR
            </p>
          </div>
          <nav>
            <a href="/blog" className="nav-link">Blog</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: "#2c1810", padding: "52px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <p className="mono" style={{ fontSize: 11, color: "#8b7355", letterSpacing: "0.18em", marginBottom: 16 }}>
            FREE ETSY SEO TOOL
          </p>
          <h2 className="playfair" style={{ fontSize: 38, color: "#f5ede3", lineHeight: 1.25, marginBottom: 18, fontWeight: 400 }}>
            Write listings that get found.<br />
            <em>In seconds.</em>
          </h2>
          <p style={{ fontSize: 15, color: "#b89878", lineHeight: 1.8, maxWidth: 520, margin: "0 auto" }}>
            Generate an SEO-optimized <strong style={{ color: "#e8d5b8" }}>title</strong>, all <strong style={{ color: "#e8d5b8" }}>13 tags</strong> and a compelling <strong style={{ color: "#e8d5b8" }}>description</strong> for your Etsy listing — free, no signup.
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32 }}>

          {/* Left: Form */}
          <div>
            <div style={{ background: "white", border: "1px solid #e4dfd7", borderRadius: 10, padding: "28px 28px 32px" }}>

              {/* Product Description */}
              <div style={{ marginBottom: 22 }}>
                <label className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "#a09080", display: "block", marginBottom: 8 }}>
                  PRODUCT DESCRIPTION *
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Watercolor poster of a small Italian hillside village, hand-painted, A4 digital print, warm earth tones"
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                />
              </div>

              {/* Category */}
              <div style={{ marginBottom: 22 }}>
                <label className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "#a09080", display: "block", marginBottom: 8 }}>
                  CATEGORY
                </label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Keywords */}
              <div style={{ marginBottom: 24 }}>
                <label className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "#a09080", display: "block", marginBottom: 8 }}>
                  CUSTOM KEYWORDS <span style={{ opacity: 0.6 }}>(optional, comma-separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. italian village, wall art, gift idea"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

              {error && (
                <p style={{ color: "#b34a2a", fontSize: 13, marginBottom: 16, padding: "10px 14px", background: "#fdf0ec", borderRadius: 4, borderLeft: "3px solid #b34a2a" }}>
                  {error}
                </p>
              )}

              <button className="gen-btn" onClick={generate} disabled={loading}>
                {loading ? "⟳  Generating listing…" : "✦  Generate Etsy listing"}
              </button>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Why it matters */}
            <div className="sidebar-box">
              <span className="sidebar-label">Why SEO listings matter</span>
              {[
                ["90M+", "active Etsy buyers"],
                ["90%", "only click page 1"],
                ["13 tags", "= 13 chances to rank"],
                ["Title", "carries the most weight"],
              ].map(([stat, desc], i) => (
                <div key={i} className="stat-row">
                  <div style={{ minWidth: 52 }}>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: "#2c7a4b" }}>{stat}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#5c4a38", lineHeight: 1.5 }}>{desc}</span>
                </div>
              ))}
            </div>

            {/* Keyword tools */}
            <div className="sidebar-box">
              <span className="sidebar-label">Keyword Research Tools</span>
              <p style={{ fontSize: 12, color: "#5c4a38", lineHeight: 1.7, marginBottom: 14 }}>
                Validate your tags with real search volume data:
              </p>
              <a href="https://erank.com?fpr=marco47" target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#f0faf5", border: "1px solid #b5dcc7", borderRadius: 6, textDecoration: "none", marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>📊</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1a4a2e" }}>eRank</p>
                  <p style={{ fontSize: 11, color: "#5c7a5c" }}>Etsy keyword research</p>
                </div>
              </a>
              <p className="mono" style={{ fontSize: 10, color: "#b0a898", marginTop: 6, letterSpacing: "0.06em" }}>
                * Affiliate link — free for you
              </p>
            </div>

          </div>
        </div>

        {/* Results */}
        {(loading || result) && (
          <div ref={resultRef} className="fade-in" style={{ marginTop: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <h3 className="playfair" style={{ fontSize: 22, color: "#2c1810" }}>
                Your generated Etsy listing
              </h3>
              <div style={{ flex: 1, height: 1, background: "#e4dfd7" }} />
            </div>

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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "#a09080" }}>
                      TITLE — {result.title?.length || 0}/140 chars
                    </span>
                    <button className="icon-btn" onClick={() => copyField(result.title, "title")}>
                      {copiedField === "title" ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="playfair" style={{ fontSize: 17, color: "#2c1810", lineHeight: 1.6 }}>{result.title}</p>
                </div>

                {/* Tags */}
                <div className="section-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "#a09080" }}>
                      TAGS — {result.tags?.length || 0}/13
                    </span>
                    <button className="icon-btn" onClick={() => copyField(result.tags?.join(", "), "tags")}>
                      {copiedField === "tags" ? "✓ Copied" : "Copy all"}
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "#a09080" }}>DESCRIPTION</span>
                    <button className="icon-btn" onClick={() => copyField(result.description, "desc")}>
                      {copiedField === "desc" ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <p style={{ fontSize: 14, color: "#2c1810", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{result.description}</p>
                </div>

                {/* SEO Tips */}
                {result.seoTips && (
                  <div className="section-box" style={{ background: "#fdf8f3", border: "1px solid #e8ddd0" }}>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "#a09080", display: "block", marginBottom: 12 }}>
                      SEO TIPS FOR THIS LISTING
                    </span>
                    {result.seoTips.map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                        <span style={{ color: "#8b7355", fontWeight: 600, flexShrink: 0 }}>→</span>
                        <p style={{ fontSize: 13, color: "#5c4a38", lineHeight: 1.6 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Affiliate CTA after result */}
                <div style={{ background: "#f0faf5", border: "1px solid #b5dcc7", borderLeft: "3px solid #2c7a4b", borderRadius: 6, padding: "16px 20px" }}>
                  <p style={{ fontSize: 14, color: "#1a4a2e", fontWeight: 600, marginBottom: 6 }}>
                    Next step: validate your keywords
                  </p>
                  <p style={{ fontSize: 13, color: "#2c5a3a", lineHeight: 1.7 }}>
                    Check with <a href="https://erank.com?fpr=marco47" target="_blank" rel="noopener noreferrer" className="affiliate-link">eRank</a> how often your tags are searched and how competitive they are.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* SEO Content */}
        <div style={{ marginTop: 72, borderTop: "1px solid #e4dfd7", paddingTop: 48 }}>
          <div style={{ maxWidth: 640 }}>
            <h2 className="playfair" style={{ fontSize: 24, color: "#2c1810", marginBottom: 20 }}>
              Etsy SEO: how to get found on Etsy
            </h2>
            <p style={{ fontSize: 14, color: "#5c4a38", lineHeight: 1.9, marginBottom: 16 }}>
              Etsy has over 90 million active buyers — but only sellers who get found by Etsy's search engine make sales.
              Etsy's algorithm is called <strong>Etsy Search</strong> and ranks your listings by relevance, quality, and experience.
              The three most important factors: <strong>title</strong>, <strong>tags</strong>, and <strong>description</strong>.
            </p>
            <p style={{ fontSize: 14, color: "#5c4a38", lineHeight: 1.9, marginBottom: 16 }}>
              An optimized Etsy title starts with the most important keyword, includes style and material, and stays
              readable — no keyword spam. Your 13 tags should be a mix: broad terms for reach, specific long-tail tags
              for conversion. Use the description not just to convince buyers, but as SEO real estate too: repeat your
              most important keywords naturally within the first 160 characters.
            </p>
            <p style={{ fontSize: 14, color: "#5c4a38", lineHeight: 1.9 }}>
              Our free generator gives you a complete, SEO-optimized draft at the click of a button —
              which you can then fine-tune with your product knowledge. For keyword research we recommend{" "}
              <a href="https://erank.com?fpr=marco47" target="_blank" rel="noopener noreferrer" className="affiliate-link">eRank</a> as
              the leading Etsy SEO tool.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 56 }}>
          <h2 className="playfair" style={{ fontSize: 24, color: "#2c1810", marginBottom: 8 }}>
            Frequently asked questions
          </h2>
          <p style={{ fontSize: 14, color: "#8b7355", marginBottom: 28 }}>About the Etsy Listing Generator</p>
          <div style={{ maxWidth: 640 }}>
            {FAQ.map((item, i) => (
              <div key={i} className="faq-item">
                <p className="faq-q">{item.q}</p>
                <p className="faq-a">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ background: "#2c1810", marginTop: 80, padding: "40px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="playfair" style={{ fontSize: 18, color: "#f5ede3", marginBottom: 4 }}>
              Listing<em>Writer</em>
            </p>
            <p className="mono" style={{ fontSize: 10, color: "#8b7355", letterSpacing: "0.12em" }}>
              FREE ETSY LISTING GENERATOR
            </p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[["Blog", "/blog"], ["Privacy", "/privacy"], ["Imprint", "/imprint"]].map(([label, href]) => (
              <a key={href} href={href} className="mono" style={{ fontSize: 11, color: "#8b7355", textDecoration: "none", letterSpacing: "0.1em", transition: "color 0.15s" }}
                onMouseEnter={e => e.target.style.color = "#f5ede3"}
                onMouseLeave={e => e.target.style.color = "#8b7355"}>
                {label.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
