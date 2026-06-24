import { useEffect } from "react";

// ─── SHARED STYLES (same as main app) ─────────────────────────────────────────
const LEGAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inconsolata:wght@400;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#f0ece4;}
  .playfair{font-family:'Playfair Display',serif;}
  .mono{font-family:'Inconsolata',monospace;}
  .icon-btn{background:transparent;border:1.5px solid #2c7a4b;color:#2c7a4b;cursor:pointer;font-family:'Inconsolata',monospace;font-size:12px;letter-spacing:0.1em;padding:6px 14px;border-radius:3px;transition:all 0.15s;text-decoration:none;display:inline-block;}
  .icon-btn:hover{background:#2c7a4b;color:white;}
  .legal-section{margin-bottom:28px;}
  .legal-h2{font-family:'Playfair Display',serif;font-size:19px;color:#2c1810;margin-bottom:10px;}
  .legal-p{font-size:14px;color:#5c4a38;line-height:1.8;margin-bottom:10px;}
  .legal-placeholder{background:#fdf0ec;border-left:3px solid #b34a2a;padding:2px 6px;color:#b34a2a;font-family:'Inconsolata',monospace;font-size:13px;}
`;

const LegalShell = ({ title, children }) => {
  useEffect(() => {
    document.title = `${title} – ListingWriter`;
  }, [title]);

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", background: "#f0ece4", minHeight: "100vh", color: "#1a1714" }}>
      <style>{LEGAL_STYLES}</style>

      <header style={{ borderBottom: "1px solid #e4dfd7", padding: "18px 24px", background: "#f7f4ee" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <h1 className="playfair" style={{ fontSize: 22, fontWeight: 700, color: "#2c1810" }}>
              Listing<em>Writer</em>
            </h1>
          </a>
         <a href="/" style={{ fontSize: 12, color: "#8a7868", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Inconsolata', monospace" }}>← Back to home</a>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px" }}>
        <h2 className="playfair" style={{ fontSize: 28, color: "#2c1810", marginBottom: 28 }}>{title}</h2>
        {children}
      </main>

      <footer style={{ borderTop: "1px solid #e4dfd7", padding: "20px 24px", textAlign: "center", marginTop: 40 }}>
        <p className="mono" style={{ fontSize: 11, color: "#b0a898", letterSpacing: "0.1em" }}>
          LISTINGWRITER · <a href="/" style={{ color: "#8b7355" }}>HOME</a> ·{" "}
          <a href="/privacy" style={{ color: "#8b7355" }}>PRIVACY</a> ·{" "}
          <a href="/imprint" style={{ color: "#8b7355" }}>IMPRINT</a>
        </p>
      </footer>
    </div>
  );
};

// ─── IMPRINT ───────────────────────────────────────────────────────────────────
export function Imprint() {
  return (
    <LegalShell title="Imprint">
      <div className="legal-section">
        <p className="legal-h2">Information according to applicable disclosure requirements</p>
        <p className="legal-p">
          Marco De Cia<br />
          Zürichstrasse 77E<br />
          8134 Adliswil<br />
          Switzerland
        </p>
      </div>

      <div className="legal-section">
        <p className="legal-h2">Contact</p>
        <p className="legal-p">
          Email: mdecia66@gmail.com
        </p>
      </div>

      <div className="legal-section">
        <p className="legal-h2">Responsible for content</p>
        <p className="legal-p">
          Marco De Cia, Zürichstrasse 77E, 8134 Adliswil, Switzerland
        </p>
      </div>

      <div className="legal-section">
        <p className="legal-h2">Disclaimer</p>
        <p className="legal-p">
          This website is operated as an individual, non-commercial project. Despite careful
          content control, no liability is assumed for the content of external links. The
          operators of linked pages are solely responsible for their content.
        </p>
      </div>
    </LegalShell>
  );
}

// ─── PRIVACY POLICY ────────────────────────────────────────────────────────────
export function Privacy() {
  return (
    <LegalShell title="Privacy Policy">
      <div className="legal-section">
        <p className="legal-h2">1. Overview</p>
        <p className="legal-p">
          This privacy policy explains what data is collected when you use ListingWriter
          and how it is handled. We take the protection of your personal data seriously
          and treat it confidentially, in accordance with applicable data protection law.
        </p>
      </div>

      <div className="legal-section">
        <p className="legal-h2">2. Data controller</p>
        <p className="legal-p">
          Marco De Cia<br />
          Zürichstrasse 77E, 8134 Adliswil, Switzerland<br />
          Email: mdecia66@gmail.com
        </p>
      </div>

      <div className="legal-section">
        <p className="legal-h2">3. Data collected when using the generator</p>
        <p className="legal-p">
          The product descriptions and keywords you enter into the listing generator are sent
          to a third-party AI provider (Anthropic) to generate text output. This data is processed
          solely to provide the generation result and is not stored permanently by us. We do not
          require you to create an account or provide personal information to use the core tool.
        </p>
      </div>

      <div className="legal-section">
        <p className="legal-h2">4. Hosting</p>
        <p className="legal-p">
          This website is hosted by Vercel Inc. Server log data (such as IP address, browser type,
          and access time) is automatically collected by the hosting provider for technical and
          security purposes.
        </p>
      </div>

      <div className="legal-section">
        <p className="legal-h2">5. Advertising (Google AdSense)</p>
        <p className="legal-p">
          This website may display ads served by Google AdSense. Google may use cookies and
          similar technologies to serve ads based on your prior visits to this or other websites.
          You can opt out of personalized advertising by visiting Google's Ads Settings.
        </p>
      </div>

      <div className="legal-section">
        <p className="legal-h2">6. Affiliate links</p>
        <p className="legal-p">
          This website contains affiliate links (e.g. to eRank and Marmalead). If you click such
          a link and make a purchase, we may receive a commission at no additional cost to you.
        </p>
      </div>

      <div className="legal-section">
        <p className="legal-h2">7. Your rights</p>
        <p className="legal-p">
          Depending on your jurisdiction, you may have the right to access, correct, or delete
          your personal data, and to object to its processing. To exercise these rights, contact
          us using the email address above.
        </p>
      </div>
    </LegalShell>
  );
}
