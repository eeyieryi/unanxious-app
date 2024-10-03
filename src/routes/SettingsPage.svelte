<script>
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	import { getAppDataService } from '$lib/data-service.svelte';

	const dataService = getAppDataService();

	let actionsEnabled = $state(false);
</script>

<svelte:head>
	<title>Unanxious :: Settings</title>
</svelte:head>

<div class="flex w-full min-w-[460px] max-w-[460px] flex-col space-y-4 border-r px-2 py-2">
	<header class="my-12 text-center">
		<h1 class="font-medium capitalize">settings</h1>
	</header>
	<Button
		class="w-full capitalize"
		variant="outline"
		onclick={() => {
			actionsEnabled = !actionsEnabled;
		}}>{actionsEnabled ? 'disable' : 'enable'}&nbsp;actions</Button>
	<Separator />
	<Button
		class="w-full capitalize"
		disabled={!actionsEnabled}
		onclick={() => {
			if (confirm('Are you sure you want to delete all data?')) {
				if (dataService.clearData) {
					dataService.clearData();
				}
			}
		}}
		variant="destructive">clear&nbsp;data</Button>
</div>
