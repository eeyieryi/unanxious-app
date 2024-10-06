<script lang="ts">
	import { ArrowLeft, Trash2 } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';

	import TaskCheckbox from '$lib/components/TaskCheckbox.svelte';
	import TaskMoveToList from '$lib/components/TaskMoveToList.svelte';
	import TaskDateTimePicker from '$lib/components/TaskDateTimePicker.svelte';

	import { getAppDataService } from '$lib/data-service.svelte';

	const dataService = getAppDataService();

	let task = $derived({ ...dataService.state.selectedTask! });

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
</script>

<div class="flex items-center space-x-2">
	<Button
		variant="link"
		size="icon"
		onclick={() => {
			dataService.state.selectedTaskID = null;
		}}>
		<ArrowLeft />
	</Button>
	<TaskMoveToList
		availableLists={dataService.state.lists}
		task={task} />
</div>

<div class="flex items-center space-x-2">
	<TaskCheckbox task={task} />
	<TaskDateTimePicker task={task} />
</div>

<div class="mt-4 flex flex-col space-y-4">
	<Input
		onchange={() => {
			dataService.updateTask({
				...task,
				name: taskName.value
			});
		}}
		onkeyup={() => {
			dataService.state.updateTask({ ...task, name: taskName.value }); // this only updates the store, it does not persist
		}}
		type="text"
		placeholder="No title"
		bind:value={taskName.value} />
	<Textarea
		onchange={() => {
			dataService.updateTask({
				...task,
				description: taskDescription.value
			});
		}}
		bind:value={taskDescription.value}></Textarea>

	<Button
		size="icon"
		variant="destructive"
		onclick={() => {
			if (confirm('are you sure you want to delete this task?')) {
				dataService.deleteTask(task);
				dataService.state.selectedTaskID = null;
			}
		}}>
		<Trash2 />
	</Button>
</div>
