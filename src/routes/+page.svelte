<script lang="ts">
	import { onMount } from 'svelte';
	import BackgroundAnimation from '$lib/components/BackgroundAnimation.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Testimonial from '$lib/components/Testimonial.svelte';
	import CTA from '$lib/components/CTA.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import '$lib/styles/animations.css'; // Import the global animations

	// Add state variable for the 3D animation
	let animationComponent: BackgroundAnimation | null = null;
	
	// Skills based on LinkedIn profile
	const skills = [
		'AI Business Solutions',
		'Custom Software',
		'Data Insights',
		'Scalable Cloud Systems',
		'Digital Transformation',
		'Process Automation',
		'Web & Mobile Apps',
		'User Experience Design',
		'Technology Roadmapping'
	];

	let heroSection: HTMLElement;
	let aboutSection: HTMLElement;
	let fireworksCanvas: HTMLCanvasElement;
	let testimonialSection: HTMLElement;
	let ctaSection: HTMLElement;
	let gradientCanvas: HTMLCanvasElement;

	// Add click counters for name animations
	let hankClickCount = 0;

	// Logic for handling name clicks (could be extracted to a utility file)
	function handleNameClick(name: string) {
		if (name !== 'hank') {
			return;
		}

		hankClickCount++;
		const nameElement = document.querySelector('.hank-highlight') as HTMLElement;
		if (!nameElement) return;

		// Clear existing animations
		nameElement.classList.remove('animate-pulse', 'animate-shake', 'animate-rotate', 'animate-bounce');

		// Apply different animations based on click count
		if (hankClickCount % 4 === 1) {
			nameElement.style.animation = 'name-pulse 0.5s ease';
		} else if (hankClickCount % 4 === 2) {
			nameElement.style.animation = 'name-shake 0.5s ease';
		} else if (hankClickCount % 4 === 3) {
			nameElement.style.animation = 'name-rotate 0.8s ease';
		} else {
			nameElement.style.animation = 'name-bounce 1s ease';
		}

		// Reset animation after it completes
		setTimeout(() => {
			nameElement.style.animation = '';
		}, 1000);
	}

	onMount(() => {
		try {
			// Create animation instance after component is mounted
			if (animationComponent && animationComponent.initAnimation) {
				animationComponent.initAnimation();
			}

			// Trigger landing animations, with appropriate delay for smooth sequence
			if (heroSection) {
				setTimeout(() => {
					heroSection.classList.add('active');
				}, 300);
			}

			if (aboutSection) {
				// Animate about section when scrolled into view
				const aboutObserver = new IntersectionObserver((entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							aboutSection.classList.add('active');
							// Unobserve to trigger only once
							aboutObserver.unobserve(aboutSection);
						}
					});
				}, { threshold: 0.25 });

				aboutObserver.observe(aboutSection);
			}

			if (testimonialSection) {
				// Animate testimonial section when scrolled into view
				const testimonialObserver = new IntersectionObserver((entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							testimonialSection.classList.add('active');
							testimonialObserver.unobserve(testimonialSection);
						}
					});
				}, { threshold: 0.25 });

				testimonialObserver.observe(testimonialSection);
			}

			if (ctaSection) {
				// Animate CTA section when scrolled into view
				const ctaObserver = new IntersectionObserver((entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							ctaSection.classList.add('active');
							ctaObserver.unobserve(ctaSection);
						}
					});
				}, { threshold: 0.25 });

				ctaObserver.observe(ctaSection);
			}
		} catch (error) {
			console.error('Error in onMount:', error);
		}
	});
</script>

<SEO 
	title="Hank Chou | AI-Powered Software Engineer"
	description="Hank Chou - A senior software engineer specializing in AI-driven applications, responsive web development, and scalable cloud solutions."
	image="https://hankchou.me/images/hank-social.png"
	url="https://hankchou.me"
	type="website"
	keywords="hank chou, senior software engineer, AI development, software development, cloud architecture, San Francisco, tech consultant, SvelteKit, web applications"
	jsonLd={{
		'@type': 'Person',
		'name': 'Hank Chou',
		'jobTitle': 'Senior Software Engineer',
		'url': 'https://hankchou.me',
		'sameAs': [
			'https://github.com/hankszuhan',
			'https://linkedin.com/in/hankchou'
		],
		'knowsAbout': [
			'AI-Powered Applications',
			'Software Engineering',
			'Cloud Architecture',
			'Web Development',
			'Mobile Applications',
			'Digital Transformation'
		],
		'alumniOf': {
			'@type': 'CollegeOrUniversity',
			'name': 'University of California, Berkeley'
		},
		'workLocation': {
			'@type': 'Place',
			'address': {
				'@type': 'PostalAddress',
				'addressLocality': 'San Francisco',
				'addressRegion': 'CA',
				'addressCountry': 'US'
			}
		}
	}}
/>

<BackgroundAnimation bind:this={animationComponent} />

<Hero 
	{skills} 
	bind:heroSection
	bind:fireworksCanvas
	bind:gradientCanvas
	{handleNameClick}
/>

<About bind:aboutSection />

<Testimonial bind:testimonialSection />

<CTA 
	bind:ctaSection 
	heading="Ready to explore my work?" 
	buttonText="View My Work" 
	buttonLink="/portfolio" 
/>
