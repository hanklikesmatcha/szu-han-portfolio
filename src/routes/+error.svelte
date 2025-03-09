<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let mounted = false;

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>{$page.status}: {$page.error?.message || 'Not Found'}</title>
</svelte:head>

<div class="error-container">
	<div class="error-content">
		<h1 in:fly={{ y: -50, duration: 600, delay: 200 }}>
			{#if $page.status === 404}
				404: Page Not Found
			{:else}
				{$page.status}: {$page.error?.message || 'Error'}
			{/if}
		</h1>

		<div class="animation-container" in:fade={{ duration: 800 }}>
			<div class="cat">
				<div class="cat-ears">
					<div class="cat-ear left">
						<div class="ear-inner"></div>
					</div>
					<div class="cat-ear right">
						<div class="ear-inner"></div>
					</div>
				</div>
				<div class="cat-face">
					<div class="cat-eyes">
						<div class="cat-eye left">
							<div class="eye-shine"></div>
						</div>
						<div class="cat-eye right">
							<div class="eye-shine"></div>
						</div>
					</div>
					<div class="cat-nose"></div>
					<div class="cat-mouth"></div>
					<div class="cat-whiskers">
						<div class="whisker w1"></div>
						<div class="whisker w2"></div>
						<div class="whisker w3"></div>
						<div class="whisker w4"></div>
						<div class="whisker w5"></div>
						<div class="whisker w6"></div>
					</div>
					<div class="cat-blush left"></div>
					<div class="cat-blush right"></div>
				</div>
				<div class="cat-body">
					<div class="cat-paws">
						<div class="paw left"></div>
						<div class="paw right"></div>
					</div>
					<div class="cat-tail"></div>
				</div>
			</div>
			<div class="shadow"></div>
		</div>

		<p in:fly={{ y: 50, duration: 600, delay: 400 }}>
			{#if $page.status === 404}
				Oops! The page you're looking for seems to have wandered off!
			{:else}
				Something went wrong. Please try again later.
			{/if}
		</p>

		<a href="/" class="button" in:fly={{ y: 50, duration: 600, delay: 600 }}> Take Me Home </a>
	</div>
</div>

<style>
	.error-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		background-color: #2a2d3e;
		color: #f1f1f1;
		text-align: center;
	}

	.error-content {
		max-width: 600px;
		padding: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1.5rem;
		font-weight: 700;
		color: #ff8fa3;
	}

	p {
		font-size: 1.25rem;
		margin-bottom: 2rem;
		line-height: 1.5;
	}

	.button {
		display: inline-block;
		background-color: #7b79ff;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 50px;
		text-decoration: none;
		font-weight: 600;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
	}

	.button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
		background-color: #8a87ff;
	}

	/* Cat Animation Styles */
	.animation-container {
		position: relative;
		height: 220px;
		margin: 2rem 0;
	}

	.cat {
		position: relative;
		width: 140px;
		height: 140px;
		margin: 0 auto;
		animation: float 3s infinite ease-in-out;
	}

	.shadow {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 80px;
		height: 15px;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 50%;
		animation: shadow 3s infinite ease-in-out;
	}

	.cat-ears {
		position: absolute;
		top: -20px;
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.cat-ear {
		width: 40px;
		height: 40px;
		background-color: #ffb6c1;
		border-radius: 50% 50% 0 0;
		position: relative;
		overflow: hidden;
	}

	.ear-inner {
		position: absolute;
		width: 24px;
		height: 24px;
		background-color: #ff8fa3;
		border-radius: 50% 50% 0 0;
		top: 8px;
		left: 8px;
	}

	.cat-ear.left {
		transform: rotate(-30deg);
		left: 5px;
	}

	.cat-ear.right {
		transform: rotate(30deg);
		right: 5px;
	}

	.cat-face {
		width: 100px;
		height: 100px;
		background-color: #ffdfeb;
		border-radius: 50%;
		position: absolute;
		top: 10px;
		left: 20px;
		overflow: visible;
	}

	.cat-eyes {
		display: flex;
		justify-content: space-around;
		margin-top: 30px;
	}

	.cat-eye {
		width: 16px;
		height: 24px;
		background-color: #333;
		border-radius: 50%;
		position: relative;
		animation: blink 4s infinite;
	}

	.eye-shine {
		position: absolute;
		width: 6px;
		height: 6px;
		background-color: white;
		border-radius: 50%;
		top: 5px;
		left: 2px;
	}

	.cat-nose {
		width: 12px;
		height: 8px;
		background-color: #ff8fa3;
		border-radius: 50%;
		position: absolute;
		top: 55px;
		left: 44px;
	}

	.cat-mouth {
		width: 20px;
		height: 10px;
		border-bottom: 2px solid #555;
		border-radius: 0 0 100% 100%;
		position: absolute;
		top: 65px;
		left: 40px;
	}

	.cat-whiskers {
		position: absolute;
		width: 100%;
		top: 55px;
	}

	.whisker {
		position: absolute;
		height: 1.5px;
		background-color: #999;
		border-radius: 5px;
	}

	.whisker.w1 {
		width: 25px;
		top: 0;
		left: -25px;
		transform: rotate(-10deg);
	}

	.whisker.w2 {
		width: 25px;
		top: 8px;
		left: -25px;
		transform: rotate(-5deg);
	}

	.whisker.w3 {
		width: 25px;
		top: 16px;
		left: -25px;
		transform: rotate(0deg);
	}

	.whisker.w4 {
		width: 25px;
		top: 0;
		right: -25px;
		transform: rotate(10deg);
	}

	.whisker.w5 {
		width: 25px;
		top: 8px;
		right: -25px;
		transform: rotate(5deg);
	}

	.whisker.w6 {
		width: 25px;
		top: 16px;
		right: -25px;
		transform: rotate(0deg);
	}

	.cat-blush {
		position: absolute;
		width: 15px;
		height: 8px;
		background-color: rgba(255, 143, 163, 0.4);
		border-radius: 50%;
		top: 60px;
	}

	.cat-blush.left {
		left: 15px;
	}

	.cat-blush.right {
		right: 15px;
	}

	.cat-body {
		width: 80px;
		height: 60px;
		background-color: #ffdfeb;
		position: absolute;
		left: 30px;
		top: 90px;
		border-radius: 50% / 70% 70% 40% 40%;
	}

	.cat-paws {
		position: absolute;
		bottom: -10px;
		width: 100%;
		display: flex;
		justify-content: space-around;
	}

	.paw {
		width: 22px;
		height: 14px;
		background-color: #ffb6c1;
		border-radius: 50%;
		position: relative;
	}

	.cat-tail {
		width: 12px;
		height: 65px;
		background-color: #ffb6c1;
		position: absolute;
		top: 0;
		right: -5px;
		border-radius: 6px;
		transform-origin: top center;
		animation: tail-wag 3s infinite ease-in-out;
	}

	@keyframes blink {
		0%,
		45%,
		55%,
		100% {
			transform: scaleY(1);
		}
		50% {
			transform: scaleY(0.1);
		}
	}

	@keyframes tail-wag {
		0%,
		100% {
			transform: rotate(-10deg);
		}
		50% {
			transform: rotate(40deg);
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	@keyframes shadow {
		0%,
		100% {
			width: 80px;
			opacity: 0.6;
		}
		50% {
			width: 70px;
			opacity: 0.4;
		}
	}
</style>
