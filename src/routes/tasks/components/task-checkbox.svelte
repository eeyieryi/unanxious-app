<script lang="ts">
	import type { ComponentProps } from 'svelte';

	import { Checkbox } from '$lib/components/ui/checkbox';

	import type { Task } from '$lib/app-state';
	import { getAppDataService } from '$lib/app-state/data-service.svelte';

	const { tasksService } = getAppDataService();

	interface Props extends ComponentProps<Checkbox> {
		task: Task;
	}
	let { task, ...rest }: Props = $props();
</script>

<Checkbox
	onCheckedChange={() => tasksService.updateTask({ task: { ...task, completed: !task.completed } })}
	checked={task.completed}
	{...rest} />
