<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { formatDueAt, type Task } from '$lib/api';
	import TaskCheckbox from '$lib/components/TaskCheckbox.svelte';
	import TaskDateTimePicker from '$lib/components/TaskDateTimePicker.svelte';
	import { tasksStore } from '$lib/tasks.store.js';

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

	async function updateTaskTitle(): Promise<Task> {
		const res = await fetch(`${env.PUBLIC_API_BASE_URL}/tasks/${task?.id}/update-title`, {
			method: 'PATCH',
			body: JSON.stringify({
				title: taskTitle.value
			})
		});
		return (await res.json()) as Task;
	}
	async function updateTaskDescription(): Promise<Task> {
		const res = await fetch(`${env.PUBLIC_API_BASE_URL}/tasks/${task?.id}/update-description`, {
			method: 'PATCH',
			body: JSON.stringify({
				description: taskDescription.value
			})
		});
		return (await res.json()) as Task;
	}

	let datepicker: HTMLDialogElement | null = $state(null);
	let taskDueAt = $derived(task.due_at ? formatDueAt(task.due_at) : null);
</script>

<div>
	<TaskCheckbox t={task} />
	<button onclick={() => datepicker!.showModal()} class="text-neutral-content"
		>{taskDueAt ?? 'Date'}</button
	>
	<TaskDateTimePicker bind:datepicker t={task} />
</div>
<div class="flex flex-col">
	<input
		onchange={async () => {
			const tu = await updateTaskTitle();
			tasksStore.updateTask(tu);
		}}
		onkeyup={() => {
			tasksStore.updateTask({ ...task, title: taskTitle.value });
		}}
		class="input input-sm input-accent"
		type="text"
		placeholder="No title"
		bind:value={taskTitle.value}
	/>
	<textarea
		class="textarea"
		onchange={async () => {
			const tu = await updateTaskDescription();
			tasksStore.updateTask(tu);
		}}
		bind:value={taskDescription.value}
	></textarea>
</div>
