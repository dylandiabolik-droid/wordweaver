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
    a: "The key levers: (1) use keywords in the title, tags, AND description, (2) add new listings regularly, (3) optimize photos with alt text, (4) gather customer reviews, (5) test Etsy Ads for new listings. Tools like eRank or Marmalead help you analyze search volume and competition for keywords.",
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

  // Update document title for SEO
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
      <header style={{ borderBottom: "1px solid #e4dfd7", padding: "18px 24px", background: "white" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 className="playfair" style={{ fontSize: 22, fontWeight: 700, color: "#2c1810" }}>
              Listing<em>Writer</em>
            </h1>
            <p className="mono" style={{ fontSize: 10, color: "#a09080", letterSpacing: "0.12em", marginTop: 2 }}>
              ETSY LISTING GENERATOR
            </p>
          </div>
        </div>
      </header>{/* Blog Nav */}
<nav style={{ borderBottom: "1px solid #e4dfd7", background: "white", padding: "8px 0" }}>
  <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px" }}>
    <a href="/blog" style={{ fontSize: 12, color: "#5c4a38", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Inconsolata', monospace" }}>
      ✦ Etsy Seller Blog
    </a>
  </div>
</nav>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 className="playfair" style={{ fontSize: 28, color: "#2c1810", marginBottom: 10 }}>
            Etsy Listing Generator
          </h2>
          <p style={{ fontSize: 15, color: "#5c4a38", lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
            Generate an <strong>SEO-optimized title</strong>, all <strong>13 tags</strong> and a 
            compelling <strong>description</strong> for your Etsy listing in seconds — free.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 24 }}>

          {/* Left: Form */}
          <div>
            {/* Product Description */}
            <div style={{ marginBottom: 18 }}>
              <label className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#a09080", display: "block", marginBottom: 8 }}>
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
            <div style={{ marginBottom: 18 }}>
              <label className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#a09080", display: "block", marginBottom: 8 }}>
                CATEGORY
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
                CUSTOM KEYWORDS (optional, comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. italian village, wall art, gift idea"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            {error && (
              <p style={{ color: "#b34a2a", fontSize: 13, marginBottom: 14, padding: "8px 12px", background: "#fdf0ec", borderRadius: 4, borderLeft: "3px solid #b34a2a" }}>
                {error}
              </p>
            )}

            <button className="gen-btn" onClick={generate} disabled={loading}>
              {loading ? "⟳ Generating listing…" : "✦ Generate Etsy listing"}
            </button>
          </div>

          {/* Right: Info sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#f0faf5", border: "1px solid #b5dcc7", borderRadius: 8, padding: 16 }}>
              <p className="playfair" style={{ fontSize: 14, color: "#1a4a2e", marginBottom: 10, fontWeight: 700 }}>
                💡 Why SEO listings matter
              </p>
              {["Millions of buyers search Etsy every day", "90% only click page 1", "Title & tags are your biggest lever", "13 tags = 13 chances to be found"].map((tip, i) => (
                <p key={i} style={{ fontSize: 12, color: "#2c5a3a", marginBottom: 6, paddingLeft: 10, borderLeft: "2px solid #2c7a4b" }}>{tip}</p>
              ))}
            </div>

            <div style={{ background: "white", border: "1px solid #e4dfd7", borderRadius: 8, padding: 16 }}>
              <p className="mono" style={{ fontSize: 11, color: "#a09080", letterSpacing: "0.1em", marginBottom: 10 }}>
                ETSY SEO TOOLS
              </p>
              <p style={{ fontSize: 12, color: "#5c4a38", lineHeight: 1.7, marginBottom: 10 }}>
                For deeper keyword research we recommend:
              </p>
              <a href="https://erank.com?fpr=marco47" target="_blank" rel="noopener noreferrer" className="affiliate-link" style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
                📊 eRank – Etsy Keyword Research
              </a>
              <a href="https://erank.com?fpr=marco47" target="_blank" rel="noopener noreferrer" className="affiliate-link" style={{ display: "block", fontSize: 13 }}>
                🚀 eRank – Boost Your Etsy Sales
              </a>
              <p style={{ fontSize: 11, color: "#b0a898", marginTop: 10 }}>
                * Affiliate links · Free for you
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        {(loading || result) && (
          <div ref={resultRef} className="fade-in" style={{ marginTop: 36 }}>
            <h3 className="playfair" style={{ fontSize: 20, color: "#2c1810", marginBottom: 20, borderBottom: "1px solid #e4dfd7", paddingBottom: 12 }}>
              ✦ Your generated Etsy listing
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
                    <p className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#a09080" }}>TITLE ({result.title?.length || 0}/140 characters)</p>
                    <button className="icon-btn" onClick={() => copyField(result.title, "title")}>
                      {copiedField === "title" ? "✓ Copied" : "Copy"}
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <p className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#a09080" }}>DESCRIPTION</p>
                    <button className="icon-btn" onClick={() => copyField(result.description, "desc")}>
                      {copiedField === "desc" ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <p style={{ fontSize: 14, color: "#2c1810", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{result.description}</p>
                </div>

                {/* SEO Tips */}
                {result.seoTips && (
                  <div className="section-box" style={{ background: "#fdf8f3" }}>
                    <p className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#a09080", marginBottom: 10 }}>
                      💡 SPECIFIC SEO TIPS FOR THIS LISTING
                    </p>
                    {result.seoTips.map((tip, i) => (
                      <p key={i} style={{ fontSize: 13, color: "#5c4a38", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid #8b7355" }}>{tip}</p>
                    ))}
                  </div>
                )}

                {/* Affiliate CTA */}
                <div className="affiliate-box">
                  <p style={{ fontSize: 14, color: "#1a4a2e", fontWeight: 600, marginBottom: 6 }}>
                    🚀 Next step: validate your keywords
                  </p>
                  <p style={{ fontSize: 13, color: "#2c5a3a", lineHeight: 1.7 }}>
                    Check with <a href="https://erank.com?fpr=marco47" target="_blank" rel="noopener noreferrer" className="affiliate-link">eRank</a> or{" "}
                    <a href="https://erank.com?fpr=marco47" target="_blank" rel="noopener noreferrer" className="affiliate-link">eRank</a>{" "}
                    how often your tags are searched and how competitive they are.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Info Article Section — SEO Content */}
        <div style={{ marginTop: 60, borderTop: "1px solid #e4dfd7", paddingTop: 40 }}>
          <h2 className="playfair" style={{ fontSize: 22, color: "#2c1810", marginBottom: 16 }}>
            Etsy SEO: how to get found on Etsy
          </h2>
          <p style={{ fontSize: 14, color: "#5c4a38", lineHeight: 1.85, marginBottom: 16 }}>
            Etsy has over 90 million active buyers — but only sellers who get found by Etsy's search engine make sales.
            Etsy's algorithm is called <strong>Etsy Search</strong> and ranks your listings by relevance, quality, and experience.
            The three most important factors: <strong>title</strong>, <strong>tags</strong>, and <strong>description</strong>.
          </p>
          <p style={{ fontSize: 14, color: "#5c4a38", lineHeight: 1.85, marginBottom: 16 }}>
            An optimized Etsy title starts with the most important keyword, includes style and material, and stays
            readable — no keyword spam. Your 13 tags should be a mix: broad terms for reach, specific long-tail tags
            for conversion. Use the description not just to convince buyers, but as SEO real estate too: repeat your
            most important keywords naturally within the first 160 characters.
          </p>
          <p style={{ fontSize: 14, color: "#5c4a38", lineHeight: 1.85 }}>
            Our free generator gives you a complete, SEO-optimized draft at the click of a button —
            which you can then fine-tune with your product knowledge. For keyword research we recommend{" "}
            <a href="https://erank.com?fpr=marco47" target="_blank" rel="noopener noreferrer" className="affiliate-link">eRank</a> as
            the leading Etsy SEO tool.
          </p>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 48 }}>
          <h2 className="playfair" style={{ fontSize: 22, color: "#2c1810", marginBottom: 20 }}>
            Frequently asked questions about the Etsy Listing Generator
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
          LISTINGWRITER · ETSY LISTING GENERATOR · <a href="/privacy" style={{ color: "#8b7355" }}>PRIVACY</a> ·{" "}
          <a href="/imprint" style={{ color: "#8b7355" }}>IMPRINT</a>
        </p>
      </footer>
    </div>
  );
}
