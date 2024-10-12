<script lang="ts">
	import type { Snippet } from 'svelte';

	import { ChevronUp, ChevronDown } from 'lucide-svelte';

	import { ScrollArea } from '$lib/components/ui/scroll-area';

	type Props = {
		children: Snippet<[]>;
		showArrows?: boolean;
	};
	let { showArrows = true, children }: Props = $props();

	let showTopArrow = $state(false);
	let showBottomArrow = $state(false);
	let topRef = $state<HTMLDivElement | null>(null);
	let bottomRef = $state<HTMLDivElement | null>(null);

	$effect(() => {
		const topObserver = new IntersectionObserver(
			([entry]) => {
				showTopArrow = !entry.isIntersecting;
			},
			{ threshold: 0 }
		);

		const bottomObserver = new IntersectionObserver(
			([entry]) => {
				showBottomArrow = !entry.isIntersecting;
			},
			{ threshold: 0 }
		);

		if (topRef) {
			topObserver.observe(topRef);
		}

		if (bottomRef) {
			bottomObserver.observe(bottomRef);
		}
		return () => {
			topObserver.disconnect();
			bottomObserver.disconnect();
		};
	});
</script>

<div class="relative overflow-hidden">
	{#if showTopArrow && showArrows}
		<div
			class="absolute left-1/2 top-1.5 z-10 -translate-x-1/2 transform rounded-full bg-background/80 p-1 shadow-md">
			<ChevronUp className="h-4 w-4 text-foreground" />
		</div>
	{/if}

	<ScrollArea
		orientation="both"
		class="h-full w-full px-4">
		<div
			bind:this={topRef}
			class="h-px"></div>
		{@render children()}
		<div
			bind:this={bottomRef}
			class="h-px"></div>
	</ScrollArea>

	{#if showBottomArrow && showArrows}
		<div
			class="absolute bottom-1.5 left-1/2 z-10 -translate-x-1/2 transform rounded-full bg-background/80 p-1 shadow-md">
			<ChevronDown className="h-4 w-4 text-foreground" />
		</div>
	{/if}
</div>
