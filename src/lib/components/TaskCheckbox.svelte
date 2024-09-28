<script lang="ts">
	import { env } from '$env/dynamic/public';

	import { Checkbox } from '$lib/components/ui/checkbox';

	import type { Task } from '$lib/api';
	import { tasksStore } from '$lib/tasks.store';

	function toggleTaskCompleted() {
		fetch(`${env.PUBLIC_API_BASE_URL}/tasks/${t.id}/toggle-completed`, {
			method: 'PATCH'
		})
			.then(async (res) => {
				if (res.headers.get('Content-Type') === 'application/json') {
					return { res, data: await res.json() };
				}
				throw Error('Content-Type is not application/json');
			})
			.then(({ res, data }) => {
				if (res.ok) {
					tasksStore.update((tasks) => {
						return tasks.map((ta) => {
							if (ta.id === t.id) {
								return data as Task;
							}
							return ta;
						});
					});
				} else {
					console.error(res.status, data);
				}
			});
	}

	type Props = {
		t: Task;
	};
	let { t }: Props = $props();
</script>

<Checkbox
	onCheckedChange={() => toggleTaskCompleted()}
	checked={t.completed} />
