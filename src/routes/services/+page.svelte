<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, stagger, spring } from 'motion';

	// Services based on LinkedIn profile
	const services = [
		{
			title: 'Full-Stack Development',
			description:
				'End-to-end web application development using modern frameworks and technologies. I build scalable, responsive applications with clean code, security focus, and optimal performance.',
			icon: '💻',
			skills: [
				'Python/FastAPI',
				'TypeScript/React',
				'PostgreSQL',
				'RESTful APIs',
				'Front-end Frameworks',
				'GraphQL'
			]
		},
		{
			title: 'Data Engineering and Machine Learning with Python',
			description:
				'Specializing in database migrations, schema design, and table structure optimization. I help businesses build efficient data foundations and integrate machine learning models to enhance applications with AI capabilities like NLP and computer vision.',
			icon: '🤖',
			skills: ['Database Migration', 'PyTorch', 'Hugging Face', 'LangChain', 'AI Integration']
		},
		{
			title: 'Technical Mentoring',
			description:
				"Expert guidance for developers and teams looking to improve their skills. Drawing from my experience as a Python Bootcamp Instructor, I can help elevate your team's technical capabilities through structured learning and hands-on coaching.",
			icon: '👨‍🏫',
			skills: [
				'Python Training',
				'Code Reviews',
				'Best Practices',
				'Team Development',
				'Technical Guidance'
			]
		},
		{
			title: 'Cloud Services & DevOps',
			description:
				'Implementation and management of cloud infrastructure and deployment pipelines. I leverage containerization and serverless technologies to create scalable, cost-effective cloud solutions that optimize performance and reliability.',
			icon: '☁️',
			skills: ['AWS', 'Azure', 'GCP', 'CI/CD Pipelines', 'Containerisation', 'Docker', 'CloudFlare']
		}
	];

	let heroSection: HTMLElement;
	let servicesSection: HTMLElement;
	let expertiseSection: HTMLElement;
	let ctaSection: HTMLElement;
	
	// Track scroll position and direction
	let lastScrollTop = 0;
	let scrollDirection = 'down';
	
	// Track element visibility states
	let sectionStates = {
		hero: { visible: false, animated: { down: false, up: false } },
		services: { visible: false, animated: { down: false, up: false } },
		expertise: { visible: false, animated: { down: false, up: false } },
		cta: { visible: false, animated: { down: false, up: false } }
	};

	onMount(() => {
		// Initial hero section animation
		animateHeroSection('down');
		sectionStates.hero.animated.down = true;
		
		// Setup scroll direction detection
		window.addEventListener('scroll', () => {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
			lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
		});

		// Setup intersection observers for sections
		const observerOptions = {
			threshold: 0.15,
			rootMargin: '-50px 0px -100px 0px'
		};

		// Create observer for tracking elements leaving the viewport
		const exitObserverOptions = {
			threshold: 0,
			rootMargin: '0px 0px 0px 0px'
		};

		// Hero section observer
		const heroObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const isVisible = entry.isIntersecting;
				const wasVisible = sectionStates.hero.visible;
				sectionStates.hero.visible = isVisible;
				
				// Element is entering viewport
				if (isVisible && scrollDirection === 'up' && !sectionStates.hero.animated.up) {
					animateHeroSection('up');
					sectionStates.hero.animated.up = true;
				} else if (isVisible && scrollDirection === 'down' && !sectionStates.hero.animated.down) {
					animateHeroSection('down');
					sectionStates.hero.animated.down = true;
				} 
				// Element is leaving viewport
				else if (wasVisible && !isVisible) {
					if (scrollDirection === 'up') {
						// When scrolling up and hero section moves out of view (below viewport)
						animateHeroSectionExit('down');
					} else {
						// When scrolling down and hero section moves out of view (above viewport)
						animateHeroSectionExit('up');
					}
					// Reset animation flags when section is out of view
					sectionStates.hero.animated = { up: false, down: false };
				}
			});
		}, observerOptions);

		// Services section observer
		const servicesObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const isVisible = entry.isIntersecting;
				const wasVisible = sectionStates.services.visible;
				sectionStates.services.visible = isVisible;
				
				// Element is entering viewport
				if (isVisible && scrollDirection === 'down' && !sectionStates.services.animated.down) {
					animateServicesSection('down');
					sectionStates.services.animated.down = true;
				} else if (isVisible && scrollDirection === 'up' && !sectionStates.services.animated.up) {
					animateServicesSection('up');
					sectionStates.services.animated.up = true;
				} 
				// Element is leaving viewport
				else if (wasVisible && !isVisible) {
					if (scrollDirection === 'up') {
						// When scrolling up and services section moves out of view (below viewport)
						animateServicesSectionExit('down');
					} else {
						// When scrolling down and services section moves out of view (above viewport)
						animateServicesSectionExit('up');
					}
					// Reset animation flags when section is out of view
					sectionStates.services.animated = { up: false, down: false };
				}
			});
		}, observerOptions);

		// Expertise section observer
		const expertiseObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const isVisible = entry.isIntersecting;
				const wasVisible = sectionStates.expertise.visible;
				sectionStates.expertise.visible = isVisible;
				
				// Element is entering viewport
				if (isVisible && scrollDirection === 'down' && !sectionStates.expertise.animated.down) {
					animateExpertiseSection('down');
					sectionStates.expertise.animated.down = true;
				} else if (isVisible && scrollDirection === 'up' && !sectionStates.expertise.animated.up) {
					animateExpertiseSection('up');
					sectionStates.expertise.animated.up = true;
				} 
				// Element is leaving viewport
				else if (wasVisible && !isVisible) {
					if (scrollDirection === 'up') {
						// When scrolling up and expertise section moves out of view (below viewport)
						animateExpertiseSectionExit('down');
					} else {
						// When scrolling down and expertise section moves out of view (above viewport)
						animateExpertiseSectionExit('up');
					}
					// Reset animation flags when section is out of view
					sectionStates.expertise.animated = { up: false, down: false };
				}
			});
		}, observerOptions);

		// CTA section observer
		const ctaObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const isVisible = entry.isIntersecting;
				const wasVisible = sectionStates.cta.visible;
				sectionStates.cta.visible = isVisible;
				
				// Element is entering viewport
				if (isVisible && scrollDirection === 'down' && !sectionStates.cta.animated.down) {
					animateCTASection('down');
					sectionStates.cta.animated.down = true;
				} else if (isVisible && scrollDirection === 'up' && !sectionStates.cta.animated.up) {
					animateCTASection('up');
					sectionStates.cta.animated.up = true;
				} 
				// Element is leaving viewport
				else if (wasVisible && !isVisible) {
					if (scrollDirection === 'up') {
						// When scrolling up and CTA section moves out of view (below viewport)
						animateCTASectionExit('down');
					} else {
						// When scrolling down and CTA section moves out of view (above viewport)
						animateCTASectionExit('up');
					}
					// Reset animation flags when section is out of view
					sectionStates.cta.animated = { up: false, down: false };
				}
			});
		}, observerOptions);

		// Animation functions for each section based on scroll direction
		function animateHeroSection(direction: 'up' | 'down') {
			try {
				const elements = document.querySelectorAll('.hero-element');
				if (elements && elements.length > 0) {
					animate(
						'.hero-element',
						{
							opacity: [0, 1],
							y: direction === 'down' ? [50, 0] : [-50, 0],
							scale: direction === 'down' ? [0.9, 1] : [1.1, 1]
						},
						{
							delay: stagger(0.2),
							duration: 1.0,
							easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
						}
					);
				}
			} catch (error) {
				console.error('Hero animation error:', error);
			}
		}

		// Exit animations for when elements leave viewport
		function animateHeroSectionExit(direction: 'up' | 'down') {
			try {
				// Check if elements exist before animating
				const elements = document.querySelectorAll('.hero-element');
				if (elements && elements.length > 0) {
					animate(
						'.hero-element',
						{
							opacity: [1, 0],
							y: direction === 'down' ? [0, 50] : [0, -50],
							scale: direction === 'down' ? [1, 0.9] : [1, 1.1]
						},
						{
							delay: stagger(0.1, { from: 'last' }), // Reverse stagger for exit
							duration: 0.6, // Faster exit animation
							easing: 'cubic-bezier(0.6, 0.1, 0.9, 0.4)'
						}
					);
				}
			} catch (error) {
				console.error('Hero exit animation error:', error);
			}
		}

		function animateServicesSection(direction: 'up' | 'down') {
			try {
				const elements = document.querySelectorAll('.service-card');
				if (elements && elements.length > 0) {
					animate(
						'.service-card',
						{
							opacity: [0, 1],
							y: direction === 'down' ? [80, 0] : [-80, 0],
							x: direction === 'down' ? ['-40px', '0px'] : ['40px', '0px']
						},
						{
							delay: stagger(0.15),
							duration: 0.9,
							easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
						}
					);
				}
			} catch (error) {
				console.error('Service card animation error:', error);
			}
		}

		function animateServicesSectionExit(direction: 'up' | 'down') {
			try {
				// Check if elements exist before animating
				const elements = document.querySelectorAll('.service-card');
				if (elements && elements.length > 0) {
					animate(
						'.service-card',
						{
							opacity: [1, 0],
							y: direction === 'down' ? [0, 80] : [0, -80],
							x: direction === 'down' ? ['0px', '-40px'] : ['0px', '40px']
						},
						{
							delay: stagger(0.1, { from: 'last' }),
							duration: 0.6,
							easing: 'cubic-bezier(0.6, 0.1, 0.9, 0.4)'
						}
					);
				}
			} catch (error) {
				console.error('Service card exit animation error:', error);
			}
		}

		function animateExpertiseSection(direction: 'up' | 'down') {
			try {
				const elements = document.querySelectorAll('.expertise-element');
				if (elements && elements.length > 0) {
					animate(
						'.expertise-element',
						{
							opacity: [0, 1],
							x: direction === 'down' ? ['-30px', '0px'] : ['30px', '0px'],
							clipPath: direction === 'down' 
								? ['inset(0 50% 0 0)', 'inset(0 0% 0 0)'] // Left to right
								: ['inset(0 0 0 50%)', 'inset(0 0% 0 0)']  // Right to left
						},
						{
							delay: stagger(0.25),
							duration: 0.8,
							easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
						}
					);
				}
			} catch (error) {
				console.error('Expertise animation error:', error);
			}
		}

		function animateExpertiseSectionExit(direction: 'up' | 'down') {
			try {
				// Check if elements exist before animating
				const elements = document.querySelectorAll('.expertise-element');
				if (elements && elements.length > 0) {
					animate(
						'.expertise-element',
						{
							opacity: [1, 0],
							x: direction === 'down' ? ['0px', '-30px'] : ['0px', '30px'],
							clipPath: direction === 'down' 
								? ['inset(0 0% 0 0)', 'inset(0 50% 0 0)'] // Right to left
								: ['inset(0 0% 0 0)', 'inset(0 0 0 50%)']  // Left to right
						},
						{
							delay: stagger(0.15, { from: 'last' }),
							duration: 0.6,
							easing: 'cubic-bezier(0.6, 0.1, 0.9, 0.4)'
						}
					);
				}
			} catch (error) {
				console.error('Expertise exit animation error:', error);
			}
		}

		function animateCTASection(direction: 'up' | 'down') {
			try {
				const elements = document.querySelectorAll('.cta-element');
				if (elements && elements.length > 0) {
					animate(
						'.cta-element',
						{
							opacity: [0, 1],
							y: direction === 'down' ? [40, 0] : [-40, 0],
							scale: direction === 'down' ? [0.9, 1.05, 1] : [1.1, 0.95, 1] // Different bounce effect based on direction
						},
						{
							delay: stagger(0.2),
							duration: 0.8,
							easing: 'cubic-bezier(0.22, 1.5, 0.36, 1)'
						}
					);
				}
			} catch (error) {
				console.error('CTA animation error:', error);
			}
		}

		function animateCTASectionExit(direction: 'up' | 'down') {
			try {
				// Check if elements exist before animating
				const elements = document.querySelectorAll('.cta-element');
				if (elements && elements.length > 0) {
					animate(
						'.cta-element',
						{
							opacity: [1, 0],
							y: direction === 'down' ? [0, 40] : [0, -40],
							scale: direction === 'down' ? [1, 0.9] : [1, 1.1]
						},
						{
							delay: stagger(0.1, { from: 'last' }),
							duration: 0.6,
							easing: 'cubic-bezier(0.6, 0.1, 0.9, 0.4)'
						}
					);
				}
			} catch (error) {
				console.error('CTA exit animation error:', error);
			}
		}

		// Observe sections
		if (heroSection) heroObserver.observe(heroSection);
		if (servicesSection) servicesObserver.observe(servicesSection);
		if (expertiseSection) expertiseObserver.observe(expertiseSection);
		if (ctaSection) ctaObserver.observe(ctaSection);

		// Add hover effect to service cards safely
		const serviceCards = document.querySelectorAll('.service-card');
		if (serviceCards && serviceCards.length > 0) {
			serviceCards.forEach((card) => {
				card.addEventListener('mouseenter', () => {
					animate(
						card,
						{
							y: -10,
							scale: 1.02,
							boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
						},
						{
							duration: 0.3,
							easing: (x) => {
								try {
									// Safely call spring with fallback
									return spring({ stiffness: 300, damping: 15 })(x) || x;
								} catch (error) {
									console.error('Spring animation error:', error);
									// Fallback to a simple cubic bezier easing
									return 0.34 * (1 - Math.cos(Math.PI * x));
								}
							}
						}
					);
				});

				card.addEventListener('mouseleave', () => {
					animate(
						card,
						{
							y: 0,
							scale: 1,
							boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
						},
						{
							duration: 0.3,
							easing: (x) => {
								try {
									// Safely call spring with fallback
									return spring({ stiffness: 300, damping: 15 })(x) || x;
								} catch (error) {
									console.error('Spring animation error:', error);
									// Fallback to a simple cubic bezier easing
									return 0.34 * (1 - Math.cos(Math.PI * x));
								}
							}
						}
					);
				});
			});
		}
	});
</script>

<svelte:head>
	<title>Skills | Hank aka Szu-Han Chou </title>
	<meta
		name="description"
		content="My technical expertise in software development, security, and mentoring"
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-gray-900 to-blue-900 py-16" bind:this={heroSection}>
	<div class="container mx-auto px-4 text-center">
		<h1 class="hero-element mb-6 text-4xl font-bold md:text-5xl">Services</h1>
		<p class="hero-element mx-auto mb-6 max-w-3xl text-xl text-gray-300">
			I provide secure, quality-focused development solutions.
		</p>
		<div class="hero-element flex justify-center gap-3">
			<a
				href="https://www.linkedin.com/in/szuhan-eng"
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center justify-center rounded-lg bg-[#0077b5] p-3 text-white shadow-lg transition-all hover:bg-[#006699]"
				aria-label="LinkedIn Profile"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-7 w-7 transform transition-transform group-hover:scale-110"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
					/>
				</svg>
			</a>
			<a
				href="mailto:szuhan.eng@gmail.com"
				class="group flex items-center justify-center rounded-lg bg-purple-700 p-3 text-white shadow-lg transition-all hover:bg-purple-600"
				aria-label="Email Me"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-7 w-7 transform transition-transform group-hover:-translate-y-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
			</a>
		</div>
	</div>
</section>

<!-- Services Section -->
<section class="bg-gray-900 py-16" bind:this={servicesSection}>
	<div class="container mx-auto px-4">
		<h2 class="mb-10 text-center text-3xl font-bold text-blue-400">Services</h2>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			{#each services as service}
				<div
					class="service-card rounded-xl border border-gray-700 bg-gray-800 p-6 transition-colors hover:border-blue-500"
				>
					<div class="mb-4 text-4xl">{service.icon}</div>
					<h3 class="mb-3 text-2xl font-bold text-blue-300">{service.title}</h3>
					<p class="mb-4 text-gray-300">{service.description}</p>

					<div class="flex flex-wrap gap-2">
						{#each service.skills.slice(0, 4) as skill}
							<span class="rounded-full bg-gray-700 px-3 py-1 text-xs text-blue-300">{skill}</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Technical Expertise Section -->
<section class="bg-gray-800 py-16" bind:this={expertiseSection}>
	<div class="container mx-auto px-4">
		<h2 class="mb-10 text-center text-3xl font-bold text-blue-400">Technical Expertise</h2>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<div class="expertise-element">
				<h3 class="mb-3 text-xl font-bold text-blue-300">AI and Machine Learning Integration</h3>
				<p class="mb-6 text-gray-300">
					My experience with AI technologies like Large Language Models, Classification, Computer
					Vision, and NLP enables me to integrate advanced machine learning capabilities into
					applications, enhancing user experiences and automating complex processes.
				</p>

				<h3 class="mb-3 text-xl font-bold text-blue-300">Educational Background</h3>
				<p class="text-gray-300">
					My experience as a Python Bootcamp Instructor has honed my ability to explain complex
					technical concepts clearly and effectively train team members on new technologies.
				</p>
			</div>

			<div class="expertise-element">
				<h3 class="mb-3 text-xl font-bold text-blue-300">Data Engineering Excellence</h3>
				<p class="mb-6 text-gray-300">
					I specialize in designing efficient database structures, implementing seamless migrations,
					and optimizing table schemas for performance. My experience includes working with
					migration tools like Python Alembic, TypeORM, Drizzle, and Prisma for the Node.js
					ecosystem. I've developed robust database solutions for financial and energy systems while
					ensuring data integrity and performance.
				</p>

				<h3 class="mb-3 text-xl font-bold text-blue-300">Adaptability & Problem-Solving</h3>
				<p class="text-gray-300">
					I approach technical challenges with creativity and persistence, finding solutions even
					when the path forward isn't immediately clear.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="bg-gray-900 py-12" bind:this={ctaSection}>
	<div class="container mx-auto px-4 text-center">
		<h2 class="cta-element mb-4 text-2xl font-bold text-blue-400">Ready to start your project?</h2>
		<div class="flex justify-center gap-4">
			<a
				href="mailto:szuhan.eng@gmail.com"
				class="cta-element rounded-lg bg-blue-800 px-6 py-2 text-white transition-colors hover:bg-blue-700"
			>
				Contact Me
			</a>
			<a
				href="/portfolio"
				class="cta-element rounded-lg border border-blue-500 px-6 py-2 text-blue-400 transition-colors hover:bg-gray-800"
			>
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
	.cta-element {
		opacity: 1;
	}

	.service-card {
		background-color: #1e2433;
		border-color: #4a5568;
	}

	/* Keep other transition effects */
	.service-card {
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
		transition:
			background-color 0.3s ease,
			transform 0.3s ease;
	}

	.cta-element:hover {
		transform: translateY(-2px);
	}
</style>
