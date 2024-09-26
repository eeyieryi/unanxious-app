<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { Task } from '$lib/api';
	import { tasksStore } from '$lib/tasks.store';

	async function updateTaskDueAt(): Promise<Task> {
		const date = new Date(dueAt);
		const res = await fetch(`${env.PUBLIC_API_BASE_URL}/tasks/${t.id}/update-due-at`, {
			method: 'PATCH',
			body: JSON.stringify({
				due_at: date.valueOf() // unix epoch
			})
		});
		return (await res.json()) as Task;
	}

	type TaskDateTimePickerProps = {
		t: Task;
		datepicker: HTMLDialogElement | null;
	};
	let { t, datepicker = $bindable() }: TaskDateTimePickerProps = $props();
	let dueAt = $state<string>('');
</script>

<dialog bind:this={datepicker} id="datepicker" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
		</form>

		<input type="datetime-local" bind:value={dueAt} name="due-at" />

		<button
			class="btn"
			onclick={async () => {
				const tu = await updateTaskDueAt();
				tasksStore.update((tasks) => {
					return tasks.map((ta) => {
						if (ta.id === tu.id) {
							return { ...tu, dueAt: dueAt };
						}
						return ta;
					});
				});
			}}>OK</button
		>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
