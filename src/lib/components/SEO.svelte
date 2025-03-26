<script lang="ts">
  export let title = 'Hank Chou | AI-Powered Software Engineer';
  export let description = 'Senior software engineer specializing in AI-driven applications, responsive web development, and scalable cloud solutions.';
  export let image = 'https://hankchou.me/images/hank-social.png';
  export let url = '';
  export let type = 'website';
  export let twitterCard = 'summary_large_image';
  export let canonicalUrl = '';
  export let keywords = 'software engineer, AI development, web development, cloud solutions, tech consulting';
  export let jsonLd = {};

  import { page } from '$app/stores';
  
  // Default URL if not provided
  $: resolvedUrl = url || `https://hankchou.me${$page.url.pathname}`;
  $: resolvedCanonicalUrl = canonicalUrl || resolvedUrl;
  
  // Default structured data for personal portfolio
  $: defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'Hank Chou',
    'jobTitle': 'Software Engineer',
    'url': 'https://hankchou.me',
    'sameAs': [
      'https://github.com/hankszuhan',
      'https://linkedin.com/in/hankchou'
    ],
    'knowsAbout': [
      'Software Engineering',
      'AI Development',
      'Cloud Architecture',
      'Web Development',
      'Mobile Applications'
    ]
  };
  
  // Merge with custom JSON-LD if provided
  $: mergedJsonLd = {...defaultJsonLd, ...jsonLd};
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  
  <!-- Canonical URL -->
  <link rel="canonical" href={resolvedCanonicalUrl} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:url" content={resolvedUrl} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  
  <!-- Twitter -->
  <meta name="twitter:card" content={twitterCard} />
  <meta name="twitter:url" content={resolvedUrl} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  
  <!-- Structured Data -->
  <script type="application/ld+json">
    {JSON.stringify(mergedJsonLd)}
  </script>
</svelte:head> 