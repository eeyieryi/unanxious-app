<script lang="ts">
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	import { Footer, NavBar } from './components';

	import { setAppDataService } from '$lib/app-state';

	setAppDataService();

	let { children } = $props();
</script>

<svelte:head>
	<title>Unanxious</title>
</svelte:head>

<ModeWatcher disableTransitions={true} />

<div class="flex h-screen w-screen max-w-[500px] flex-row border">
	<NavBar />

	<div class="flex h-full w-full flex-col">
		<main class="flex w-full grow flex-col overflow-hidden p-4">
			{@render children()}
		</main>

		<Footer />
	</div>
</div>
