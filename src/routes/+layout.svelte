<script lang="ts">
	import '../app.css';

	import { Separator } from '$lib/components/ui/separator';

	import { NavBar } from './components';

	import { setAppDataService } from '$lib/app-state';

	setAppDataService();

	let { children } = $props();
</script>

<svelte:head>
	<title>Unanxious APP</title>
</svelte:head>

<div class="flex h-screen w-screen max-w-[500px] flex-row">
	<NavBar />

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
