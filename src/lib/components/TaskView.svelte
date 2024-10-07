<script lang="ts">
	import { ArrowLeft, Trash2 } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';

	import TaskCheckbox from '$lib/components/TaskCheckbox.svelte';
	import TaskMoveToList from '$lib/components/TaskMoveToList.svelte';
	import TaskDateTimePicker from '$lib/components/TaskDateTimePicker.svelte';

	import { getAppDataService } from '$lib/data-service.svelte';

	const { tasksService } = getAppDataService();

	let task = $derived({ ...tasksService.state.selectedTask! });

	let taskName = {
		get value() {
			return task?.name;
		},
		set value(v) {
			task.name = v;
		}
	};
	let taskDescription = {
		get value() {
			return task?.description;
		},
		set value(v) {
			task.description = v;
		}
	};
	let availableLists = $derived(Array.from(tasksService.state.lists.values()));
</script>

<div class="flex items-center space-x-2">
	<Button
		variant="link"
		size="icon"
		onclick={() => {
			tasksService.state.selectedTaskID = null;
		}}>
		<ArrowLeft />
	</Button>
	<TaskMoveToList
		availableLists={availableLists}
		task={task} />
</div>

<div class="flex items-center space-x-2">
	<TaskCheckbox task={task} />
	<TaskDateTimePicker task={task} />
</div>

<div class="mt-4 flex flex-col space-y-4">
	<Input
		onchange={() => {
			tasksService.updateTask({
				task: {
					...task,
					name: taskName.value
				}
			});
		}}
		onkeyup={() => {
			tasksService.state.tasks.set(task.id, { ...task, name: taskName.value });
		}}
		type="text"
		placeholder="No title"
		bind:value={taskName.value} />
	<Textarea
		onchange={() => {
			tasksService.updateTask({
				task: {
					...task,
					description: taskDescription.value
				}
			});
		}}
		bind:value={taskDescription.value}></Textarea>

	<Button
		size="icon"
		variant="destructive"
		onclick={() => {
			if (confirm('are you sure you want to delete this task?')) {
				if (!tasksService.state.selectedTask) return;
				tasksService.deleteTask({ taskID: task.id });
				tasksService.state.selectedTaskID = null;
			}
		}}>
		<Trash2 />
	</Button>
</div>
