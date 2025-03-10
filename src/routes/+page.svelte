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
		
		document.querySelectorAll('.copy-email-btn').forEach((button) => {
			button.addEventListener('click', async () => {
				try {
					// Copy my email to clipboard
					await navigator.clipboard.writeText('hank@chou.dev');

					// Get the tooltip element
					const tooltip = button.querySelector('.copy-tooltip');
					if (tooltip) {
						// Update the tooltip text to show success
						tooltip.textContent = 'Email copied!';
						tooltip.classList.add('opacity-100');

						// Hide the tooltip after 2 seconds
						setTimeout(() => {
							tooltip.classList.remove('opacity-100');
							// Reset tooltip text after it's hidden
							setTimeout(() => {
								tooltip.textContent = 'Copy email address';
							}, 300);
						}, 2000);
					}

					// Add visual feedback to the button
					button.classList.add('animate-pulse');
					setTimeout(() => {
						button.classList.remove('animate-pulse');
					}, 1000);
				} catch (err) {
					console.error('Failed to copy email: ', err);
				}
			});
		});
	});
</script>

<svelte:head>
	<title>Hank Chou | AI-Powered Software Engineer</title>
	<meta
		name="description"
		content="Hank Chou - A senior software engineer specializing in AI-driven applications, responsive web development, and scalable cloud solutions."
	/>
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

<CTA bind:ctaSection />
