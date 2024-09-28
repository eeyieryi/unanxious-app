<script lang="ts">
	import { env } from '$env/dynamic/public';

	import { cn } from '$lib/utils';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';

	import type { List, Task } from '$lib/api';
	import { tasksStore } from '$lib/tasks.store';

	async function moveToList(listID: string | null) {
		if (t.list_id === listID) {
			return;
		}
		fetch(`${env.PUBLIC_API_BASE_URL}/tasks/${t.id}/move-to-list`, {
			method: 'PATCH',
			body: JSON.stringify({
				list_id: listID
			})
		})
			.then((res) => res.json())
			.then((tu) => {
				tasksStore.updateTask(tu);
			});
	}

	type Props = {
		t: Task;
		availableLists: List[];
	};
	let { t, availableLists }: Props = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger
		>{t.list_id
			? (availableLists.find((l) => l.id === t.list_id)?.title ?? 'No List')
			: 'No List'}</Dialog.Trigger>
	<Dialog.Content class="w-full max-w-48">
		<Dialog.Title>Select List</Dialog.Title>
		<ul>
			<li>
				<Dialog.Close
					onclick={() => moveToList(null)}
					class={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}>Inbox</Dialog.Close>
			</li>
			{#each availableLists as availableList (availableList.id)}
				<li>
					<Dialog.Close
						onclick={() => moveToList(availableList.id)}
						class={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}
						>{availableList.title}</Dialog.Close>
				</li>
			{/each}
		</ul>
	</Dialog.Content>
</Dialog.Root>
