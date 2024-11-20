<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	import { Button, buttonVariants } from '$lib/components/ui/button';

	import { cn } from '$lib/components/utils';

	interface Props extends HTMLAnchorAttributes {
		disabled: boolean;
		children: Snippet<[]>;
	}
	let { disabled, children, ...rest }: Props = $props();
</script>

{#if disabled}
	<Button
		disabled
		variant="ghost"
		size="icon">
		{@render children()}
	</Button>
{:else}
	<a
		class={cn(
			buttonVariants({ variant: 'ghost', size: 'icon' }),
			'hover:rounded-none hover:outline-none'
		)}
		{...rest}>
		{@render children()}
	</a>
{/if}
