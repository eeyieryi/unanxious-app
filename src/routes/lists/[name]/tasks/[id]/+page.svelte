<script lang="ts">
	import { page } from '$app/stores';
	import TaskView from '$lib/components/TaskView.svelte';
	import { selectedTask, selectedTaskID } from '$lib/tasks.store.js';

	$effect(() => {
		selectedTaskID.set($page.params.id);
	});
</script>

<div class="flex flex-col p-4">
	{#if $selectedTask}
		<TaskView task={$selectedTask} />
	{/if}
</div>
