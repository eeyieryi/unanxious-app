<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';

	import type { Task } from '$lib/app-state';
	import { getAppDataService } from '$lib/app-state/data-service.svelte';

	const { tasksService } = getAppDataService();

	type Props = {
		task: Task;
	};
	let { task }: Props = $props();
</script>

<Checkbox
	onCheckedChange={() => tasksService.updateTask({ task: { ...task, completed: !task.completed } })}
	checked={task.completed} />
