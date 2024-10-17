<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import { Button } from '$lib/components/ui/button';

	interface Props extends HTMLButtonAttributes {
		children: Snippet<[]>;
	}
	let { children }: Props = $props();
</script>

<Button
	disabled
	variant="ghost"
	size="icon">
	{@render children()}
</Button>
