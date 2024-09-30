<script lang="ts">
	import { page } from '$app/stores';

	import TaskView from '$lib/components/TaskView.svelte';

	import { getTasksState } from '$lib/tasks-state.svelte';

	const tasksState = getTasksState();

	$effect(() => {
		tasksState.selectedTaskID = $page.params.id;
	});
</script>

<div class="flex flex-col p-4">
	{#if tasksState.selectedTask}
		<TaskView task={tasksState.selectedTask} />
	{/if}
</div>
