<script lang="ts">
	import '../app.css';

	import { page } from '$app/stores';

	import { CheckCheck, Timer } from 'lucide-svelte';

	let { children } = $props();
</script>

<div class="flex w-full flex-row">
	<nav class="flex w-full min-w-[40px] max-w-[40px] flex-col items-center space-y-2 border-r pt-2">
		{#if $page.url.pathname.startsWith('/lists')}
			<CheckCheck class="h-6 w-6 text-muted-foreground" />
		{:else}
			<a
				href={$page.url.pathname.startsWith('/lists') ? '' : '/lists'}
				aria-current={$page.url.pathname.startsWith('/lists')}>
				<CheckCheck class="h-6 w-6" />
			</a>
		{/if}

		{#if $page.url.pathname.startsWith('/timer')}
			<Timer class="h-6 w-6 text-muted-foreground" />
		{:else}
			<a
				href="/timer"
				aria-current={$page.url.pathname.startsWith('/timer')}>
				<Timer class="h-6 w-6" />
			</a>
		{/if}
	</nav>
	{@render children()}
</div>
