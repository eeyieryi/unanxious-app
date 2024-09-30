<script lang="ts">
	import { Save } from 'lucide-svelte';
	import { type DateValue, fromAbsolute } from '@internationalized/date';

	import { cn } from '$lib/utils';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Calendar } from '$lib/components/ui/calendar';
	import { buttonVariants } from '$lib/components/ui/button';

	import {
		type Task,
		type UpdateTaskDueAtDTO,
		fetchAPI,
		isAPIResponseError,
		logAPIResponseErrorToConsole
	} from '$lib/api';
	import { formatDueAt } from '$lib/datetime';
	import { getAppState } from '$lib/app-state.svelte';

	const tasksState = getAppState();

	async function updateTaskDueAt(dueAt: DateValue | null) {
		let updateTaskDueAtDTO: UpdateTaskDueAtDTO = {
			due_at: undefined
		};
		if (dueAt) {
			updateTaskDueAtDTO.due_at = dueAt.toDate('UTC').valueOf();
		}
		const apiResponse = await fetchAPI<Task>(fetch, `/tasks/${task.id}/update-due-at`, {
			method: 'PATCH',
			body: JSON.stringify(updateTaskDueAtDTO)
		});
		if (isAPIResponseError(apiResponse)) {
			logAPIResponseErrorToConsole(apiResponse);
			// handle error
			return;
		}
		tasksState.update(apiResponse.data);
	}

	function save() {
		if (!dateValue) return;
		updateTaskDueAt(dateValue);
	}

	type Props = { task: Task };
	let { task }: Props = $props();

	let taskDueAt: number | undefined = $derived(task.due_at ?? undefined);
	let dateValue: DateValue | undefined = $state(
		task.due_at ? fromAbsolute(task.due_at * 1000, 'UTC') : undefined
	);
</script>

<Dialog.Root>
	<Dialog.Trigger>{taskDueAt ? formatDueAt(taskDueAt) : 'Date'}</Dialog.Trigger>
	<Dialog.Content class="w-full max-w-sm justify-center">
		<Dialog.Title>Set due date</Dialog.Title>
		<Calendar
			initialFocus
			bind:value={dateValue} />
		<Dialog.Footer class="flex flex-col space-x-2">
			<Dialog.Close
				class={cn(buttonVariants({ variant: 'default' }), 'flex items-center space-x-2')}
				onclick={() => save()}>
				<Save class="h-5 w-5" /><span>Save</span>
			</Dialog.Close>
			<Dialog.Close
				class={buttonVariants({ variant: 'destructive' })}
				onclick={() => updateTaskDueAt(null)}>Clear</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
