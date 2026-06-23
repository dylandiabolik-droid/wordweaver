import { Link } from 'react-router-dom';

export default function BlogPost1() {
  return (
    <div style={{ minHeight: '100vh', background: '#f0ece4', padding: '40px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Back link */}
        <Link to="/blog" style={{ fontSize: 12, color: '#8a7868', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ← Back to Blog
        </Link>

        {/* Article header */}
        <div style={{ marginTop: 24, marginBottom: 40 }}>
          <p style={{ fontSize: 12, color: '#8a7868', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            June 2026 · Etsy SEO
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 34, color: '#2c1810', lineHeight: 1.3, marginBottom: 0 }}>
            How to Write Etsy Listing Titles That Actually Rank in 2026
          </h1>
        </div>

        {/* Article body */}
        <div style={{ fontSize: 16, color: '#3a2e24', lineHeight: 1.85 }}>

          <p>If your Etsy shop isn't getting views, your title is probably the problem.</p>

          <p>Most sellers write titles that <em>describe</em> their product. But Etsy's search algorithm doesn't care how you describe your product — it cares how <strong>buyers search</strong> for it. That's a crucial difference, and getting it right is the single fastest way to improve your shop's visibility.</p>

          <p>Here's everything you need to know about writing Etsy listing titles that rank in 2026.</p>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#2c1810', marginTop: 40, marginBottom: 16 }}>
            Why Your Title Is the Most Important Part of Your Listing
          </h2>

          <p>Etsy's algorithm uses your title as the primary signal to determine what searches your listing is relevant for. More specifically, it weights the <strong>first 40 characters</strong> of your title most heavily — meaning whatever comes first has the biggest impact on where you show up.</p>

          <p>Your title also appears as the page title in Google search results. That means a well-written title doesn't just help you rank on Etsy — it brings in external traffic too.</p>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#2c1810', marginTop: 40, marginBottom: 16 }}>
            The 3 Mistakes 90% of Etsy Sellers Make
          </h2>

          <p><strong>1. Putting the keyword at the end</strong><br />
          "Beautiful hand-stamped copper bracelet with personalized name" buries the most important keyword. By the time Etsy reads "personalized name bracelet," it's already past the 40-character sweet spot.</p>

          <p><strong>2. Being too vague</strong><br />
          "Handmade jewelry" competes with millions of listings. "Personalized copper name bracelet" targets a specific buyer with a specific intent.</p>

          <p><strong>3. Ignoring long-tail keywords</strong><br />
          Short, broad keywords have the most competition. Long-tail phrases like "personalized bracelet gift for mom" have lower competition and attract buyers who are ready to purchase — not just browsing.</p>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#2c1810', marginTop: 40, marginBottom: 16 }}>
            The Perfect Title Formula
          </h2>

          <p>The most effective Etsy title structure in 2026 looks like this:</p>

          <div style={{ background: '#fff', border: '1px solid #e4dfd7', borderRadius: 8, padding: '16px 20px', margin: '20px 0', fontFamily: 'Georgia, serif', fontSize: 17, color: '#2c1810' }}>
            [Primary Keyword] | [Secondary Keyword + modifier] | [Occasion or Recipient]
          </div>

          <p>This works because it front-loads the most important keyword, uses separators to signal distinct keyword clusters to Etsy's algorithm, and captures gift-intent searches that drive a huge portion of Etsy's traffic.</p>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#2c1810', marginTop: 40, marginBottom: 16 }}>
            Before & After: 5 Real Examples
          </h2>

          {[
            {
              product: 'Handmade candle',
              before: 'Soy candle handmade with essential oils, natural home decor',
              after: 'Lavender Soy Candle | Handmade Essential Oil Candle | Relaxation Gift for Her',
            },
            {
              product: 'Ceramic mug',
              before: 'Coffee mug, pottery mug, handmade ceramic',
              after: 'Handmade Ceramic Coffee Mug | Rustic Stoneware Gift for Coffee Lovers | Artisan Pottery',
            },
            {
              product: 'Digital print',
              before: 'Printable wall art instant download',
              after: 'Botanical Print Set | Printable Wall Art Instant Download | Minimalist Home Decor',
            },
            {
              product: 'Personalized necklace',
              before: 'Gold necklace with initial, personalized jewelry',
              after: 'Personalized Initial Necklace Gold | Custom Letter Jewelry | Birthday Gift for Her',
            },
            {
              product: 'Knitted scarf',
              before: 'Handknit wool scarf, winter accessories',
              after: 'Chunky Knit Wool Scarf | Hand Knitted Winter Scarf | Cozy Gift for Women',
            },
          ].map((ex, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e4dfd7', borderRadius: 8, padding: '16px 20px', marginBottom: 12 }}>
              <p style={{ fontWeight: 600, color: '#2c1810', marginBottom: 8, fontSize: 14 }}>{ex.product}</p>
              <p style={{ fontSize: 13, color: '#8a7868', marginBottom: 4 }}>
                <span style={{ textDecoration: 'line-through' }}>Before: {ex.before}</span>
              </p>
              <p style={{ fontSize: 13, color: '#2c7a3a', fontWeight: 500 }}>After: {ex.after}</p>
            </div>
          ))}

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#2c1810', marginTop: 40, marginBottom: 16 }}>
            How to Find the Right Keywords
          </h2>

          <p>You don't need expensive tools to find good keywords. Start with these two free methods:</p>

          <p><strong>Etsy Autocomplete</strong> — type your main product into Etsy's search bar and look at the suggestions that appear. These are real phrases buyers are actively typing. Every suggestion is a keyword opportunity.</p>

          <p><strong>eRank</strong> — the free tier of <a href="https://erank.com?fpr=marco47" target="_blank" rel="noopener noreferrer" style={{ color: '#c17f3a' }}>eRank</a> shows estimated search volume and competition for any keyword on Etsy. It takes the guesswork out of choosing between "personalized bracelet" and "custom name bracelet."</p>

          <p>The goal is to find phrases with genuine search volume that aren't dominated by thousands of competing listings. Long-tail keywords with 3–5 words usually hit that sweet spot.</p>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#2c1810', marginTop: 40, marginBottom: 16 }}>
            One More Thing: Don't Keyword-Stuff
          </h2>

          <p>Etsy's 2026 algorithm is smarter than it used to be. Titles that read like a list of keywords — "bracelet personalized custom name jewelry gift women mom birthday" — look spammy to both the algorithm and real buyers. Your title needs to make sense as a phrase a human would actually type.</p>

          <p>The best titles are specific, readable, and front-loaded with the buyer's search intent.</p>

          {/* CTA Box */}
          <div style={{ background: '#2c1810', borderRadius: 8, padding: '28px 32px', marginTop: 48, marginBottom: 16 }}>
            <p style={{ color: '#f0ece4', fontSize: 18, fontFamily: 'Georgia, serif', marginBottom: 8 }}>
              Save time writing Etsy listings
            </p>
            <p style={{ color: '#b89878', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              ListingWriter generates SEO-optimized Etsy titles, descriptions, and all 13 tags in seconds. Free, no signup required.
            </p>
            <Link to="/" style={{
              display: 'inline-block',
              background: '#c17f3a',
              color: 'white',
              padding: '10px 24px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
            }}>
              Try ListingWriter free →
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e4dfd7', marginTop: 48, paddingTop: 24, textAlign: 'center' }}>
          <Link to="/blog" style={{ fontSize: 13, color: '#8a7868', textDecoration: 'none' }}>
            ← More articles
          </Link>
        </div>

      </div>
    </div>
  );
}
