<script lang="ts">
	// Props
	export let aboutSection: HTMLElement | null = null;
</script>

<section class="perspective bg-[#1E2433] py-12 text-gray-100" bind:this={aboutSection}>
	<div class="container mx-auto px-4">
		<h2 class="about-element animate-ready mb-8 text-center text-3xl font-bold text-blue-400">
			About Me
		</h2>

		<div
			class="about-section-card rounded-xl border border-gray-700 bg-[#1A202C] p-8 shadow-lg transition-all duration-300 hover:border-gray-600 hover:shadow-xl hover:shadow-blue-900/20"
		>
			<div class="flex flex-col gap-6">
				<div
					class="about-element animate-ready transition-transform duration-300 hover:translate-y-[-2px]"
				>
					<h3 class="mb-2 text-xl font-semibold text-blue-300">My Background</h3>
					<div class="mb-6 text-gray-200 space-y-4">
						<p>
							Hey there! I'm a senior full-stack developer with <span class="bg-indigo-900/30 px-1.5 py-0.5 rounded font-bold text-pink-200 border border-indigo-700/40">7+ years</span> of experience delivering high-impact solutions for multi-national startups. I'm originally from Taipei (that's the beautiful city in the photo!), 
							but I've been living in New Zealand where I've collaborated with diverse teams across multiple time zones. My journey between these cultures has enhanced my ability to communicate effectively and adapt to different business environments.
						</p>
						
						<p>
							My expertise includes <span class="bg-indigo-900/30 px-1.5 py-0.5 rounded font-bold text-pink-200 border border-indigo-700/40">AI-powered solutions</span> (intelligent data classification and content generation), 
							<span class="bg-indigo-900/30 px-1.5 py-0.5 rounded font-bold text-pink-200 border border-indigo-700/40">intuitive user interfaces</span> that delight customers, and <span class="bg-indigo-900/30 px-1.5 py-0.5 rounded font-bold text-pink-200 border border-indigo-700/40">responsive web applications</span> that work flawlessly across all devices with optimized mobile experiences.
						</p>
						
						<p>
							I've developed <span class="bg-indigo-900/30 px-1.5 py-0.5 rounded font-bold text-pink-200 border border-indigo-700/40">high-performance backend systems</span>, designed and implemented <span class="bg-indigo-900/30 px-1.5 py-0.5 rounded font-bold text-pink-200 border border-indigo-700/40">cloud infrastructure</span> that scales automatically with demand, and built <span class="bg-indigo-900/30 px-1.5 py-0.5 rounded font-bold text-pink-200 border border-indigo-700/40">containerized applications</span> for consistent deployment across environments.
						</p>
						
						<p>
							I thrive in collaborative environments and have a proven track record of translating complex business requirements into elegant technical solutions. Let's connect to discuss how my skills can help bring your vision to life!
						</p>
					</div>

					<div
						class="mx-auto max-w-md overflow-hidden rounded-lg border-2 border-gray-700 shadow-lg transition-transform duration-300 hover:scale-105"
					>
						<img
							src="/images/hometown.jpg"
							alt="Taipei City - My Hometown"
							class="w-full object-cover"
						/>
						<div class="bg-[#1A202C]/80 p-2 text-center text-sm text-blue-300">
							Taipei - Where I'm From
						</div>
					</div>
				</div>

				<div
					class="about-element animate-ready transition-transform duration-300 hover:translate-y-[-2px]"
				>
					<h3 class="mb-2 text-xl font-semibold text-blue-300">Education & Experience</h3>
					<p class="text-gray-200">
						I've been fortunate to study at Auckland University of Technology (Postgraduate
						Certificate in Computer & Information Sciences) and Wellington Technology Institute
						(Graduate Diploma in IT), along with my Bachelor of Engineering background. I've had a
						blast working with amazing teams at <a
							href="https://octopus.energy/"
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-pink-300 transition-colors duration-300 hover:text-pink-200 hover:underline"
							>Octopus Energy</a
						>,
						<a
							href="https://sharesies.com.au/"
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-pink-300 transition-colors duration-300 hover:text-pink-200 hover:underline"
							>Sharesies</a
						>,
						<a
							href="https://www.generatezero.com/"
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-pink-300 transition-colors duration-300 hover:text-pink-200 hover:underline"
							>GenerateZero</a
						>, and
						<a
							href="https://www.taggun.io"
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-pink-300 transition-colors duration-300 hover:text-pink-200 hover:underline"
							>Taggun</a
						>. One of my proudest achievements was helping
						<a
							href="https://thegoodregistry.com/"
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-pink-300 transition-colors duration-300 hover:text-pink-200 hover:underline"
							>The Good Registry</a
						> raise over $500,000 NZD for charities through automated processes I developed.
					</p>
				</div>

				<div
					class="about-element animate-ready transition-transform duration-300 hover:translate-y-[-2px]"
				>
					<h3 class="mb-2 text-xl font-semibold text-blue-300">My Approach</h3>
					<p class="text-gray-200">
						I'm all about creating tech that makes life better and easier for people. I get excited
						about <span class="font-bold transition-colors duration-300 hover:text-blue-300"
							>AI-driven software solutions</span
						>, crafting elegant
						<span class="font-bold transition-colors duration-300 hover:text-blue-300"
							>RESTful & GraphQL APIs</span
						>, and integrating
						<span class="font-bold transition-colors duration-300 hover:text-blue-300"
							>machine learning models</span
						> that actually solve real problems. I'm a firm believer in clean code that other developers
						will thank you for later! I love both teaching others what I know and continuously learning
						new technologies - the tech world never stands still, and neither do I!
					</p>
				</div>
			</div>
		</div>
	</div>
</section> 