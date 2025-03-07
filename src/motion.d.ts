declare module 'motion' {
	export interface SpringOptions {
		stiffness?: number;
		damping?: number;
		mass?: number;
		velocity?: number;
	}

	export interface AnimationOptions {
		duration?: number;
		delay?: number | ((index: number, total: number) => number);
		easing?: string | ((t: number) => number);
		repeat?: number;
		direction?: string;
		endDelay?: number;
	}

	export interface AnimationControls {
		finished: Promise<void>;
		cancel: () => void;
		pause: () => void;
		play: () => void;
		reverse: () => void;
		complete: () => void;
		stop: () => void;
	}

	export function animate(
		target: string | HTMLElement | Element | NodeList | Array<Element>,
		keyframes: Record<string, unknown>,
		options?: AnimationOptions
	): AnimationControls;

	export function spring(options?: SpringOptions): (t: number) => number;

	export function stagger(
		duration?: number,
		options?: {
			start?: number;
			from?: number | string | HTMLElement | Element;
			grid?: [number, number];
			axis?: string;
		}
	): number;

	export function timeline(
		keyframes: Array<Record<string, unknown>>,
		options?: AnimationOptions
	): AnimationControls;

	export function inView(
		target: string | HTMLElement | Element | NodeList | Array<Element>,
		callback: (entry: IntersectionObserverEntry) => void,
		options?: IntersectionObserverInit
	): () => void;
}
