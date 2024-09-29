<script lang="ts">
	import { page } from '$app/stores';

	import { ArrowLeft } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';

	import TaskCheckbox from '$lib/components/TaskCheckbox.svelte';
	import TaskMoveToList from '$lib/components/TaskMoveToList.svelte';
	import TaskDateTimePicker from '$lib/components/TaskDateTimePicker.svelte';

	import { listsStore, tasksStore } from '$lib/tasks.store.js';
	import { fetchAPI, isAPIResponseError, logAPIResponseErrorToConsole, type Task } from '$lib/api';

	type TaskViewProps = {
		task: Task;
	};
	let { task }: TaskViewProps = $props();

	let taskTitle = {
		get value() {
			return task?.title;
		},
		set value(v) {
			task.title = v;
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

	async function updateTaskTitle(): Promise<Task | void> {
		if (!task) return;
		const apiResponse = await fetchAPI<Task>(fetch, `/tasks/${task.id}/update-title`, {
			method: 'PATCH',
			body: JSON.stringify({
				title: taskTitle.value
			})
		});
		if (isAPIResponseError(apiResponse)) {
			logAPIResponseErrorToConsole(apiResponse);
			// handle error
			return;
		}
		return apiResponse.data;
	}

	async function updateTaskDescription(): Promise<Task | void> {
		if (!task) return;
		const apiResponse = await fetchAPI<Task>(fetch, `/tasks/${task.id}/update-description`, {
			method: 'PATCH',
			body: JSON.stringify({
				description: taskDescription.value
			})
		});
		if (isAPIResponseError(apiResponse)) {
			logAPIResponseErrorToConsole(apiResponse);
			// handle error
			return;
		}
		return apiResponse.data;
	}
</script>

<div class="flex items-center space-x-2">
	<Button
		variant="link"
		size="icon"
		href="/lists/{$page.params.name}/tasks">
		<ArrowLeft />
	</Button>
	<TaskMoveToList
		availableLists={$listsStore}
		t={task} />
</div>

<div class="flex items-center space-x-2">
	<TaskCheckbox t={task} />
	<TaskDateTimePicker task={task} />
</div>

<div class="mt-4 flex flex-col space-y-4">
	<Input
		onchange={async () => {
			const tu = await updateTaskTitle();
			if (tu) {
				tasksStore.updateTask(tu);
			}
		}}
		onkeyup={() => {
			tasksStore.updateTask({ ...task, title: taskTitle.value });
		}}
		type="text"
		placeholder="No title"
		bind:value={taskTitle.value} />
	<Textarea
		onchange={async () => {
			const tu = await updateTaskDescription();
			if (tu) {
				tasksStore.updateTask(tu);
			}
		}}
		bind:value={taskDescription.value}></Textarea>
</div>
