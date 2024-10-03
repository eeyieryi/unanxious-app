<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';

	import { getAppDataService, type Task } from '$lib/data-service.svelte';

	const dataService = getAppDataService();

	async function toggleTaskCompleted() {
		const tu = dataService.updateTask({ ...t, completed: !t.completed });
		dataService.state.updateTask(tu);
	}

	type Props = {
		t: Task;
	};
	let { t }: Props = $props();
</script>

<Checkbox
	onCheckedChange={() => toggleTaskCompleted()}
	checked={t.completed} />
