<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import { formatDueAt, type Task } from '$lib/api';
	import TaskCheckbox from '$lib/components/TaskCheckbox.svelte';
	import TaskDateTimePicker from '$lib/components/TaskDateTimePicker.svelte';
	import { tasksStore } from '$lib/tasks.store.js';

	let task = $derived(
		$tasksStore ? $tasksStore.find((t) => t.id === $page.params.id)! : ({} as Task)
	);

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

<div class="flex flex-col p-4">
	{#if task}
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
					tasksStore.update((tasks) => {
						return tasks.map((ta) => {
							if (ta.id === task.id) {
								return tu as Task;
							}
							return ta;
						});
					});
				}}
				onkeyup={() => {
					tasksStore.update((tasks) => {
						return tasks.map((ta) => {
							if (ta.id === task.id) {
								return { ...task, title: taskTitle.value };
							}
							return ta;
						});
					});
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
					tasksStore.update((tasks) => {
						return tasks.map((ta) => {
							if (ta.id === task.id) {
								return tu as Task;
							}
							return ta;
						});
					});
				}}
				bind:value={taskDescription.value}
			></textarea>
		</div>
	{/if}
</div>
