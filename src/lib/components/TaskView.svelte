<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';

	import TaskCheckbox from '$lib/components/TaskCheckbox.svelte';
	import TaskMoveToList from '$lib/components/TaskMoveToList.svelte';
	import TaskDateTimePicker from '$lib/components/TaskDateTimePicker.svelte';

	import { getAppDataService, type Task } from '$lib/data-service.svelte';

	type TaskViewProps = {
		task: Task;
	};
	let { task }: TaskViewProps = $props();

	const dataService = getAppDataService();

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

	function updateTaskName(): Task {
		return dataService.updateTask({
			...task,
			name: taskName.value
		});
	}

	function updateTaskDescription(): Task {
		return dataService.updateTask({
			...task,
			description: taskDescription.value
		});
	}
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
		t={task} />
</div>

<div class="flex items-center space-x-2">
	<TaskCheckbox t={task} />
	<TaskDateTimePicker task={task} />
</div>

<div class="mt-4 flex flex-col space-y-4">
	<Input
		onchange={() => updateTaskName()}
		onkeyup={() => {
			dataService.state.updateTask({ ...task, name: taskName.value });
		}}
		type="text"
		placeholder="No title"
		bind:value={taskName.value} />
	<Textarea
		onchange={() => updateTaskDescription()}
		bind:value={taskDescription.value}></Textarea>
</div>
