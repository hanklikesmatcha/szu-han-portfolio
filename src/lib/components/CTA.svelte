<script lang="ts">
	import { onMount } from 'svelte';
	
	// Props - making component configurable
	export let heading = "Interested in working together?";
	export let buttonText = "View My Services";
	export let buttonLink = "/services";
	export let ctaSection: HTMLElement | null = null;
	
	// Setup copy email functionality
	function setupCopyEmailFunctionality() {
		document.querySelectorAll('.copy-email-btn').forEach((btn) => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				// Cast btn to HTMLElement at the beginning to fix all TypeScript errors
				const htmlBtn = btn as HTMLElement;
				const emailAddress = 'szuhan.eng@gmail.com';
				navigator.clipboard
					.writeText(emailAddress)
					.then(() => {
						// Show success message in tooltip
						const tooltip = htmlBtn.querySelector('.copy-tooltip') as HTMLElement;
						if (tooltip) {
							tooltip.textContent = 'Email copied!';
							tooltip.classList.add('tooltip-visible');

							// Create and display success animation elements

							// 1. Create ripple effect
							const ripple = document.createElement('span');
							ripple.className = 'copy-ripple';
							htmlBtn.appendChild(ripple);

							// 2. Add animation class to button
							htmlBtn.classList.add('copy-success-pulse');
							
							// 3. Add border animation effect 
							htmlBtn.classList.add('border-animate');

							// 4. Handle text content change for Contact Me buttons
							const hasButtonText = htmlBtn.childNodes.length > 0 && 
								Array.from(htmlBtn.childNodes).some(node => 
									node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== '');
							
		
							
							// IMPORTANT: We'll use a single approach that works for both button types
							// First, store the complete button HTML before changing anything
							const originalHTML = htmlBtn.innerHTML;
							htmlBtn.dataset.originalHTML = originalHTML;
							
							// Clear everything inside the button
							htmlBtn.innerHTML = '';
							
							// Add a single, consistent success message
							const successContent = document.createElement('div');
							successContent.className = 'copy-success-content';
							successContent.innerHTML = `<span class="success-text">Email copied!</span>`;
							htmlBtn.appendChild(successContent);
							
							// If there was an SVG icon, make sure to preserve it
							if (originalHTML.includes('<svg')) {
								console.log('Button had an SVG icon, preserving it');
								// The button had an SVG icon, try to preserve it
								const parser = new DOMParser();
								const doc = parser.parseFromString(originalHTML, 'text/html');
								const svg = doc.querySelector('svg');
								if (svg) {
									// Add the SVG back
									htmlBtn.appendChild(svg);
								}
							}

							// Clean up elements after animations complete
							setTimeout(() => {
								ripple.remove();
								htmlBtn.classList.remove('copy-success-pulse');
								htmlBtn.classList.remove('border-animate');

								// Restore original HTML completely
								if (htmlBtn.dataset.originalHTML) {
									htmlBtn.innerHTML = htmlBtn.dataset.originalHTML;
									delete htmlBtn.dataset.originalHTML;
								}

								tooltip.textContent = 'Copy email address';
								tooltip.classList.remove('tooltip-visible');
							}, 2000);
						}
					})
					.catch((err) => {
						console.error('Failed to copy email: ', err);
					});
			});

			// Show tooltip on hover
			btn.addEventListener('mouseenter', () => {
				const htmlBtn = btn as HTMLElement;
				const tooltip = htmlBtn.querySelector('.copy-tooltip') as HTMLElement;
				if (tooltip) {
					tooltip.classList.add('tooltip-visible');
				}
			});

			// Hide tooltip on mouse leave
			btn.addEventListener('mouseleave', () => {
				const htmlBtn = btn as HTMLElement;
				const tooltip = htmlBtn.querySelector('.copy-tooltip') as HTMLElement;
				if (tooltip && tooltip.textContent !== 'Email copied!') {
					tooltip.classList.remove('tooltip-visible');
				}
			});
		});
	}
	
	onMount(() => {
		// Setup copy email functionality
		setupCopyEmailFunctionality();
	});
</script>

<!-- CTA Section -->
<section class="bg-gray-900 py-12" bind:this={ctaSection}>
	<div class="container mx-auto px-4 text-center">
		<h2 class="cta-element mb-4 text-2xl font-bold text-blue-400">
			{heading}
		</h2>
		<div class="flex justify-center gap-4">
			<a
				href={buttonLink}
				class="cta-element cta-button-fixed rounded-lg border border-blue-500 px-6 py-2 text-blue-400 transition-colors hover:bg-gray-800"
			>
				{buttonText}
			</a>
			<button
				class="copy-email-btn cta-element cta-button-fixed relative rounded-lg bg-blue-800 px-6 py-2 text-white transition-colors hover:bg-blue-700"
			>
				<span
					class="copy-tooltip absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity"
					>Copy email address</span
				>
				Contact Me
			</button>
		</div>
	</div>
</section>

<style>
	/* Email button tooltip styles */
	.copy-email-btn {
		position: relative;
		cursor: pointer;
		overflow: hidden; /* Ensure ripple doesn't overflow */
		transition: all 0.3s ease;
	}

	.copy-email-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
	}

	.copy-email-btn:active {
		transform: translateY(1px);
	}

	
	@keyframes border-flow {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.copy-tooltip {
		z-index: 10;
		pointer-events: none;
		white-space: nowrap;
		/* Add a small triangle/arrow */
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
	}

	.copy-tooltip:after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		margin-left: -6px;
		border-width: 6px;
		border-style: solid;
		border-color: #1a202c transparent transparent transparent;
	}

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
			box-shadow: 0 0 0 0 rgba(237, 100, 166, 0.7);
		}
		70% {
			box-shadow: 0 0 0 15px rgba(237, 100, 166, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(237, 100, 166, 0);
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

	/* CTA element styling */
	.cta-element {
		opacity: 1;
		transform-style: preserve-3d;
		backface-visibility: hidden;
		will-change: transform, opacity;
		transition: all 0.3s ease;
	}

	/* Fixed-size CTA buttons that don't scale */
	.cta-button-fixed {
		transform: none !important;
		transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
		will-change: background-color, color, border-color;
		min-width: 160px;
		height: 40px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		overflow: hidden;
		white-space: nowrap;
		line-height: 1;
		padding: 0 1.5rem;
		font-size: 1rem;
	}
</style> 