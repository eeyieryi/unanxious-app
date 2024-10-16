<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';

	import type { List, Task } from '$lib/app-state';
	import { getAppDataService } from '$lib/app-state/data-service.svelte';

	const { tasksService } = getAppDataService();

	type Props = {
		task: Task;
		availableLists: List[];
	};
	let { task, availableLists }: Props = $props();

	function moveToList(listID: string) {
		if (task.list_id === listID) {
			return;
		}
		tasksService.updateTask({
			task: {
				...task,
				list_id: listID
			}
		});
	}

	let listName = $derived.by(() => {
		const found = availableLists.find((l) => l.id === task.list_id);
		if (found) {
			return `list: ${found.name}`;
		}
		return 'no list';
	});
</script>

<Dialog.Root>
	<Dialog.Trigger class="capitalize">{listName}</Dialog.Trigger>
	<Dialog.Content class="w-full max-w-48">
		<Dialog.Title>Select List</Dialog.Title>
		<ul>
			<li>
				<Dialog.Close
					onclick={() => moveToList('inbox')}
					class={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}>Inbox</Dialog.Close>
			</li>
			{#each availableLists as availableList (availableList.id)}
				<li>
					<Dialog.Close
						onclick={() => moveToList(availableList.id)}
						class={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}
						>{availableList.name}</Dialog.Close>
				</li>
			{/each}
		</ul>
	</Dialog.Content>
</Dialog.Root>
