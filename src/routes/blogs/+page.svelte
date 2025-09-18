<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import type { PageData } from './$types';
	import { dev } from '$app/environment';

	let { data }: { data: PageData } = $props();
	const showMaintainerHints = dev;

	const formatDate = (value: string) =>
		new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).format(new Date(value));

	const formatReadingTime = (minutes?: number | null) => {
		if (!minutes) return null;
		const rounded = Math.max(1, Math.round(minutes));
		return `${rounded} min read`;
	};

	const articles = $derived(data.articles);
	const meta = $derived(data.meta);
	const hasLastUpdated = $derived(meta.lastUpdated !== '1970-01-01T00:00:00.000Z');
	const lastUpdatedLabel = $derived(hasLastUpdated ? formatDate(meta.lastUpdated) : null);
</script>

<SEO
	title="Latest Writing | Hank Chou"
	description="Highlights from my Substack — product insights, AI engineering, and weekly learnings."
	url="https://hankchou.me/blogs"
	keywords="substack, writing, blog, portfolio, hank chou"
/>

<section class="relative overflow-hidden border-b border-gray-800 bg-[#0f172a]">
	<div class="pointer-events-none absolute inset-0 opacity-80">
		<div class="absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary-500/30 blur-3xl"></div>
		<div class="absolute bottom-0 right-0 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-amber-500/20 blur-3xl"></div>
	</div>

	<div class="relative mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-20 pt-24 sm:px-10">
		<p class="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300/80">Substack Digest</p>
		<h1 class="text-4xl font-semibold text-white sm:text-5xl">
			Insights, experiments, and learnings — straight from the lab
		</h1>
		<p class="max-w-2xl text-base text-blue-100/80 sm:text-lg">
			I publish weekly reflections on building AI-powered products, systems design, and the craft of engineering. Here’s the latest feed syndicated from
			<span class="font-medium text-amber-200"> Substack</span>.
		</p>
		{#if lastUpdatedLabel}
			<p class="text-sm text-blue-200/80">Last updated on {lastUpdatedLabel}. Follow on Substack for real-time drops.</p>
		{:else}
			<p class="text-sm text-blue-200/80">Fresh entries land here every week. Follow on Substack for real-time drops.</p>
		{/if}
		{#if showMaintainerHints}
			<p class="text-xs text-blue-200/60">Maintainer tip: run <code class="rounded bg-slate-900/60 px-1.5 py-0.5 text-[0.7rem] text-amber-200">pnpm sync:blogs</code> before releases to refresh the cache.</p>
		{/if}
	</div>
</section>

<section class="mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-20">
	{#if articles.length}
		<div class="grid gap-8 sm:grid-cols-2">
			{#each articles as article (article.id)}
				<a
					href={article.url}
					target="_blank"
					rel="noopener noreferrer"
					class="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/50 p-8 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.85)] backdrop-blur transition hover:border-amber-400/60 hover:bg-slate-900/80"
				>
					<div class="flex items-center gap-3 text-sm text-slate-300/80">
						<span class="rounded-full bg-slate-800/70 px-3 py-1 font-medium text-amber-200/90">{formatDate(article.publishedAt)}</span>
						{#if formatReadingTime(article.readingTimeMinutes)}
							<span class="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400/80">
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
									<circle cx="12" cy="12" r="9" class="text-slate-600"></circle>
									<path d="M12 7v5l3 2" class="text-amber-300" stroke-linecap="round" stroke-linejoin="round"></path>
								</svg>
								{formatReadingTime(article.readingTimeMinutes)}
							</span>
						{/if}
					</div>

					<div class="mt-6 flex flex-1 flex-col gap-4">
						<h2 class="text-2xl font-semibold leading-tight text-white transition group-hover:text-amber-200">
							{article.title}
						</h2>
						<p class="line-clamp-4 text-sm leading-relaxed text-slate-300/90">
							{article.summary || 'Read the full story on Substack.'}
						</p>
					</div>

					{#if article.tags.length}
						<ul class="mt-6 flex flex-wrap gap-2 text-xs text-slate-400">
							{#each article.tags.slice(0, 4) as tag}
								<li class="rounded-full border border-slate-700/80 px-3 py-1 transition group-hover:border-amber-400/60 group-hover:text-amber-200">{tag}</li>
							{/each}
						</ul>
					{/if}

					<span class="mt-8 inline-flex items-center gap-2 text-sm font-medium text-amber-200 transition group-hover:translate-x-1">
						Continue on Substack
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path d="M7 17L17 7" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M10 7h7v7" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</span>
				</a>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-start gap-6 rounded-3xl border border-dashed border-slate-700/70 bg-slate-900/30 p-10 text-slate-300">
			<h2 class="text-2xl font-semibold text-white">No cached articles yet</h2>
			<p class="max-w-2xl text-sm leading-relaxed text-slate-300/90">
				I'm still syncing the Substack feed. In the meantime, browse the full archive directly on Substack.
			</p>
			{#if showMaintainerHints}
				<p class="text-xs text-slate-400">
					Maintainer tip: run <code class="rounded bg-slate-900/60 px-1.5 py-0.5 text-[0.7rem] text-amber-200">pnpm sync:blogs</code> and commit <code class="rounded bg-slate-900/60 px-1.5 py-0.5 text-[0.7rem] text-amber-200">src/lib/data/substack.ts</code> to refresh this cache.
				</p>
			{/if}
		</div>
	{/if}
</section>
