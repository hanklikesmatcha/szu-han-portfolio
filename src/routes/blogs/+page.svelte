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
	description="Actionable AI product strategy briefs, remote team leadership lessons, and personal reflections from my Substack newsletter."
	url="https://hankchou.me/blogs"
	keywords="ai product strategy, product leadership, remote teams, substack newsletter, hank chou"
/>

<section class="bg-gradient-to-br from-gray-900 to-blue-900 py-16">
	<div class="container mx-auto flex max-w-5xl flex-col gap-6 px-6 text-center sm:px-10">
		<p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-200/80">Letters & Lab Notes</p>
		<h1 class="text-4xl font-bold text-blue-100 sm:text-5xl">
			Actionable AI product briefs for resilient teams and founders
		</h1>
		<p class="mx-auto max-w-3xl text-base text-blue-100/90 sm:text-lg">
			Each letter unpacks an AI product strategy experiment, the systems I build with collaborators, and the leadership rituals that keep remote teams steady.
			Expect candid reflections on migration, rebuilding family, and shipping meaningful work—mirroring the <span class="font-medium text-blue-200">Substack newsletter</span> community learning alongside me beyond the code.
		</p>
		{#if lastUpdatedLabel}
			<p class="text-sm text-blue-100/80">Last updated on {lastUpdatedLabel}. Follow on Substack for real-time drops.</p>
		{:else}
			<p class="text-sm text-blue-100/80">Fresh entries land here every week. Follow on Substack for real-time drops.</p>
		{/if}
		{#if showMaintainerHints}
			<p class="text-xs text-blue-100/60">
				Maintainer tip: entries auto-refresh when the Substack cache updates.
			</p>
		{/if}
	</div>
</section>

<section class="bg-gray-900 py-16">
	<div class="container mx-auto max-w-6xl px-6 sm:px-10">
		{#if articles.length}
			<div class="grid gap-10 md:grid-cols-2">
				{#each articles as article (article.id)}
					<a
						href={article.url}
						target="_blank"
						rel="noopener noreferrer"
						class="group flex h-full flex-col rounded-xl border border-gray-700 bg-gray-800/80 p-8 shadow-xl transition-colors hover:border-blue-400 hover:bg-gray-800"
					>
						<div class="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-blue-200/80">
							<span class="rounded-full bg-gray-700/70 px-3 py-1 text-[0.7rem] text-blue-100/90">{formatDate(article.publishedAt)}</span>
							{#if formatReadingTime(article.readingTimeMinutes)}
								<span class="flex items-center gap-2 text-[0.7rem] text-blue-200/70">
									<svg class="h-4 w-4 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
										<circle cx="12" cy="12" r="9" class="text-blue-900" stroke-opacity="0.4"></circle>
										<path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
									{formatReadingTime(article.readingTimeMinutes)}
								</span>
							{/if}
						</div>

						<div class="mt-6 flex flex-1 flex-col gap-4">
							<h2 class="text-2xl font-semibold leading-tight text-blue-50 transition-colors group-hover:text-blue-200">
								{article.title}
							</h2>
							<p class="line-clamp-4 text-sm leading-relaxed text-blue-100/80">
								{article.summary || 'Read the full story on Substack.'}
							</p>
						</div>

						{#if article.tags.length}
							<ul class="mt-6 flex flex-wrap gap-2 text-[0.7rem] uppercase tracking-[0.12em] text-blue-200/70">
								{#each article.tags.slice(0, 4) as tag}
									<li class="rounded-full border border-gray-600 px-3 py-1 transition-colors group-hover:border-blue-400 group-hover:text-blue-200">{tag}</li>
								{/each}
							</ul>
						{/if}

						<span class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition group-hover:translate-x-1 group-hover:text-blue-100">
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
			<div class="flex flex-col gap-6 rounded-xl border border-dashed border-blue-400/40 bg-gray-800/60 p-10 text-blue-100">
				<h2 class="text-2xl font-semibold text-blue-50">No cached articles yet</h2>
				<p class="max-w-2xl text-sm leading-relaxed text-blue-100/80">
					I'm still syncing the Substack feed. In the meantime, browse the full archive directly on Substack.
				</p>
				{#if showMaintainerHints}
					<p class="text-xs text-blue-200/70">
						Maintainer tip: entries auto-refresh when the Substack cache updates.
					</p>
				{/if}
			</div>
		{/if}
	</div>
</section>
