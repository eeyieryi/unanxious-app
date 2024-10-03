<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';

	import { getAppDataService, type Task } from '$lib/data-service.svelte';

	const dataService = getAppDataService();

	type Props = {
		task: Task;
	};
	let { task }: Props = $props();
</script>

<Checkbox
	onCheckedChange={() => dataService.updateTask({ ...task, completed: !task.completed })}
	checked={task.completed} />
