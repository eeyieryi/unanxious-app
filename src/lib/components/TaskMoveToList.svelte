<script lang="ts">
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import type { List, Task } from '$lib/api';
	import { tasksStore } from '$lib/tasks.store';

	async function moveToList() {
		const res = await fetch(`${env.PUBLIC_API_BASE_URL}/tasks/${t.id}/move-to-list`, {
			method: 'PATCH',
			body: JSON.stringify({
				list_id: moveToListID // "" to remove
			})
		});
		return (await res.json()) as Task;
	}

	type TaskMoveToListProps = {
		t: Task;
		availableLists: List[];
		moveToListDialog: HTMLDialogElement | undefined;
	};
	let { t, availableLists, moveToListDialog = $bindable() }: TaskMoveToListProps = $props();
	let moveToListID = $state<string>(t.list_id ?? '');
</script>

<dialog bind:this={moveToListDialog} id="move-to-list-dialog" class="modal">
	<div class="modal-box">
		<form id="move-to-list" method="dialog">
			<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
		</form>

		<select bind:value={moveToListID}>
			<option value="">Inbox</option>
			{#each availableLists as l (l.id)}
				<option value={l.id}>
					{l.title}
				</option>
			{/each}
		</select>

		<button
			class="btn"
			disabled={moveToListID === t.list_id}
			onclick={async () => {
				if (t.list_id === moveToListID) {
					return;
				}
				const tu = await moveToList();
				const oldListId = t.list_id || 'all';
				tasksStore.removeTask(tu);
				goto(`/lists/${oldListId}/tasks`);
			}}>OK</button
		>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
