<script lang="ts">
	import { onMount } from 'svelte';
	import BackgroundAnimation from '$lib/components/BackgroundAnimation.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Testimonial from '$lib/components/Testimonial.svelte';
	import CTA from '$lib/components/CTA.svelte';
	import SharedStyles from '$lib/components/SharedStyles.svelte';

	// Add state variable for the 3D animation
	let animationComponent: BackgroundAnimation | null = null;
	
	// Skills based on LinkedIn profile
	const skills = [
		'Full-Stack Development',
		'Python',
		'TypeScript',
		'Cloud Services & DevOps',
		'AWS',
		'Azure',
		'Hugging Face',
		'PyTorch',
		'LangChain',
		'Supabase',
		'Mobile Development',
		'Database Migration',
		'Data Engineering and Machine Learning with Python',
		'Technical Mentoring'
	];

	let heroSection: HTMLElement;
	let aboutSection: HTMLElement;
	let fireworksCanvas: HTMLCanvasElement;
	let testimonialSection: HTMLElement;
	let ctaSection: HTMLElement;
	let gradientCanvas: HTMLCanvasElement;

	// Add click counters for name animations
	let hankClickCount = 0;
	let szuhanClickCount = 0;

	// Logic for handling name clicks (could be extracted to a utility file)
	function handleNameClick(name: string) {
		if (name === 'hank') {
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
		} else if (name === 'szuhan') {
			szuhanClickCount++;
			const nameElement = document.querySelector('.szuhan-highlight') as HTMLElement;
			if (!nameElement) return;

			// Clear existing animations
			nameElement.classList.remove('animate-pulse', 'animate-shake', 'animate-rotate', 'animate-bounce');

			// Apply different animations based on click count
			if (szuhanClickCount % 4 === 1) {
				nameElement.style.animation = 'name-pulse 0.5s ease';
			} else if (szuhanClickCount % 4 === 2) {
				nameElement.style.animation = 'name-shake 0.5s ease';
			} else if (szuhanClickCount % 4 === 3) {
				nameElement.style.animation = 'name-rotate 0.8s ease';
			} else {
				nameElement.style.animation = 'name-bounce 1s ease';
			}

			// Reset animation after it completes
			setTimeout(() => {
				nameElement.style.animation = '';
			}, 1000);
		}
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

<svelte:head>
	<title>Hank Chou | AI-Powered Software Engineer</title>
	<meta
		name="description"
		content="Hank Chou - A senior software engineer specializing in AI-driven applications, responsive web development, and scalable cloud solutions."
	/>
	<!-- Open Graph / Social Media Meta Tags -->
	<meta property="og:title" content="Hank Chou | AI-Powered Software Engineer" />
	<meta property="og:description" content="Senior software engineer specializing in AI-driven applications, responsive web development, and scalable cloud solutions." />
	<meta property="og:image" content="https://hankchou.me/images/hank-social.png" />
	<meta property="og:url" content="https://hankchou.me" />
</svelte:head>

<SharedStyles />

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

<style>
	/* Email button styles needed for animation */

	@keyframes copy-ripple {
		0% {
			width: 0;
			height: 0;
			opacity: 0.6;
		}
		100% {
			width: 200%;
			height: 200%;
			opacity: 0;
		}
	}
	@keyframes copy-pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.7);
		}
		70% {
			box-shadow: 0 0 0 15px rgba(66, 153, 225, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
		}
	}


	@keyframes fadeInOut {
		0% {
			opacity: 0;
			transform: scale(0.8) translateY(5px);
		}
		15% {
			opacity: 1;
			transform: scale(1.1) translateY(0);
		}
		25% {
			transform: scale(1) translateY(0);
		}
		85% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
		100% {
			opacity: 0;
			transform: scale(0.8) translateY(-5px);
		}
	}

	/* Name animation keyframes */
	@keyframes name-pulse {
		0% { transform: scale(1); }
		50% { transform: scale(1.1); }
		100% { transform: scale(1); }
	}

	@keyframes name-shake {
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-5px); }
		50% { transform: translateX(5px); }
		75% { transform: translateX(-5px); }
	}

	@keyframes name-rotate {
		0% { transform: rotate(0deg); }
		25% { transform: rotate(5deg); }
		50% { transform: rotate(-5deg); }
		75% { transform: rotate(5deg); }
		100% { transform: rotate(0deg); }
	}

	@keyframes name-bounce {
		0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
		40% { transform: translateY(-10px); }
		60% { transform: translateY(-5px); }
	}
</style>
