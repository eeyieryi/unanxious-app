<script lang="ts">
	import '../app.css';

	import { page } from '$app/stores';

	import { CheckCheck, Timer, Sun, Moon } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	import { toggleTheme } from '$lib/toggle-theme';

	let { children } = $props();
</script>

<div class="flex w-full flex-row">
	<nav class="flex w-full min-w-[40px] max-w-[40px] flex-col items-center border-r">
		<Button
			onclick={() => toggleTheme()}
			class="hover:rounded-none hover:outline-none"
			variant="ghost"
			size="icon">
			<Sun class="h-6 w-6 rotate-0 scale-100 dark:scale-0" />
			<Moon class="absolute h-6 w-6 scale-0 dark:scale-100" />
		</Button>

		<Separator />

		{#if $page.url.pathname.startsWith('/lists')}
			<Button
				disabled
				variant="ghost"
				size="icon">
				<CheckCheck class="h-6 w-6" />
			</Button>
		{:else}
			<Button
				href="/lists"
				class="hover:rounded-none hover:outline-none"
				variant="ghost"
				size="icon">
				<CheckCheck class="h-6 w-6" />
			</Button>
		{/if}

		<Separator />

		{#if $page.url.pathname.startsWith('/focus')}
			<Button
				disabled
				variant="ghost"
				size="icon">
				<Timer class="h-6 w-6" />
			</Button>
		{:else}
			<Button
				href="/focus"
				class="hover:rounded-none hover:outline-none"
				variant="ghost"
				size="icon">
				<Timer class="h-6 w-6" />
			</Button>
		{/if}

		<Separator />
	</nav>
	{@render children()}
</div>
