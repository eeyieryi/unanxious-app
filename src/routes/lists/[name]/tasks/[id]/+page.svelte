<script lang="ts">
	import { page } from '$app/stores';

	import TaskView from '$lib/components/TaskView.svelte';

	import { getAppState } from '$lib/app-state.svelte';

	const appState = getAppState();

	$effect(() => {
		appState.selectedTaskID = $page.params.id;
	});
</script>

<div class="flex flex-col p-4">
	{#if appState.selectedTask}
		<TaskView task={appState.selectedTask} />
	{/if}
</div>
