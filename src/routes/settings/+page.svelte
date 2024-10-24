<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ConfirmDialog } from '$lib/components/ui/confirm-dialog';

	import { getAppDataService } from '$lib/app-state/data-service.svelte';

	const dataService = getAppDataService();

	let actionsEnabled = $state(false);

	let importDataInputFile = $state<HTMLInputElement>();
	let files = $state<FileList>();
</script>

<svelte:head>
	<title>Unanxious :: Settings</title>
</svelte:head>

<div class="flex flex-col space-y-4">
	<header class="my-12 text-center">
		<h1 class="font-medium capitalize">settings</h1>
	</header>

	<Button
		class="capitalize"
		variant="outline"
		onclick={() => {
			actionsEnabled = !actionsEnabled;
		}}>{actionsEnabled ? 'disable' : 'enable'}&nbsp;actions</Button>

	<Separator />

	<ConfirmDialog
		onconfirm={() => {
			dataService.backupService.export();
		}}
		title="Backup Data"
		message="Are you sure you want to backup all your data?">
		{#snippet trigger()}
			<Button
				class="w-full capitalize"
				disabled={!actionsEnabled}
				variant="secondary">export&nbsp;data</Button>
		{/snippet}
	</ConfirmDialog>

	<div class="flex flex-col space-y-2 rounded-md border p-4">
		<input
			disabled={!actionsEnabled}
			class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			bind:this={importDataInputFile}
			bind:files={files}
			type="file"
			accept="application/json" />
		<Button
			variant="secondary"
			disabled={!actionsEnabled}
			onclick={() => importDataInputFile?.click()}>Select backup file to import</Button>

		<ConfirmDialog
			onconfirm={async () => {
				if (!files) return;
				const f = files.item(0);
				if (!f) return;
				await dataService.backupService.import(f);
				// show toast
				// navigate
			}}
			title="Restore Data"
			message="Are you sure you want to restore your data? It deletes all current data.">
			{#snippet trigger()}
				<Button
					class="w-full capitalize"
					disabled={!actionsEnabled || !files || files.length !== 1}
					variant="destructive">import&nbsp;data</Button>
			{/snippet}
		</ConfirmDialog>
	</div>

	<Separator />

	<ConfirmDialog
		onconfirm={() => {
			if (dataService.clearData) {
				dataService.clearData();
			}
		}}
		title="Erase Data"
		message="Are you sure you want to erase all your data?">
		{#snippet trigger()}
			<Button
				class="w-full capitalize"
				disabled={!actionsEnabled}
				variant="destructive">clear&nbsp;data</Button>
		{/snippet}
	</ConfirmDialog>
</div>
