<script>
	import { onMount } from 'svelte';
	
	// Skills based on LinkedIn profile
	const skills = [
		'Full-Stack Development',
		'Python',
		'TypeScript',
		'Auth',
		'Hugging Face',
		'LangChain',
		'Supabase',
		'Flutter',
		'Database Migration',
		'Technical Mentoring',
		'Project Management'
	];

	let currentSection = 'about';
	
	onMount(() => {
		// Add any client-side initialization logic here
	});
</script>

<svelte:head>
	<title>Szu-Han Chou aka Hank - Portfolio</title>
	<meta name="description" content="Professional portfolio showcasing my projects and expertise in software development">
</svelte:head>

<section class="py-12 bg-gray-900 text-gray-100">
	<div class="container mx-auto px-4">
		<div class="flex flex-col items-center">
			<div class="w-full max-w-3xl mb-8 text-center">
				<h1 class="text-4xl md:text-5xl font-bold mb-4">Hi, I'm <span class="text-blue-400">Szu-Han Chou (Hank)</span></h1>
				<h2 class="text-2xl md:text-3xl text-gray-400 mb-6">Software Developer</h2>
				<p class="text-lg text-gray-300 mb-8">
					I'm a passionate developer specialized in creating modern software solutions.
					With a strong focus on clean code, security, and user experience, I build applications 
					that help businesses succeed.
				</p>
				<div class="flex flex-wrap gap-3 mb-8 justify-center">
					{#each skills as skill}
						<span class="bg-gray-800 text-blue-300 px-3 py-1 rounded-full text-sm border border-gray-700 hover:border-blue-500 transition-colors">{skill}</span>
					{/each}
				</div>
				<div class="flex gap-4 justify-center">
					<a href="/portfolio" class="bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg">
						View My Work
					</a>
					<a href="/services" class="border border-blue-500 text-blue-400 hover:bg-gray-800 px-6 py-3 rounded-lg transition-colors shadow-lg">
						My Expertise
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="py-12 bg-gray-800 text-gray-100">
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold mb-8 text-center text-blue-400">About Me</h2>
		
		<div class="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
			<div class="flex flex-col gap-6">
				<div>
					<h3 class="text-xl font-semibold mb-2 text-blue-300">My Background</h3>
					<p class="text-gray-300">
						With extensive experience in full-stack development, I specialize in building secure and maintainable software solutions.
						My technical expertise spans Python development, web applications, and implementing robust security practices.
						I currently work with Eighty20.AI, where I apply my skills to develop innovative technology solutions for a range of clients.
					</p>
				</div>
				
				<div>
					<h3 class="text-xl font-semibold mb-2 text-blue-300">Education & Experience</h3>
					<p class="text-gray-300">
						I hold a degree from Auckland University of Technology and have built my career working across various technology stacks.
						My professional journey includes roles at Eighty20.AI and volunteer positions including Python Bootcamp Instructor for 
						Summer of Tech (2020-2022) and Software Developer for The Good Registry (2019-2022), where I developed an application
						to generate gift cards for bulk orders. I'm passionate about mentoring and have served as a mentor for Young Enterprise.
					</p>
				</div>
				
				<div>
					<h3 class="text-xl font-semibold mb-2 text-blue-300">My Approach</h3>
					<p class="text-gray-300">
						I believe in writing clean, maintainable, and secure code. I hold several security certifications from SafeStack, including
						Secure Developer (Levels 1-2), Security Architect (Levels 1-2), Security Fundamentals (Levels 1-2), and Security Tester.
						My development philosophy centers around creating user-focused solutions that solve real problems while maintaining high 
						standards for security and code quality.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	:global(body) {
		background-color: #111827; /* bg-gray-900 */
		color: #f3f4f6; /* text-gray-100 */
	}
</style>
