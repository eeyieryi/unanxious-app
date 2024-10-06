<script lang="ts">
	import '../app.css';

	import { onMount } from 'svelte';

	import { CheckCheck, Timer, Sun, Moon, Settings, Tally5 } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	import TasksApp from './TasksApp.svelte';
	import FocusApp from './FocusApp.svelte';
	import CounterApp from './CounterApp.svelte';
	import SettingsPage from './SettingsPage.svelte';

	import { ThemeToggler } from '$lib/toggle-theme/theme-toggler.svelte';
	import { setAppDataService } from '$lib/data-service.svelte';

	const themeToggler = new ThemeToggler();

	let selectedPage = $state<AvailablePages>('focus');

	const availablePages = ['tasks', 'focus', 'settings', 'counter'] as const;
	type AvailablePages = (typeof availablePages)[number];
	function isAvailablePage(name: string): name is AvailablePages {
		for (const page of availablePages) {
			if (name === page) {
				return true;
			}
		}
		return false;
	}
	const INITIAL_PAGE_KEY = 'initialPage';
	function selectPage(page: AvailablePages) {
		selectedPage = page;
		localStorage.setItem(INITIAL_PAGE_KEY, page);
	}
	onMount(() => {
		const initialPage = localStorage.getItem(INITIAL_PAGE_KEY);
		if (initialPage && isAvailablePage(initialPage)) {
			selectPage(initialPage);
		}
	});

	setAppDataService();
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

		{#if selectedPage === 'tasks'}
			<Button
				disabled
				variant="ghost"
				size="icon">
				<CheckCheck class="h-6 w-6" />
			</Button>
		{:else}
			<Button
				onclick={() => selectPage('tasks')}
				class="hover:rounded-none hover:outline-none"
				variant="ghost"
				size="icon">
				<CheckCheck class="h-6 w-6" />
			</Button>
		{/if}

		<Separator />

		{#if selectedPage === 'focus'}
			<Button
				disabled
				variant="ghost"
				size="icon">
				<Timer class="h-6 w-6" />
			</Button>
		{:else}
			<Button
				onclick={() => selectPage('focus')}
				class="hover:rounded-none hover:outline-none"
				variant="ghost"
				size="icon">
				<Timer class="h-6 w-6" />
			</Button>
		{/if}

		<Separator />

		{#if selectedPage === 'counter'}
			<Button
				disabled
				variant="ghost"
				size="icon">
				<Tally5 class="h-6 w-6" />
			</Button>
		{:else}
			<Button
				onclick={() => selectPage('counter')}
				class="hover:rounded-none hover:outline-none"
				variant="ghost"
				size="icon">
				<Tally5 class="h-6 w-6" />
			</Button>
		{/if}

		<Separator />

		<Separator class="mt-auto" />
		{#if selectedPage === 'settings'}
			<Button
				disabled
				variant="ghost"
				size="icon">
				<Settings class="h-6 w-6" />
			</Button>
		{:else}
			<Button
				onclick={() => selectPage('settings')}
				class="hover:rounded-none hover:outline-none"
				variant="ghost"
				size="icon">
				<Settings class="h-6 w-6" />
			</Button>
		{/if}
	</nav>

	<div class="flex h-full w-full flex-col border-r">
		<div class="flex flex-col overflow-hidden p-4">
			{#if selectedPage === 'tasks'}
				<TasksApp />
			{:else if selectedPage === 'focus'}
				<FocusApp />
			{:else if selectedPage === 'settings'}
				<SettingsPage />
			{:else if selectedPage === 'counter'}
				<CounterApp />
			{:else}
				<h1>No App Selected</h1>
			{/if}
		</div>
		<div class="mt-auto">
			<Separator />
			<div class="h-10 w-full"></div>
		</div>
	</div>
</div>
