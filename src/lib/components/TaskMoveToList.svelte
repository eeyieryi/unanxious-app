<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';

	import { getAppDataService, type List, type Task } from '$lib/data-service.svelte';

	const dataService = getAppDataService();

	type Props = {
		task: Task;
		availableLists: List[];
	};
	let { task, availableLists }: Props = $props();

	async function moveToList(listID: string) {
		if (task.list_id === listID) {
			return;
		}
		dataService.updateTask({
			...task,
			list_id: listID
		});
	}
</script>

<Dialog.Root>
	<Dialog.Trigger
		>{task.list_id
			? (availableLists.find((l) => l.id === task.list_id)?.name ?? 'No List')
			: 'No List'}</Dialog.Trigger>
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
