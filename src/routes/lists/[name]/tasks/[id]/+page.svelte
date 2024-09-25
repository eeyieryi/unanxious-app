<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import type { Task } from '$lib/api';
	import TaskCheckbox from '$lib/components/TaskCheckbox.svelte';
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

	async function updateTaskTitle(): Promise<Task> {
		console.log(task?.title);
		const res = await fetch(`${env.PUBLIC_API_BASE_URL}/tasks/${task?.id}/update-title`, {
			method: 'PATCH',
			body: JSON.stringify({
				title: taskTitle.value
			})
		});
		return (await res.json()) as Task;
	}
</script>

<div class="flex flex-col p-4">
	{#if task}
		<div>
			<TaskCheckbox t={task} />
			<span class="text-neutral-content">Date</span>
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
			<textarea class="textarea"></textarea>
		</div>
	{/if}
</div>
