import { Link } from 'react-router-dom';

const posts = [
  {
    slug: 'how-to-write-etsy-listing-titles-that-actually-rank-2026',
    title: 'How to Write Etsy Listing Titles That Actually Rank in 2026',
    date: 'June 2026',
    excerpt: 'If your Etsy shop isn\'t getting views, your title is probably the problem. Here\'s the exact formula to fix it.',
  },
];

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f0ece4', padding: '40px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <Link to="/" style={{ fontSize: 12, color: '#8a7868', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ← Back to ListingWriter
          </Link>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#2c1810', marginTop: 16, marginBottom: 8 }}>
            Etsy Seller Blog
          </h1>
          <p style={{ fontSize: 15, color: '#5c4a38', lineHeight: 1.6 }}>
            Practical tips on Etsy SEO, listing optimization, and growing your shop.
          </p>
        </div>

        {/* Post list */}
        {posts.map((post) => (
          <div key={post.slug} style={{
            background: 'white',
            borderRadius: 8,
            padding: '28px 32px',
            marginBottom: 20,
            border: '1px solid #e4dfd7',
          }}>
            <p style={{ fontSize: 12, color: '#8a7868', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {post.date}
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#2c1810', marginBottom: 12, lineHeight: 1.4 }}>
              <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {post.title}
              </Link>
            </h2>
            <p style={{ fontSize: 14, color: '#5c4a38', lineHeight: 1.7, marginBottom: 16 }}>
              {post.excerpt}
            </p>
            <Link to={`/blog/${post.slug}`} style={{
              fontSize: 13,
              color: '#c17f3a',
              textDecoration: 'none',
              fontWeight: 500,
            }}>
              Read article →
            </Link>
          </div>
        ))}

      </div>
    </div>
  );
}
