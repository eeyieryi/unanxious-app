<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import { AppDataService } from '$lib/app-data-service.svelte';

	const appDataService = new AppDataService();

	const tasksArray = appDataService.doc.getArray<string>('tasks');
	let tasks = $state<string[]>([]);
	tasksArray.observe((event) => {
		tasks = tasksArray.toArray();
	});

	async function handleOnSubmit(e: SubmitEvent) {
		e.preventDefault();
		tasksArray.insert(0, [formTaskName]);
		formTaskName = '';
	}

	let formTaskName = $state('');
</script>

<div class="min-h-screen w-full">
	<div>
		Sync Provider:
		{#if appDataService.syncService?.syncProvider}
			<Button
				onclick={() => {
					appDataService.syncService?.disableSync();
				}}>DISABLE SYNC</Button>
		{:else}
			<Button
				onclick={() => {
					appDataService.syncService?.enableSync();
				}}>ENABLE SYNC</Button>
		{/if}
	</div>

	<form
		class="flex max-w-md items-center justify-start space-x-2 p-8"
		onsubmit={handleOnSubmit}>
		<Label for="form-task-name">Task</Label>
		<Input
			id="form-task-name"
			type="text"
			bind:value={formTaskName} />
		<Button type="submit">create task</Button>
	</form>
	<ul>
		{#each tasks as task}
			<li>
				{task}
			</li>
		{/each}
	</ul>
</div>
