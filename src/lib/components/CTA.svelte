<script lang="ts">
	// Props
	export let ctaSection: HTMLElement | null = null;
</script>

<!-- CTA Section -->
<section class="bg-gray-900 py-12" bind:this={ctaSection}>
	<div class="container mx-auto px-4 text-center">
		<h2 class="cta-element mb-4 text-2xl font-bold text-blue-400">
			Interested in working together?
		</h2>
		<div class="flex justify-center gap-4">
			<a
				href="/services"
				class="cta-element cta-button-fixed rounded-lg border border-blue-500 px-6 py-2 text-blue-400 transition-colors hover:bg-gray-800"
			>
				View My Services
			</a>
			<button
				class="copy-email-btn cta-element cta-button-fixed relative rounded-lg bg-blue-800 px-6 py-2 text-white transition-colors hover:bg-blue-700"
			>
				<span
					class="copy-tooltip absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity"
					>Copy email address</span
				>
				Contact Me
			</button>
		</div>
	</div>
</section> 