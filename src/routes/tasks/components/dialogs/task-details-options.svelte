<script lang="ts">
	import { MoreVertical } from 'lucide-svelte';

	import { cn } from '$lib/utils';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';

	import DeleteTask from './delete-task.svelte';

	import { getAppDataService, type Task } from '$lib/app-state';

	const { tasksService } = getAppDataService();

	function deleteTask() {
		if (!tasksService.state.selectedTask) return;
		tasksService.deleteTask({ taskID: task.id });
		tasksService.state.selectedTaskID = null;
	}

	interface Props {
		task: Task;
	}
	let { task }: Props = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
		<MoreVertical class="h-4 w-4" />
	</Dialog.Trigger>

	<Dialog.Content
		class="flex max-w-[80%] flex-col items-center space-y-2 rounded-md sm:max-w-[400px]">
		<Dialog.Title>Task Options</Dialog.Title>

		<DeleteTask handleDelete={() => deleteTask()} />
	</Dialog.Content>
</Dialog.Root>
