<script lang="ts">
	import '../app.css';

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto, onNavigate } from '$app/navigation';

	import { CheckCheck, Timer, Sun, Moon, Settings, Tally5 } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	import { ThemeToggler } from '$lib/toggle-theme/theme-toggler.svelte';

	import { setAppDataService } from '$lib/app-state';
	import { DisabledNavLink, NavLink } from './components';

	const themeToggler = new ThemeToggler();

	const availablePages = ['tasks', 'focus', 'counter', 'settings'] as const;
	type AvailablePage = (typeof availablePages)[number];

	function isAvailablePage(name: string): name is AvailablePage {
		for (const pageName of availablePages) {
			if (pageName === name) {
				return true;
			}
		}
		return false;
	}

	let selectedPageTitle = $derived($page.url.pathname);
	const INITIAL_PAGE_KEY = 'initialPage';
	function selectPage(page: AvailablePage) {
		goto(`/${page}`, { replaceState: true });
	}
	onMount(() => {
		const initialPage = localStorage.getItem(INITIAL_PAGE_KEY);
		if (initialPage && isAvailablePage(initialPage)) {
			selectPage(initialPage);
		}
	});

	onNavigate((navigation) => {
		const pathname = (navigation.to?.url.pathname || '').replace('/', '');
		if (isAvailablePage(pathname)) {
			localStorage.setItem(INITIAL_PAGE_KEY, pathname);
		}
	});

	setAppDataService();

	let { children } = $props();
</script>

<svelte:head>
	<title>Unanxious APP</title>
</svelte:head>

<div class="flex h-screen w-screen max-w-[500px] flex-row">
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

		{#if selectedPageTitle === 'tasks'}
			<DisabledNavLink>
				<CheckCheck class="h-6 w-6" />
			</DisabledNavLink>
		{:else}
			<NavLink href="/tasks">
				<CheckCheck class="h-6 w-6" />
			</NavLink>
		{/if}

		<Separator />

		{#if selectedPageTitle === 'focus'}
			<DisabledNavLink>
				<Timer class="h-6 w-6" />
			</DisabledNavLink>
		{:else}
			<NavLink href="/focus">
				<Timer class="h-6 w-6" />
			</NavLink>
		{/if}

		<Separator />

		{#if selectedPageTitle === 'counter'}
			<DisabledNavLink>
				<Tally5 class="h-6 w-6" />
			</DisabledNavLink>
		{:else}
			<NavLink href="/counter">
				<Tally5 class="h-6 w-6" />
			</NavLink>
		{/if}

		<Separator />

		<Separator class="mt-auto" />
		{#if selectedPageTitle === 'settings'}
			<DisabledNavLink>
				<Settings class="h-6 w-6" />
			</DisabledNavLink>
		{:else}
			<NavLink href="/settings">
				<Settings class="h-6 w-6" />
			</NavLink>
		{/if}
	</nav>

	<div class="flex h-full w-full flex-col border-r">
		<div class="flex flex-col overflow-hidden p-4">
			{@render children()}
		</div>
		<div class="mt-auto">
			<Separator />
			<div class="h-10 w-full"></div>
		</div>
	</div>
</div>
