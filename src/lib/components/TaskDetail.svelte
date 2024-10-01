<script lang="ts">
	import TaskView from '$lib/components/TaskView.svelte';

	import { getAppState } from '$lib/app-state.svelte';

	const appState = getAppState();
</script>

<div class="flex flex-col p-4">
	{#if appState.selectedTask}
		<TaskView task={appState.selectedTask} />
	{/if}
</div>
