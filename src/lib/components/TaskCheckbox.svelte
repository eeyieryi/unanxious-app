<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { Task } from '$lib/api';
	import { tasksStore } from '$lib/tasks.store';

	async function toggleTaskCompleted() {
		let res: Response | undefined = undefined;
		let data = undefined;
		try {
			res = await fetch(`${env.PUBLIC_API_BASE_URL}/tasks/${t.id}/toggle-completed`, {
				method: 'PATCH'
			});
			if (res.headers.get('Content-Type') === 'application/json') {
				data = await res.json();
			}
		} catch (err: unknown) {
			console.error(err);
		}
		if (!res) {
			console.error('something went wrong!');
			return;
		}
		if (!res.ok) {
			console.error(data);
			return;
		}
		tasksStore.update((tasks) => {
			return tasks.map((ta) => {
				if (ta.id === t.id) {
					return data as Task;
				}
				return ta;
			});
		});
	}

	type TaskCheckboxProps = {
		t: Task;
	};

	let { t }: TaskCheckboxProps = $props();
</script>

<input
	onchange={() => toggleTaskCompleted()}
	class="checkbox checkbox-xs"
	type="checkbox"
	checked={t.completed}
/>
