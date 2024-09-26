<script lang="ts">
	import { page } from '$app/stores';
	import TaskMoveToList from '$lib/components/TaskMoveToList.svelte';
	import TaskView from '$lib/components/TaskView.svelte';
	import { selectedTask, selectedTaskID, taskList, listsStore } from '$lib/tasks.store.js';
	import { ArrowLeft } from 'lucide-svelte';

	$effect(() => {
		selectedTaskID.set($page.params.id);
	});

	let moveToListDialog: HTMLDialogElement | undefined = $state(undefined);
</script>

<div class="flex flex-col p-4">
	{#if $selectedTask}
		<div class="flex flex-row items-center">
			<a href="/lists/{$page.params.name}/tasks" class="btn btn-ghost btn-xs">
				<ArrowLeft />
			</a>
			<TaskMoveToList bind:moveToListDialog availableLists={$listsStore} t={$selectedTask} />
			<button class="btn btn-ghost btn-sm" onclick={() => moveToListDialog!.showModal()}>
				{$taskList?.title ?? 'List'}
			</button>
		</div>
		<TaskView task={$selectedTask} />
	{/if}
</div>
