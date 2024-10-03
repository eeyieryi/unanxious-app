<script lang="ts">
	import TaskView from '$lib/components/TaskView.svelte';

	import { getAppDataService } from '$lib/data-service.svelte';

	const dataService = getAppDataService();
</script>

<div class="flex flex-col p-4">
	{#if dataService.state.selectedTask}
		<TaskView task={dataService.state.selectedTask} />
	{/if}
</div>
