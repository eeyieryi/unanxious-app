<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	import { buttonVariants } from '$lib/components/ui/button';

	import { cn } from '$lib/utils';

	interface Props extends HTMLAnchorAttributes {
		children: Snippet<[]>;
	}
	let { children, ...rest }: Props = $props();
</script>

<a
	class={cn(
		buttonVariants({ variant: 'ghost', size: 'icon' }),
		'hover:rounded-none hover:outline-none'
	)}
	{...rest}>
	{@render children()}
</a>
