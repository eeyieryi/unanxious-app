<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto, onNavigate } from '$app/navigation';

	import { CheckCheck, Timer, Sun, Moon, Settings, Tally5 } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	import { ThemeToggler } from '$lib/toggle-theme';

	import NavItem from './nav-item.svelte';

	const themeToggler = new ThemeToggler();

	let currentPage = $derived($page.url.pathname);

	const initialPage = 'initialPage';

	onMount(() => {
		if (currentPage === '/') {
			const lastOpenenedPage = localStorage.getItem(initialPage);
			if (lastOpenenedPage) {
				goto(lastOpenenedPage, { replaceState: true });
			}
		}
	});

	onNavigate((navigation) => {
		if (navigation.to && navigation.to.url.pathname !== '/') {
			localStorage.setItem(initialPage, navigation.to.url.pathname);
		}
	});
</script>

<nav class="flex w-full min-w-[40px] max-w-[40px] flex-col items-center border-r">
	<Button
		onclick={() => themeToggler.toggleTheme()}
		class="hover:rounded-none hover:outline-none"
		variant="ghost"
		size="icon">
		<Sun class="h-6 w-6 rotate-0 scale-100 dark:scale-0" />
		<Moon class="absolute h-6 w-6 scale-0 dark:scale-100" />
	</Button>

	<Separator />

	<NavItem
		href="/tasks"
		disabled={currentPage.includes('tasks')}>
		<CheckCheck class="h-6 w-6" />
	</NavItem>

	<Separator />

	<NavItem
		href="/focus"
		disabled={currentPage.includes('focus')}>
		<Timer class="h-6 w-6" />
	</NavItem>

	<Separator />

	<NavItem
		href="/counter"
		disabled={currentPage.includes('counter')}>
		<Tally5 class="h-6 w-6" />
	</NavItem>

	<Separator />

	<Separator class="mt-auto" />

	<NavItem
		href="/settings"
		disabled={currentPage.includes('settings')}>
		<Settings class="h-6 w-6" />
	</NavItem>
</nav>
