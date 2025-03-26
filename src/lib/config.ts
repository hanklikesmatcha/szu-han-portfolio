// Site configuration
export const SITE_URL = 'https://hankchou.me';
export const SITE_TITLE = 'Hank Chou | AI-Powered Software Engineer';
export const SITE_DESCRIPTION =
	'Senior software engineer specializing in AI-driven applications, responsive web development, and scalable cloud solutions.';
export const SITE_KEYWORDS =
	'hank chou, software engineer, AI development, web development, cloud solutions, tech consulting, SvelteKit';

// Social media links
export const GITHUB_URL = 'https://github.com/hankszuhan';
export const LINKEDIN_URL = 'https://linkedin.com/in/hankchou';
export const TWITTER_URL = 'https://twitter.com/hankchou';

// SEO defaults
export const DEFAULT_OG_IMAGE = 'https://hankchou.me/images/hank-social.png';
export const DEFAULT_TWITTER_CARD = 'summary_large_image';

// Contact info
export const CONTACT_EMAIL = 'contact@hankchou.me';

// Analytics
// Using @vercel/analytics - no API key needed as it's managed by Vercel

// Performance thresholds
export const PERFORMANCE_BUDGET = {
	LCP: 2500, // Largest Contentful Paint (ms)
	FID: 100, // First Input Delay (ms)
	CLS: 0.1, // Cumulative Layout Shift
	TTI: 3500, // Time to Interactive (ms)
	TBT: 300, // Total Blocking Time (ms)
	TTFB: 800 // Time to First Byte (ms)
};
