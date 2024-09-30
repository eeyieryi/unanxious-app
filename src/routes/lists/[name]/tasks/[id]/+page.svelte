<script lang="ts">
	import { page } from '$app/stores';

	import TaskView from '$lib/components/TaskView.svelte';

	import { getAppState } from '$lib/app-state.svelte';

	const tasksState = getAppState();

	$effect(() => {
		tasksState.selectedTaskID = $page.params.id;
	});
</script>

<div class="flex flex-col p-4">
	{#if tasksState.selectedTask}
		<TaskView task={tasksState.selectedTask} />
	{/if}
</div>
