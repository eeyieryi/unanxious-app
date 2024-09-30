<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';

	import { getTasksState } from '$lib/tasks-state.svelte';
	import { fetchAPI, isAPIResponseError, logAPIResponseErrorToConsole, type Task } from '$lib/api';

	const tasksState = getTasksState();

	async function toggleTaskCompleted() {
		const apiResponse = await fetchAPI<Task>(fetch, `/tasks/${t.id}/toggle-completed`, {
			method: 'PATCH'
		});
		if (isAPIResponseError(apiResponse)) {
			logAPIResponseErrorToConsole(apiResponse);
			// handle error
			return;
		}
		tasksState.update(apiResponse.data);
	}

	type Props = {
		t: Task;
	};
	let { t }: Props = $props();
</script>

<Checkbox
	onCheckedChange={() => toggleTaskCompleted()}
	checked={t.completed} />
