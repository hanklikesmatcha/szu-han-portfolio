<script>
	// Footer component
	import { onMount } from 'svelte';
	import { animate, stagger } from 'motion';

	// Add entrance animation to icons
	onMount(() => {
		// Animate icons on initial load with staggered entrance
		try {
			const icons = document.querySelectorAll('.social-icon');
			animate(
				icons,
				{
					opacity: [0, 1],
					scale: [0.5, 1.1, 1],
					y: [30, -8, 0],
					rotate: ['-20deg', '5deg', '0deg']
				},
				{
					delay: stagger(0.15),
					duration: 0.7,
					easing: 'cubic-bezier(0.22, 1.5, 0.36, 1)'
				}
			);
		} catch (error) {
			console.error('Icon animation error:', error);
		}

		// Add much more dramatic hover animations
		document.querySelectorAll('.social-icon').forEach((icon, index) => {
			// Different hover effect for each icon to make it more interesting
			icon.addEventListener('mouseenter', () => {
				// Create dramatic glow effect on the parent link
				if (icon.parentElement) {
					animate(
						icon.parentElement,
						{
							boxShadow: ['0 0 0 rgba(59, 130, 246, 0)', '0 0 20px rgba(59, 130, 246, 0.7)']
						},
						{ duration: 0.4 }
					);
				}

				// Custom effect based on icon position
				if (index === 0) {
					// GitHub
					animate(
						icon,
						{
							scale: 1.5,
							y: -12,
							rotate: '10deg',
							fill: '#60a5fa' // blue-400
						},
						{
							duration: 0.4,
							easing: 'cubic-bezier(0.34, 2.56, 0.64, 1)' // Exaggerated bounce
						}
					);
				} else if (index === 1) {
					// LinkedIn
					animate(
						icon,
						{
							scale: 1.5,
							y: -8,
							x: 5,
							rotate: '-8deg',
							fill: '#60a5fa' // blue-400
						},
						{
							duration: 0.4,
							easing: 'cubic-bezier(0.34, 2.56, 0.64, 1)' // Exaggerated bounce
						}
					);
				} else {
					// Email
					animate(
						icon,
						{
							scale: 1.5,
							y: -10,
							x: -5,
							rotate: '15deg',
							fill: '#60a5fa' // blue-400
						},
						{
							duration: 0.4,
							easing: 'cubic-bezier(0.34, 2.56, 0.64, 1)' // Exaggerated bounce
						}
					);
				}
			});

			icon.addEventListener('mouseleave', () => {
				// Reset glow effect
				if (icon.parentElement) {
					animate(
						icon.parentElement,
						{
							boxShadow: ['0 0 20px rgba(59, 130, 246, 0.7)', '0 0 0 rgba(59, 130, 246, 0)']
						},
						{ duration: 0.5 }
					);
				}

				// Return to normal state with slight bounce
				animate(
					icon,
					{
						scale: [null, 0.9, 1], // Add bounce effect to return
						y: 0,
						x: 0,
						rotate: '0deg',
						fill: '#d1d5db' // gray-300
					},
					{
						duration: 0.5,
						easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
					}
				);
			});
		});
	});
</script>

<div class="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row">
	<p class="mb-4 text-gray-300 md:mb-0">
		© {new Date().getFullYear()} Szu-Han. All Rights Reserved.
	</p>
	<div class="flex gap-10">
		<!-- GitHub Icon -->
		<a
			href="https://github.com/hanklikesmatcha"
			target="_blank"
			rel="noopener noreferrer"
			class="social-link"
			aria-label="GitHub"
		>
			<svg
				class="social-icon"
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="#d1d5db"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.839 21.489C9.339 21.581 9.521 21.276 9.521 21.012C9.521 20.775 9.512 20.025 9.508 19.158C6.726 19.79 6.139 17.782 6.139 17.782C5.684 16.627 5.031 16.325 5.031 16.325C4.153 15.687 5.097 15.698 5.097 15.698C6.071 15.766 6.598 16.738 6.598 16.738C7.48 18.309 8.851 17.828 9.541 17.573C9.63 16.908 9.889 16.428 10.175 16.153C7.954 15.874 5.618 15.011 5.618 11.202C5.618 10.084 6.01 9.171 6.618 8.456C6.517 8.207 6.168 7.231 6.718 5.925C6.718 5.925 7.548 5.656 9.496 6.876C10.3 6.65 11.15 6.537 12 6.533C12.85 6.537 13.7 6.65 14.504 6.876C16.452 5.656 17.282 5.925 17.282 5.925C17.832 7.231 17.483 8.207 17.382 8.456C17.99 9.171 18.382 10.084 18.382 11.202C18.382 15.022 16.045 15.872 13.815 16.145C14.17 16.483 14.491 17.151 14.491 18.17C14.491 19.63 14.479 20.682 14.479 21.012C14.479 21.278 14.659 21.585 15.167 21.486C19.137 20.161 22 16.416 22 12C22 6.477 17.523 2 12 2Z"
				/>
			</svg>
		</a>

		<!-- LinkedIn Icon -->
		<a
			href="https://linkedin.com/in/szuhan-eng"
			target="_blank"
			rel="noopener noreferrer"
			class="social-link"
			aria-label="LinkedIn"
		>
			<svg
				class="social-icon"
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="#d1d5db"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M19 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V5C21 3.895 20.105 3 19 3ZM9 17H6.477V10H9V17ZM7.694 8.717C6.923 8.717 6.408 8.203 6.408 7.517C6.408 6.831 6.922 6.317 7.779 6.317C8.55 6.317 9.065 6.831 9.065 7.517C9.065 8.203 8.551 8.717 7.694 8.717ZM18 17H15.558V13.174C15.558 12.116 14.907 11.872 14.663 11.872C14.419 11.872 13.605 12.035 13.605 13.174C13.605 13.337 13.605 17 13.605 17H11.082V10H13.605V10.977C13.93 10.407 14.581 10 15.802 10C17.023 10 18 10.977 18 13.174V17Z"
				/>
			</svg>
		</a>

		<!-- Email Icon -->
		<a href="mailto:szuhan.eng@gmail.com" class="social-link" aria-label="Email">
			<svg
				class="social-icon"
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="#d1d5db"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
				/>
			</svg>
		</a>
	</div>
</div>

<style>
	.social-link {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 50px;
		border-radius: 50%;
		transition: background-color 0.3s ease;
		position: relative;
	}

	.social-link:hover {
		background-color: rgba(59, 130, 246, 0.15); /* blue-500 with opacity */
	}

	.social-link::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		z-index: -1;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.social-link:hover::after {
		opacity: 1;
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
			box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
		}
		70% {
			transform: scale(1.1);
			box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
		}
		100% {
			transform: scale(1);
			box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
		}
	}

	.social-icon {
		transform-origin: center;
		will-change: transform, fill, filter;
		filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0));
		transition: filter 0.3s ease;
	}

	.social-link:hover .social-icon {
		filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.7));
	}
</style>
