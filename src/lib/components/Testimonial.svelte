<script lang="ts">
	// Props
	export let testimonialSection: HTMLElement | null = null;
</script>

<!-- Testimonials section -->
<section class="bg-[#1A202C] py-12 text-gray-100" bind:this={testimonialSection}>
	<div class="container mx-auto px-4">
		<h2 class="mb-8 text-center text-3xl font-bold text-blue-400">What People Say</h2>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div
				class="testimonial-card rounded-xl border border-gray-700 bg-[#1E2433] p-6 shadow-lg transition-all duration-300 hover:border-blue-500 hover:shadow-xl"
			>
				<p class="mb-4 text-gray-300 italic">
					"Hank is hard-working, enthusiastic and has grown into a proficient and dependable member
					of the Sharesies technical team. His determination, communication and drive to learn make
					him a capable developer who can confidently pick up and solve unfamiliar tasks."
				</p>
				<div>
					<h3 class="font-bold text-blue-300">Richard Clark</h3>
					<p class="text-gray-400">Technical Director, Sharesies</p>
				</div>
			</div>

			<div
				class="testimonial-card rounded-xl border border-gray-700 bg-[#1E2433] p-6 shadow-lg transition-all duration-300 hover:border-blue-500 hover:shadow-xl"
			>
				<p class="mb-4 text-gray-300 italic">
					"Hank volunteered to help our social giving platform, The Good Registry, to solve a
					problem we had with issuing gift cards in bulk from our e-commerce platform. He provided a
					perfect solution for us and did it with great professionalism, skill and passion."
				</p>
				<div>
					<h3 class="font-bold text-blue-300">Christine Langdon</h3>
					<p class="text-gray-400">Founder, The Good Registry</p>
				</div>
			</div>
		</div>
	</div>
</section> 