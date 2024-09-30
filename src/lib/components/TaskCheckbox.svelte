<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';

	import { getAppState } from '$lib/app-state.svelte';
	import { fetchAPI, isAPIResponseError, logAPIResponseErrorToConsole, type Task } from '$lib/api';

	const appState = getAppState();

	async function toggleTaskCompleted() {
		const apiResponse = await fetchAPI<Task>(fetch, `/tasks/${t.id}/toggle-completed`, {
			method: 'PATCH'
		});
		if (isAPIResponseError(apiResponse)) {
			logAPIResponseErrorToConsole(apiResponse);
			// handle error
			return;
		}
		appState.updateTask(apiResponse.data);
	}

	type Props = {
		t: Task;
	};
	let { t }: Props = $props();
</script>

<Checkbox
	onCheckedChange={() => toggleTaskCompleted()}
	checked={t.completed} />
