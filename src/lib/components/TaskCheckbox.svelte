<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';

	import { getAppDataService, type Task } from '$lib/data-service.svelte';

	const { tasksService } = getAppDataService();

	type Props = {
		task: Task;
	};
	let { task }: Props = $props();
</script>

<Checkbox
	onCheckedChange={() => tasksService.updateTask({ task: { ...task, completed: !task.completed } })}
	checked={task.completed} />
