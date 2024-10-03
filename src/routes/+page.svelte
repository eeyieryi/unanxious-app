<script lang="ts">
	import '../app.css';

	import { CheckCheck, Timer, Sun, Moon, Settings } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	import TasksApp from './TasksApp.svelte';
	import FocusApp from './FocusApp.svelte';
	import SettingsPage from './SettingsPage.svelte';

	import { ThemeToggler } from '$lib/toggle-theme/theme-toggler.svelte';
	import { setAppDataService } from '$lib/data-service.svelte';

	const themeToggler = new ThemeToggler();

	let selectedApp = $state<'tasks' | 'focus' | 'settings'>('focus');

	setAppDataService();
</script>

<svelte:head>
	<title>Unanxious APP</title>
</svelte:head>

<div class="flex h-screen w-full flex-row">
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

		{#if selectedApp === 'tasks'}
			<Button
				disabled
				variant="ghost"
				size="icon">
				<CheckCheck class="h-6 w-6" />
			</Button>
		{:else}
			<Button
				onclick={() => {
					selectedApp = 'tasks';
				}}
				class="hover:rounded-none hover:outline-none"
				variant="ghost"
				size="icon">
				<CheckCheck class="h-6 w-6" />
			</Button>
		{/if}

		<Separator />

		{#if selectedApp === 'focus'}
			<Button
				disabled
				variant="ghost"
				size="icon">
				<Timer class="h-6 w-6" />
			</Button>
		{:else}
			<Button
				onclick={() => {
					selectedApp = 'focus';
				}}
				class="hover:rounded-none hover:outline-none"
				variant="ghost"
				size="icon">
				<Timer class="h-6 w-6" />
			</Button>
		{/if}

		<Separator />

		<Separator class="mt-auto" />
		{#if selectedApp === 'settings'}
			<Button
				disabled
				variant="ghost"
				size="icon">
				<Settings class="h-6 w-6" />
			</Button>
		{:else}
			<Button
				onclick={() => {
					selectedApp = 'settings';
				}}
				class="hover:rounded-none hover:outline-none"
				variant="ghost"
				size="icon">
				<Settings class="h-6 w-6" />
			</Button>
		{/if}
	</nav>

	{#if selectedApp === 'tasks'}
		<TasksApp />
	{:else if selectedApp === 'focus'}
		<FocusApp />
	{:else if selectedApp === 'settings'}
		<SettingsPage />
	{:else}
		<h1>No App Selected</h1>
	{/if}
</div>
