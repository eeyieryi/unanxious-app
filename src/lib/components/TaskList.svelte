<script lang="ts">
	import clsx from 'clsx';
	import { Plus } from 'lucide-svelte';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	import TaskView from '$lib/components/TaskView.svelte';
	import TaskCheckbox from '$lib/components/TaskCheckbox.svelte';

	import { getAppDataService } from '$lib/data-service.svelte';

	const dataService = getAppDataService();

	let createTaskForm = $state<HTMLFormElement>();
	let createTaskFormInputName = $state('');

	function handleSubmitCreateTask(e: SubmitEvent) {
		e.preventDefault();
		const list_id =
			dataService.state.selectedListID === 'all' ? 'inbox' : dataService.state.selectedListID;
		const tu = dataService.createTask(createTaskFormInputName, list_id);
		if (tu) {
			if (dataService.state.selectedListID !== tu.list_id) {
				dataService.state.selectedListID = tu.list_id;
			}
			dataService.state.selectedTaskID = tu.id;
			createTaskForm?.reset();
		}
	}
</script>

<div class="min-w-[500px] max-w-[500px] space-y-4 border-r px-4 pt-4">
	<header>
		<h4 class="capitalize"
			>list:&nbsp;<span class="font-medium">
				{#if dataService.state.selectedList}
					{dataService.state.selectedList.name.length > 0
						? dataService.state.selectedList.name
						: 'No Title'}
				{:else}
					{dataService.state.selectedListID}
				{/if}
			</span></h4>
	</header>
	<form
		bind:this={createTaskForm}
		class="flex flex-col"
		onsubmit={handleSubmitCreateTask}>
		<div class="flex flex-row items-center space-x-2">
			<Label for="create-task-title-input">
				<span class="uppercase">task</span>
			</Label>
			<Input
				id="create-task-title-input"
				type="text"
				name="title"
				bind:value={createTaskFormInputName}
				placeholder="organize room" />
			<Button
				variant="outline"
				size="icon"
				type="submit">
				<Plus />
			</Button>
		</div>
	</form>
	{#if dataService.state.selectedListTasks.length > 0}
		<ul class="flex flex-col items-center justify-center space-y-2">
			{#each dataService.state.selectedListTasks as task (task.id)}
				<li class="flex w-full items-center space-x-2">
					<TaskCheckbox task={task} />
					<Button
						class={clsx('w-full', {
							'text-gray-500 line-through': task.completed
						})}
						variant="outline"
						size="icon"
						onclick={() => {
							dataService.state.selectedTaskID = task.id;
						}}>
						<span>{task.name.length > 0 ? task.name : 'No title'}</span>
					</Button>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="flex items-center justify-center">
			<span class="font-bold uppercase">EMPTY LIST</span>
		</div>
	{/if}
</div>

{#if dataService.state.selectedTask}
	<div class="flex flex-col p-4">
		<TaskView />
	</div>
{/if}
