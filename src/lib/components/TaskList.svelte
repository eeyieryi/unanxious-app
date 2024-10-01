<script lang="ts">
	import clsx from 'clsx';
	import { Plus } from 'lucide-svelte';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	import TaskDetail from '$lib/components/TaskDetail.svelte';
	import TaskCheckbox from '$lib/components/TaskCheckbox.svelte';

	import type { List } from '$lib/api';
	import { getAppState } from '$lib/app-state.svelte';
	import { createTask, fetchListTasks } from '$lib/api-legacy.js';

	const appState = getAppState();

	type Props = {
		listID: string;
	};
	let { listID }: Props = $props();
	let list = $state<List>();

	async function fetchThings() {
		const listTasks = await fetchListTasks(fetch, listID);
		if (listTasks) {
			list = listTasks.list;
			appState.tasks = listTasks.list_tasks;
		}
	}

	$effect(() => {
		fetchThings();
	});

	let filteredTasks = $derived(
		appState.tasks.filter((task) => {
			if (listID === 'all') {
				return true;
			}
			if (listID === 'inbox') {
				return task.list_id === null;
			}
			return task.list_id === listID;
		})
	);

	let createTaskForm = $state<HTMLFormElement>();
	let formTitleInput = $state('');
</script>

<div class="min-w-[500px] max-w-[500px] space-y-4 border-r px-4 pt-4">
	{#if list}
		<header>
			<h4 class="capitalize"
				>list:&nbsp;<span class="font-medium"
					>{list.title.length > 0 ? list.title : 'No Title'}</span
				></h4>
		</header>
	{/if}
	<form
		bind:this={createTaskForm}
		class="flex flex-col"
		onsubmit={async (e) => {
			e.preventDefault();
			const tu = await createTask(fetch, formTitleInput, listID);
			if (tu) {
				appState.addTask(tu);
				let listID = 'inbox';
				if (tu.list_id) {
					if (tu.list_id) {
						listID = tu.list_id;
					}
				}
				appState.selectedTaskID = tu.id;
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
							appState.selectedTaskID = t.id;
						}}>
						<span>{t.title.length > 0 ? t.title : 'No title'}</span>
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

{#if appState.selectedTask}
	<TaskDetail />
{/if}
