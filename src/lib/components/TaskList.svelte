<script lang="ts">
	import clsx from 'clsx';
	import { Plus } from 'lucide-svelte';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	import TaskDetail from '$lib/components/TaskDetail.svelte';
	import TaskCheckbox from '$lib/components/TaskCheckbox.svelte';

	import { getAppDataService } from '$lib/data-service.svelte';

	const dataService = getAppDataService();

	type Props = {
		listID: string;
	};
	let { listID }: Props = $props();

	let list = $derived(dataService.state.lists.find((l) => l.id === listID));

	$effect(() => {
		dataService.state.tasks = dataService.fetchListTasks(listID);
	});

	let filteredTasks = $derived(
		dataService.state.tasks.filter((task) => {
			if (listID === 'all') {
				return true;
			}
			return task.list_id === listID;
		})
	);

	let createTaskForm = $state<HTMLFormElement>();
	let formTitleInput = $state('');
</script>

<div class="min-w-[500px] max-w-[500px] space-y-4 border-r px-4 pt-4">
	<header>
		<h4 class="capitalize"
			>list:&nbsp;<span class="font-medium">
				{#if list}
					{list.name.length > 0 ? list.name : 'No Title'}
				{:else}
					{listID}
				{/if}
			</span></h4>
	</header>
	<form
		bind:this={createTaskForm}
		class="flex flex-col"
		onsubmit={async (e) => {
			e.preventDefault();
			const list_id = listID === 'all' ? 'inbox' : listID;
			const tu = dataService.createTask(formTitleInput, list_id);
			if (tu) {
				if (listID !== tu.list_id) {
					listID = tu.list_id;
				}
				dataService.state.selectedTaskID = tu.id;
				createTaskForm?.reset();
			}
		}}>
		<div class="flex flex-row items-center space-x-2">
			<Label for="create-task-title-input">
				<span class="uppercase">task</span>
			</Label>
			<Input
				id="create-task-title-input"
				type="text"
				name="title"
				bind:value={formTitleInput}
				placeholder="organize room" />
			<Button
				variant="outline"
				size="icon"
				type="submit">
				<Plus />
			</Button>
		</div>
	</form>
	{#if filteredTasks.length > 0}
		<ul class="flex flex-col items-center justify-center space-y-2">
			{#each filteredTasks as t (t.id)}
				<li class="flex w-full items-center space-x-2">
					<TaskCheckbox t={t} />
					<Button
						class={clsx('w-full', {
							'text-gray-500 line-through': t.completed
						})}
						variant="outline"
						size="icon"
						onclick={() => {
							dataService.state.selectedTaskID = t.id;
						}}>
						<span>{t.name.length > 0 ? t.name : 'No title'}</span>
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
	<TaskDetail />
{/if}
