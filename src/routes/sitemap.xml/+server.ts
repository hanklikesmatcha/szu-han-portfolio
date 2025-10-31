import { SITE_URL } from '$lib/config';

const pages = [
	{ url: '', lastMod: new Date().toISOString(), priority: '1.0', changeFreq: 'weekly' },
	{ url: 'portfolio', lastMod: new Date().toISOString(), priority: '0.8', changeFreq: 'weekly' },
	{ url: 'blogs', lastMod: new Date().toISOString(), priority: '0.7', changeFreq: 'weekly' },
	{ url: 'services', lastMod: new Date().toISOString(), priority: '0.8', changeFreq: 'monthly' }
	// Add other routes as needed
];

// Portfolio projects - in a real app, these would be dynamic from CMS/database
const portfolioItems = [
	{ slug: 'web-applications', lastMod: new Date().toISOString() },
	{ slug: 'mobile-applications', lastMod: new Date().toISOString() },
	{ slug: 'ai-solutions', lastMod: new Date().toISOString() },
	{ slug: 'cloud-infrastructure', lastMod: new Date().toISOString() }
];

export async function GET() {
	const headers = {
		'Content-Type': 'application/xml',
		'Cache-Control': 'max-age=0, s-maxage=3600'
	};

	// Base sitemap structure
	let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

	// Add standard pages
	pages.forEach((page) => {
		sitemap += `
  <url>
    <loc>${SITE_URL}/${page.url}</loc>
    <lastmod>${page.lastMod}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
	});

	// Add portfolio items
	portfolioItems.forEach((item) => {
		sitemap += `
  <url>
    <loc>${SITE_URL}/portfolio/${item.slug}</loc>
    <lastmod>${item.lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
	});

	// Close sitemap
	sitemap += `
</urlset>`;

	return new Response(sitemap, { headers });
}
