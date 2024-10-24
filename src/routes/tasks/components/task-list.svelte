<script lang="ts">
	import type { Snippet } from 'svelte';

	import clsx from 'clsx';
	import { Plus, Trash2 } from 'lucide-svelte';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ConfirmDialog } from '$lib/components/ui/confirm-dialog';
	import { CustomScrollArea } from '$lib/components/ui/custom-scroll-area';

	import { TaskCheckbox, TaskView, TaskUiPrefsDialog } from '.';

	import { getAppDataService } from '$lib/app-state/data-service.svelte';

	const { tasksService, uiPrefsService } = getAppDataService();

	let createTaskForm = $state<HTMLFormElement>();
	let createTaskFormNameInput = $state<HTMLInputElement>();
	let createTaskFormInputName = $state('');

	function handleSubmitCreateTask(e: SubmitEvent) {
		e.preventDefault();
		const listID = ['all', 'due', 'today'].includes(tasksService.state.selectedListID)
			? 'inbox'
			: tasksService.state.selectedListID;
		const tu = tasksService.createTask({ name: createTaskFormInputName, listID: listID });
		if (tu) {
			if (tasksService.state.selectedListID !== tu.list_id) {
				tasksService.state.selectedListID = tu.list_id;
			}
			createTaskForm?.reset();
			createTaskFormNameInput?.focus();
		}
	}

	interface Props {
		toggleListShowBtn: Snippet<[]>;
	}
	let { toggleListShowBtn }: Props = $props();

	let tasksToShow = $derived(
		tasksService.state.selectedListTasks.filter((task) => {
			if (uiPrefsService.state.showCompletedTasks) {
				return true;
			}
			return !task.completed;
		})
	);
</script>

<div class="flex h-full w-full max-w-full flex-col space-y-4 bg-background">
	<div class="flex justify-between">
		{@render toggleListShowBtn()}
		<TaskUiPrefsDialog />
	</div>

	<Separator />

	<header class="flex h-8 items-center justify-between px-4">
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

		{#if !['all', 'inbox', 'due', 'today'].includes(tasksService.state.selectedListID)}
			<ConfirmDialog
				onconfirm={() => {
					if (!tasksService.state.selectedList) return;
					tasksService.deleteList({ listID: tasksService.state.selectedListID });
					tasksService.state.selectedListID = 'inbox';
				}}
				title="Delete List"
				message="Are you sure you want to delete this list? It will also delete all tasks under the list.">
				{#snippet trigger()}
					<Button
						class="h-8 w-8"
						size="icon"
						variant="destructive">
						<Trash2 class="h-4 w-4" />
					</Button>
				{/snippet}
			</ConfirmDialog>
		{/if}
	</header>

	{#if !['due', 'today'].includes(tasksService.state.selectedListID)}
		<form
			bind:this={createTaskForm}
			class="flex flex-col px-4"
			onsubmit={handleSubmitCreateTask}>
			<div class="flex flex-row items-center space-x-2">
				<Label for="create-task-title-input">
					<span class="uppercase">task</span>
				</Label>
				<Input
					bind:ref={createTaskFormNameInput}
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
	{/if}

	{#if tasksToShow.length > 0}
		<CustomScrollArea showArrows={tasksService.state.selectedTask === null}>
			<ul class="flex flex-col items-center justify-center space-y-2">
				{#each tasksToShow as task (task.id)}
					<li class="flex w-full items-center space-x-2">
						<TaskCheckbox task={task} />
						<Button
							class={clsx('w-full text-wrap', {
								'text-gray-500 line-through': task.completed
							})}
							variant="outline"
							onclick={() => {
								tasksService.state.selectedTaskID = task.id;
							}}>
							<span>{task.name.length > 0 ? task.name : 'No title'}</span>
						</Button>
					</li>
				{/each}
			</ul>
		</CustomScrollArea>
	{:else}
		<div class="flex items-center justify-center">
			<span class="font-bold uppercase">EMPTY LIST</span>
		</div>
	{/if}
</div>

{#if tasksService.state.selectedTask}
	<div class="absolute left-0 top-0 flex h-full w-full flex-col bg-background">
		<TaskView />
	</div>
{/if}
