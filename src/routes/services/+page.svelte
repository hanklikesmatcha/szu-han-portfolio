<script lang="ts">
	import { onMount } from 'svelte'; 
	import { animate, stagger, spring } from 'motion';
	
	// Services based on LinkedIn profile
	const services = [
		{
			title: 'Full-Stack Development',
			description: 'End-to-end web application development using modern frameworks and technologies. I build scalable, responsive applications with clean code, security focus, and optimal performance.',
			icon: '💻',
			skills: ['Python/FastAPI', 'TypeScript/React', 'PostgreSQL', 'RESTful APIs', 'Front-end Frameworks', 'GraphQL']
		},
		{
			title: 'Data Engineering and Machine Learning with Python',
			description: 'Specializing in database migrations, schema design, and table structure optimization. I help businesses build efficient data foundations and integrate machine learning models to enhance applications with AI capabilities like NLP and computer vision.',
			icon: '🤖',
			skills: ['Database Migration', 'PyTorch', 'Hugging Face', 'LangChain', 'AI Integration']
		},
		{
			title: 'Technical Mentoring',
			description: 'Expert guidance for developers and teams looking to improve their skills. Drawing from my experience as a Python Bootcamp Instructor, I can help elevate your team\'s technical capabilities through structured learning and hands-on coaching.',
			icon: '👨‍🏫',
			skills: ['Python Training', 'Code Reviews', 'Best Practices', 'Team Development', 'Technical Guidance']
		},
		{
			title: 'Cloud Services & DevOps',
			description: 'Implementation and management of cloud infrastructure and deployment pipelines. I leverage containerization and serverless technologies to create scalable, cost-effective cloud solutions that optimize performance and reliability.',
			icon: '☁️',
			skills: ['AWS', 'Azure', 'GCP', 'CI/CD Pipelines', 'Containerisation', 'Docker', 'CloudFlare']
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
	
	let heroSection: HTMLElement;
	let servicesSection: HTMLElement;
	let expertiseSection: HTMLElement;
	let testimonialSection: HTMLElement;
	let ctaSection: HTMLElement;
	
	onMount(() => {
		// Hero section animation - more dramatic entrance with staggered reveal
		try {
			animate('.hero-element', 
				{ 
					opacity: [0, 1],
					y: [50, 0],
					scale: [0.9, 1]
				},
				{ 
					delay: stagger(0.2),
					duration: 1.0,
					easing: 'cubic-bezier(0.16, 1, 0.3, 1)' // Different easing than landing page
				}
			);
		} catch (error) {
			console.error("Hero animation error:", error);
		}
		
		// Setup intersection observers for other sections
		const observerOptions = {
			threshold: 0.15,
			rootMargin: '-50px 0px -100px 0px' // Trigger earlier
		};
		
		// Services cards animation - reveal with diagonal slide
		const servicesObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					try {
						// Diagonal reveal animation - different from home page animations
						animate('.service-card', 
							{ 
								opacity: [0, 1],
								y: [80, 0],
								x: ['-40px', '0px'] // Diagonal slide
							},
							{ 
								delay: stagger(0.15),
								duration: 0.9,
								easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
							}
						);
					} catch (error) {
						console.error("Service card animation error:", error);
					}
					servicesObserver.disconnect();
				}
			});
		}, observerOptions);
		
		// Expertise section animation - reveal line by line
		const expertiseObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					try {
						// Line-by-line reveal animation - unique to this page
						animate('.expertise-element', 
							{ 
								opacity: [0, 1],
								x: ['-30px', '0px'],
								clipPath: ['inset(0 50% 0 0)', 'inset(0 0% 0 0)'] // Text reveal from left to right
							},
							{ 
								delay: stagger(0.25), // Longer delay for more dramatic effect
								duration: 0.8,
								easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
							}
						);
					} catch (error) {
						console.error("Expertise animation error:", error);
					}
					expertiseObserver.disconnect();
				}
			});
		}, observerOptions);
		
		// Testimonials animation
		const testimonialObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					try {
						// Staggered fade-in with scale and slide
						animate('.testimonial-card', 
							{ 
								opacity: [0, 1],
								y: [60, 0],
								scale: [0.9, 1]
							},
							{ 
								delay: stagger(0.25),
								duration: 0.8,
								easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
							}
						);
						
						// Add gentle pulse after appearing
						setTimeout(() => {
							document.querySelectorAll('.testimonial-card').forEach((card, i) => {
								animate(
									card,
									{ 
										scale: [1, 1.02, 1],
										boxShadow: [
											'0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
											'0 15px 25px -5px rgba(0, 0, 0, 0.3)',
											'0 4px 6px -1px rgba(0, 0, 0, 0.1)'
										]
									},
									{
										duration: 4 + i,
										delay: i * 1.5,
										repeat: Infinity,
										easing: 'ease-in-out'
									}
								);
							});
						}, 1500);
					} catch (error) {
						console.error("Testimonial animation error:", error);
					}
					testimonialObserver.disconnect();
				}
			});
		}, observerOptions);
		
		// CTA section animation - bounce in from bottom
		const ctaObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					try {
						animate('.cta-element', 
							{ 
								opacity: [0, 1],
								y: [40, 0],
								scale: [0.9, 1.05, 1] // Slight overshoot for bounce effect
							},
							{ 
								delay: stagger(0.2),
								duration: 0.8,
								easing: 'cubic-bezier(0.22, 1.5, 0.36, 1)' // Custom bounce curve
							}
						);
					} catch (error) {
						console.error("CTA animation error:", error);
					}
					ctaObserver.disconnect();
				}
			});
		}, observerOptions);
		
		// Observe sections
		if (servicesSection) servicesObserver.observe(servicesSection);
		if (expertiseSection) expertiseObserver.observe(expertiseSection);
		if (testimonialSection) testimonialObserver.observe(testimonialSection);
		if (ctaSection) ctaObserver.observe(ctaSection);
		
		// Add hover effect to service cards
		document.querySelectorAll('.service-card').forEach(card => {
			card.addEventListener('mouseenter', () => {
				animate(card, 
					{ 
						y: -10, 
						scale: 1.02,
						boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
					}, 
					{ 
						duration: 0.3,
						easing: spring({ stiffness: 300, damping: 15 })
					}
				);
			});
			
			card.addEventListener('mouseleave', () => {
				animate(card, 
					{ 
						y: 0, 
						scale: 1,
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
					}, 
					{ 
						duration: 0.3,
						easing: spring({ stiffness: 300, damping: 15 })
					}
				);
			});
		});
		
		// Add hover effect to testimonial cards
		document.querySelectorAll('.testimonial-card').forEach(card => {
			card.addEventListener('mouseenter', () => {
				animate(card, 
					{ 
						y: -5, 
						scale: 1.03,
						boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.25)'
					}, 
					{ 
						duration: 0.3,
						easing: spring({ stiffness: 300, damping: 15 })
					}
				);
			});
			
			card.addEventListener('mouseleave', () => {
				animate(card, 
					{ 
						y: 0, 
						scale: 1,
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
					}, 
					{ 
						duration: 0.3,
						easing: spring({ stiffness: 300, damping: 15 })
					}
				);
			});
		});
	});
</script>

<svelte:head>
	<title>Skills | Szu-Han Chou aka Hank</title>
	<meta name="description" content="My technical expertise in software development, security, and mentoring">
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-gray-900 to-blue-900 py-16" bind:this={heroSection}>
	<div class="container mx-auto px-4 text-center">
		<h1 class="text-4xl md:text-5xl font-bold mb-6 hero-element">Services</h1>
		<p class="text-xl max-w-3xl mx-auto mb-6 text-gray-300 hero-element">
			I provide secure, quality-focused development solutions.
		</p>
		<a href="mailto:szuhan.eng@gmail.com" class="inline-block bg-blue-800 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors hero-element">
			Get in Touch
		</a>
	</div>
</section>

<!-- Services Section -->
<section class="py-16 bg-gray-900" bind:this={servicesSection}>
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold text-center mb-10 text-blue-400">Services</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each services as service}
				<div class="service-card bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
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
<section class="py-16 bg-gray-800" bind:this={expertiseSection}>
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold text-center mb-10 text-blue-400">Technical Expertise</h2>
		
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<div class="expertise-element">
				<h3 class="text-xl font-bold mb-3 text-blue-300">AI and Machine Learning Integration</h3>
				<p class="text-gray-300 mb-6">
					My experience with AI technologies like Large Language Models, Classification, Computer Vision, and NLP enables me to integrate 
					advanced machine learning capabilities into applications, enhancing user experiences 
					and automating complex processes.
				</p>
				
				<h3 class="text-xl font-bold mb-3 text-blue-300">Educational Background</h3>
				<p class="text-gray-300">
					My experience as a Python Bootcamp Instructor has honed my ability to explain complex technical concepts clearly
					and effectively train team members on new technologies.
				</p>
			</div>
			
			<div class="expertise-element">
				<h3 class="text-xl font-bold mb-3 text-blue-300">Data Engineering Excellence</h3>
				<p class="text-gray-300 mb-6">
					I specialize in designing efficient database structures, implementing seamless migrations, and 
					optimizing table schemas for performance. My experience includes working with migration tools like 
					Python Alembic, TypeORM, Drizzle, and Prisma for the Node.js ecosystem. I've developed robust 
					database solutions for financial and energy systems while ensuring data integrity and performance.
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
<section class="py-16 bg-gray-800" bind:this={testimonialSection}>
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold text-center mb-10 text-blue-400">Testimonials</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each testimonials as testimonial}
				<div class="testimonial-card bg-gray-900 p-6 rounded-xl border border-gray-700">
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
<section class="py-12 bg-gray-900" bind:this={ctaSection}>
	<div class="container mx-auto px-4 text-center">
		<h2 class="text-2xl font-bold mb-4 text-blue-400 cta-element">Ready to start your project?</h2>
		<div class="flex justify-center gap-4">
			<a href="mailto:szuhan.eng@gmail.com" class="bg-blue-800 hover:bg-blue-700 px-6 py-2 rounded-lg text-white transition-colors cta-element">
				Contact Me
			</a>
			<a href="/portfolio" class="border border-blue-500 text-blue-400 hover:bg-gray-800 px-6 py-2 rounded-lg transition-colors cta-element">
				View My Work
			</a>
		</div>
	</div>
</section>

<style>
	/* Improve visibility for all elements */
	.hero-element, 
	.service-card, 
	.expertise-element, 
	.testimonial-card, 
	.cta-element {
		opacity: 1;
	}
	
	.service-card {
		background-color: #1E2433;
		border-color: #4A5568;
	}
	
	.testimonial-card {
		background-color: #1A202C;
		border-color: #4A5568;
	}
	
	/* Keep other transition effects */
	.service-card, .testimonial-card {
		will-change: transform, opacity, box-shadow;
		transition: border-color 0.3s ease;
	}
	
	.hero-element {
		will-change: transform, opacity;
	}
	
	.expertise-element {
		will-change: transform, opacity;
	}
	
	.cta-element {
		will-change: transform, opacity;
		transition: background-color 0.3s ease, transform 0.3s ease;
	}
	
	.cta-element:hover {
		transform: translateY(-2px);
	}
</style> 