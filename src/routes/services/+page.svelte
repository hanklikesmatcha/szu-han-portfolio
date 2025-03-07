<script>
	// Services based on LinkedIn profile
	const services = [
		{
			title: 'Full-Stack Development',
			description: 'End-to-end web application development using modern frameworks and technologies. I build scalable, responsive applications with clean code, security focus, and optimal performance.',
			icon: '💻',
			skills: ['Python/FastAPI', 'TypeScript/React', 'PostgreSQL', 'RESTful APIs', 'Front-end Frameworks']
		},
		{
			title: 'Secure Development',
			description: 'Application development with security as a priority. Leveraging my SafeStack certifications, I implement security best practices from the ground up to ensure your applications are protected against common vulnerabilities.',
			icon: '🔒',
			skills: ['Secure Coding', 'Authentication', 'Authorization', 'Data Protection']
		},
		{
			title: 'Technical Mentoring',
			description: 'Expert guidance for developers and teams looking to improve their skills. Drawing from my experience as a Python Bootcamp Instructor, I can help elevate your team\'s technical capabilities through structured learning and hands-on coaching.',
			icon: '👨‍🏫',
			skills: ['Python Training', 'Code Reviews', 'Best Practices', 'Team Development', 'Technical Guidance']
		},
		{
			title: 'Technical Consultation',
			description: 'Expert advice on technology stack selection, architecture planning, and development best practices. I help businesses make informed technical decisions aligned with their goals and security requirements.',
			icon: '🧠',
			skills: ['Architecture Design', 'Tech Stack Selection', 'Security Reviews', 'Performance Audits', 'Technical Documentation']
		}
	];
	
	// Testimonials based on recommendations
	const testimonials = [
		{
			name: 'Richard Clark',
			company: 'Sharesies',
			position: 'Co-Founder',
			quote: 'Hank is hard-working, enthusiastic and has grown into a proficient and dependable member of the Sharesies technical team. His determination, communication and drive to learn make him a capable developer who can confidently pick up and solve unfamiliar tasks.'
		},
		{
			name: 'Christine Langdon',
			company: 'The Good Registry',
			position: 'Founder',
			quote: "Hank volunteered to help our social giving platform, The Good Registry, to solve a problem we had with issuing gift cards in bulk from our e-commerce platform. He provided a perfect solution for us and did it with great professionalism, skill and passion."
		}
	];
</script>

<svelte:head>
	<title>Skills | Szu-Han Chou aka Hank</title>
	<meta name="description" content="My technical expertise in software development, security, and mentoring">
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-gray-900 to-blue-900 py-16">
	<div class="container mx-auto px-4 text-center">
		<h1 class="text-4xl md:text-5xl font-bold mb-6">Expert Services</h1>
		<p class="text-xl max-w-3xl mx-auto mb-6 text-gray-300">
			I provide secure, quality-focused development solutions.
		</p>
		<a href="mailto:szuhan.eng@gmail.com" class="inline-block bg-blue-800 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
			Get in Touch
		</a>
	</div>
</section>

<!-- Services Section -->
<section class="py-16 bg-gray-900">
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold text-center mb-10 text-blue-400">Services</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each services as service}
				<div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
					<div class="text-4xl mb-4">{service.icon}</div>
					<h3 class="text-2xl font-bold mb-3 text-blue-300">{service.title}</h3>
					<p class="text-gray-300 mb-4">{service.description}</p>
					
					<div class="flex flex-wrap gap-2">
						{#each service.skills.slice(0, 4) as skill}
							<span class="bg-gray-700 text-blue-300 px-3 py-1 rounded-full text-xs">{skill}</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Technical Expertise Section -->
<section class="py-16 bg-gray-800">
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold text-center mb-10 text-blue-400">Technical Expertise</h2>
		
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<div>
				<h3 class="text-xl font-bold mb-3 text-blue-300">Security-First Development</h3>
				<p class="text-gray-300 mb-6">
					With multiple security certifications from SafeStack, I bring a security-first mindset to every project, 
					implementing best practices at every stage from architecture to deployment.
				</p>
				
				<h3 class="text-xl font-bold mb-3 text-blue-300">Educational Background</h3>
				<p class="text-gray-300">
					My experience as a Python Bootcamp Instructor has honed my ability to explain complex technical concepts clearly
					and effectively train team members on new technologies.
				</p>
			</div>
			
			<div>
				<h3 class="text-xl font-bold mb-3 text-blue-300">Volunteer Technical Work</h3>
				<p class="text-gray-300 mb-6">
					My work with organizations like The Good Registry has given me experience building impactful applications
					within the constraints of non-profit organizations.
				</p>
				
				<h3 class="text-xl font-bold mb-3 text-blue-300">Adaptability & Problem-Solving</h3>
				<p class="text-gray-300">
					I approach technical challenges with creativity and persistence, finding solutions even when 
					the path forward isn't immediately clear.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Testimonials Section -->
<section class="py-16 bg-gray-800">
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold text-center mb-10 text-blue-400">Testimonials</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each testimonials as testimonial}
				<div class="bg-gray-900 p-6 rounded-xl border border-gray-700">
					<p class="text-gray-300 italic mb-4">"{testimonial.quote}"</p>
					<div>
						<h3 class="font-bold text-blue-300">{testimonial.name}</h3>
						<p class="text-gray-400">{testimonial.position}, {testimonial.company}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-12 bg-gray-900">
	<div class="container mx-auto px-4 text-center">
		<h2 class="text-2xl font-bold mb-4 text-blue-400">Ready to start your project?</h2>
		<div class="flex justify-center gap-4">
			<a href="mailto:szuhan.eng@gmail.com" class="bg-blue-800 hover:bg-blue-700 px-6 py-2 rounded-lg text-white transition-colors">
				Contact Me
			</a>
			<a href="/portfolio" class="border border-blue-500 text-blue-400 hover:bg-gray-800 px-6 py-2 rounded-lg transition-colors">
				View My Work
			</a>
		</div>
	</div>
</section>

<style>
	/* No need for component-specific styles as the global styles in +page.svelte handle the theme */
</style> 