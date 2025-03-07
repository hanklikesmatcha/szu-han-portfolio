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
			quote: 'Hank is hard-working, enthusiastic and has grown into a proficient and dependable member of the Sharesies technical team. Over the course of his time at Sharesies Hank has diligently improved his skills, taking on challenging tasks throughout a complex system. His determination, communication and drive to learn make him a capable developer who can confidently pick up and solve unfamiliar tasks. In addition to his technical knowledge and skill, Hank also brings a friendly, caring nature and endless support for others, a huge contribution to making Sharesies a special place to work every day. '
		},
		{
			name: 'Christine Langdon',
			company: 'The Good Registry',
			position: 'Founder',
			quote: "Hank volunteered to help our social giving platform, The Good Registry, to solve a problem we had with issuing gift cards in bulk from our e-commerce platform. He provided a perfect solution for us and did it with great professionalism, skill and passion. He's continued to support us and we're very grateful to have him on our team. Couldn't recommend him highly enough!"		}
	];
</script>

<svelte:head>
	<title>Technical Expertise | Szu-Han Chou aka Hank</title>
	<meta name="description" content="Showcasing my technical expertise in software development, security, and mentoring">
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-20">
	<div class="container mx-auto px-4 text-center">
		<h1 class="text-4xl md:text-5xl font-bold mb-6">Expert Services for Your Next Project</h1>
		<p class="text-xl max-w-3xl mx-auto mb-8 text-gray-300">
			I provide comprehensive development solutions with a focus on security and quality.
			Let's work together to bring your vision to life.
		</p>
		<a href="mailto:contact@szuhan.dev" class="inline-block bg-blue-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg">
			Get in Touch
		</a>
	</div>
</section>

<!-- Services Section -->
<section class="py-16 bg-gray-900">
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold text-center mb-12 text-blue-400">Services I Offer</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each services as service}
				<div class="bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-700">
					<div class="text-4xl mb-4">{service.icon}</div>
					<h3 class="text-2xl font-bold mb-3 text-blue-300">{service.title}</h3>
					<p class="text-gray-300 mb-6">{service.description}</p>
					
					<h4 class="font-semibold text-gray-300 mb-2">Skills:</h4>
					<div class="flex flex-wrap gap-2">
						{#each service.skills as skill}
							<span class="bg-gray-700 text-blue-300 px-3 py-1 rounded-full text-sm border border-gray-600 hover:border-blue-500 transition-colors">{skill}</span>
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
		<h2 class="text-3xl font-bold text-center mb-12 text-blue-400">My Technical Expertise</h2>
		
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
			<div>
				<h3 class="text-2xl font-bold mb-4 text-blue-300">Security-First Development</h3>
				<p class="text-gray-300 mb-6">
					With multiple security certifications from SafeStack, I bring a security-first mindset to every project. 
					This ensures your applications aren't just functional, but also protected against common vulnerabilities and 
					security threats. I implement security best practices at every stage of development, from architecture to deployment.
				</p>
				
				<h3 class="text-2xl font-bold mb-4 text-blue-300">Educational Background</h3>
				<p class="text-gray-300">
					My experience as a Python Bootcamp Instructor has honed my ability to explain complex technical concepts clearly. 
					This translates directly to client work, where I can effectively communicate technical information to stakeholders of all 
					backgrounds. It also means I can quickly train team members on new technologies or approaches when needed.
				</p>
			</div>
			
			<div>
				<h3 class="text-2xl font-bold mb-4 text-blue-300">Volunteer Technical Work</h3>
				<p class="text-gray-300 mb-6">
					My work with organizations like The Good Registry has given me experience in building applications that make a real impact.
					These projects required creating secure, user-friendly solutions while working within the constraints of non-profit organizations.
					This experience has taught me to be resourceful, efficient, and focused on delivering value.
				</p>
				
				<h3 class="text-2xl font-bold mb-4 text-blue-300">Adaptability & Problem-Solving</h3>
				<p class="text-gray-300">
					Coming from a background where I had to overcome significant challenges, I've developed exceptional adaptability and
					problem-solving skills. I approach technical challenges with creativity and persistence, finding solutions even when 
					the path forward isn't immediately clear. This resilience ensures I can tackle complex projects successfully.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Why Choose Me Section -->
<section class="py-16 bg-gray-900">
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold text-center mb-12 text-blue-400">Why Choose Me as Your Developer</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="bg-gray-800 p-6 rounded-xl shadow-md text-center border border-gray-700">
				<div class="text-blue-400 text-4xl mb-4">🔍</div>
				<h3 class="text-xl font-bold mb-3 text-blue-300">Security Focus</h3>
				<p class="text-gray-300">
					With multiple SafeStack security certifications, I prioritize writing secure, efficient, and maintainable code. 
					Every project undergoes thorough security testing to protect against vulnerabilities.
				</p>
			</div>
			
			<div class="bg-gray-800 p-6 rounded-xl shadow-md text-center border border-gray-700">
				<div class="text-blue-400 text-4xl mb-4">🚀</div>
				<h3 class="text-xl font-bold mb-3 text-blue-300">Adaptability</h3>
				<p class="text-gray-300">
					My experience immigrating to New Zealand and building a career from scratch has developed my resilience and adaptability.
					I apply this mindset to technical challenges, finding creative solutions to complex problems.
				</p>
			</div>
			
			<div class="bg-gray-800 p-6 rounded-xl shadow-md text-center border border-gray-700">
				<div class="text-blue-400 text-4xl mb-4">💬</div>
				<h3 class="text-xl font-bold mb-3 text-blue-300">Clear Communication</h3>
				<p class="text-gray-300">
					Drawing from my experience as an instructor and mentor, I maintain clear, effective communication throughout projects,
					ensuring stakeholders understand technical concepts and project progress.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Testimonials Section -->
<section class="py-16 bg-gray-800">
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold text-center mb-12 text-blue-400">What Clients & Colleagues Say</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each testimonials as testimonial}
				<div class="bg-gray-900 p-8 rounded-xl shadow-md border border-gray-700">
					<div class="mb-6">
						<h3 class="font-bold text-lg text-blue-300">{testimonial.name}</h3>
						<p class="text-gray-400">{testimonial.position}, {testimonial.company}</p>
					</div>
					<p class="text-gray-300 italic">"{testimonial.quote}"</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-16 bg-gray-900 text-white">
	<div class="container mx-auto px-4 text-center">
		<h2 class="text-3xl font-bold mb-6 text-blue-400">Ready to Start Your Next Project?</h2>
		<p class="text-xl max-w-2xl mx-auto mb-8 text-gray-300">
			Let's discuss how I can help bring your ideas to life with secure, high-quality solutions tailored to your needs.
		</p>
		<div class="flex flex-col sm:flex-row justify-center gap-4">
			<a href="mailto:contact@szuhan.dev" class="bg-blue-800 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium transition-colors shadow-lg">
				Contact Me
			</a>
			<a href="/portfolio" class="bg-transparent border border-blue-500 text-blue-400 hover:bg-gray-800 px-8 py-3 rounded-lg font-medium transition-colors shadow-lg">
				View My Work
			</a>
		</div>
	</div>
</section>

<style>
	/* No need for component-specific styles as the global styles in +page.svelte handle the theme */
</style> 