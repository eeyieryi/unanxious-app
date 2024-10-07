<script lang="ts">
	import clsx from 'clsx';
	import { Plus, Trash2 } from 'lucide-svelte';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	import TaskView from '$lib/components/TaskView.svelte';
	import TaskCheckbox from '$lib/components/TaskCheckbox.svelte';

	import { getAppDataService } from '$lib/data-service.svelte';

	const { tasksService } = getAppDataService();

	let createTaskForm = $state<HTMLFormElement>();
	let createTaskFormInputName = $state('');

	function handleSubmitCreateTask(e: SubmitEvent) {
		e.preventDefault();
		const listID =
			tasksService.state.selectedListID === 'all' ? 'inbox' : tasksService.state.selectedListID;
		const tu = tasksService.createTask({ name: createTaskFormInputName, listID: listID });
		if (tu) {
			if (tasksService.state.selectedListID !== tu.list_id) {
				tasksService.state.selectedListID = tu.list_id;
			}
			tasksService.state.selectedTaskID = tu.id;
			createTaskForm?.reset();
		}
	}
</script>

<div class="min-w-[500px] max-w-[500px] space-y-4 border-r px-4 pt-4">
	<header class="flex h-8 items-center justify-between">
		<h4 class="capitalize"
			>list:&nbsp;<span class="font-medium">
				{#if tasksService.state.selectedList}
					{tasksService.state.selectedList.name.length > 0
						? tasksService.state.selectedList.name
						: 'No Title'}
				{:else}
					{tasksService.state.selectedListID}
				{/if}
			</span></h4>

		{#if !['all', 'inbox'].includes(tasksService.state.selectedListID)}
			<Button
				class="h-8 w-8"
				size="icon"
				variant="destructive"
				onclick={() => {
					if (confirm('are you sure you want to delete this list and all its tasks?')) {
						if (!tasksService.state.selectedList) return;
						tasksService.deleteList({ listID: tasksService.state.selectedListID });
						tasksService.state.selectedListID = 'inbox';
					}
				}}>
				<Trash2 class="h-4 w-4" />
			</Button>
		{/if}
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
	{#if tasksService.state.selectedListTasks.length > 0}
		<ul class="flex flex-col items-center justify-center space-y-2">
			{#each tasksService.state.selectedListTasks as task (task.id)}
				<li class="flex w-full items-center space-x-2">
					<TaskCheckbox task={task} />
					<Button
						class={clsx('w-full', {
							'text-gray-500 line-through': task.completed
						})}
						variant="outline"
						size="icon"
						onclick={() => {
							tasksService.state.selectedTaskID = task.id;
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

{#if tasksService.state.selectedTask}
	<div class="flex flex-col p-4">
		<TaskView />
	</div>
{/if}
