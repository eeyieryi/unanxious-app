<script lang="ts">
	import { Save } from 'lucide-svelte';
	import {
		type DateValue,
		today,
		toZoned,
		fromAbsolute,
		getLocalTimeZone
	} from '@internationalized/date';

	import { cn } from '$lib/utils';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Calendar } from '$lib/components/ui/calendar';
	import { buttonVariants } from '$lib/components/ui/button';

	import { formatDueAt, millisecondsToSeconds, secondsToMilliseconds } from '$lib/datetime';
	import { getAppDataService, type Task } from '$lib/data-service.svelte';

	const dataService = getAppDataService();

	function updateTaskDueAt(dueAt: DateValue | null) {
		dataService.updateTask({
			...task,
			due_at: dueAt === null ? null : millisecondsToSeconds(dueAt.toDate('UTC').valueOf())
		});
	}

	function save() {
		if (!dateValue) return;
		updateTaskDueAt(dateValue);
	}

	type Props = {
		task: Task;
	};
	let { task }: Props = $props();

	function getInitialDateValue() {
		return task.due_at
			? fromAbsolute(secondsToMilliseconds(task.due_at), getLocalTimeZone())
			: toZoned(today(getLocalTimeZone()), getLocalTimeZone());
	}

	let taskDueAt: number | undefined = $derived(task.due_at ?? undefined);
	let dateValue: DateValue | undefined = $state(getInitialDateValue());

	$effect(() => {
		dateValue = getInitialDateValue();
	});
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
