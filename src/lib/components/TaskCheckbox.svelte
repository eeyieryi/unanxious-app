<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';

	import { tasksStore } from '$lib/tasks.store';
	import { fetchAPI, isAPIResponseError, logAPIResponseErrorToConsole, type Task } from '$lib/api';

	async function toggleTaskCompleted() {
		const apiResponse = await fetchAPI<Task>(fetch, `/tasks/${t.id}/toggle-completed`, {
			method: 'PATCH'
		});
		if (isAPIResponseError(apiResponse)) {
			logAPIResponseErrorToConsole(apiResponse);
			// handle error
			return;
		}
		tasksStore.updateTask(apiResponse.data);
	}

	type Props = {
		t: Task;
	};
	let { t }: Props = $props();
</script>

<Checkbox
	onCheckedChange={() => toggleTaskCompleted()}
	checked={t.completed} />
