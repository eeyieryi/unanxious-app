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

	import type { Task } from '$lib/app-state';
	import { getAppDataService } from '$lib/app-state/data-service.svelte';

	const { tasksService, uiPrefsService } = getAppDataService();

	let createTaskForm = $state<HTMLFormElement>();
	let createTaskFormNameInput = $state<HTMLInputElement>();
	let createTaskFormInputName = $state('');

	function handleSubmitCreateTask(e: SubmitEvent) {
		e.preventDefault();
		const listID = tasksService.state.selectedListID;
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

	let sections = $derived.by(() => {
		const notCompleted = tasksService.state.selectedListTasks.filter((task) => !task.completed);
		const sections: { id: string; title: string | null; tasks: Task[] }[] = [];
		if (notCompleted.length > 0) {
			sections.push({
				id: 'unsectioned',
				title: null,
				tasks: notCompleted
			});
		}
		if (uiPrefsService.state.showCompletedTasks) {
			sections.push({
				id: 'completed',
				title: 'completed tasks',
				tasks: tasksService.state.selectedListTasks.filter((task) => task.completed)
			});
		}
		return sections;
	});
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

		{#if !['all', 'inbox', 'due', 'today', 'tomorrow', 'next-seven-days', 'this-month'].includes(tasksService.state.selectedListID)}
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

	{#if !['all', 'due', 'today', 'tomorrow', 'next-seven-days', 'this-month'].includes(tasksService.state.selectedListID)}
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

	<CustomScrollArea showArrows={tasksService.state.selectedTask === null}>
		{#if sections.length > 0}
			<div>
				{#each sections as section (section.id)}
					{#if section.tasks.length > 0}
						<div class="mb-4 space-y-2 rounded-md bg-muted p-2">
							{#if section.title !== null}
								<div>
									<span class="ml-2 text-sm font-medium uppercase text-foreground"
										>{section.title}</span>
								</div>
							{/if}
							<ul
								class={clsx('flex flex-col items-center justify-center space-y-3', {
									'opacity-50': section.id === 'completed'
								})}>
								{#each section.tasks as task (task.id)}
									{#key task.id}
										<li class="flex w-full items-center space-x-2">
											<TaskCheckbox
												class="ml-1"
												task={task} />
											<button
												class={clsx('grow text-wrap text-start', {
													'text-gray-500 line-through': task.completed
												})}
												onclick={() => {
													tasksService.state.selectedTaskID = task.id;
												}}>
												<span>{task.name.length > 0 ? task.name : 'No title'}</span>
											</button>
										</li>
									{/key}
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
			</div>
		{:else}
			<div class="flex items-center justify-center">
				<span class="font-bold uppercase">empty&nbsp;list</span>
			</div>
		{/if}
	</CustomScrollArea>
</div>

{#if tasksService.state.selectedTask}
	<div class="absolute left-0 top-0 flex h-full w-full flex-col bg-background">
		<TaskView />
	</div>
{/if}
