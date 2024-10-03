<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';

	import { getAppDataService, type List, type Task } from '$lib/data-service.svelte';

	const dataService = getAppDataService();

	type Props = {
		t: Task;
		availableLists: List[];
	};
	let { t, availableLists }: Props = $props();

	async function moveToList(listID: string) {
		if (t.list_id === listID) {
			return;
		}
		const tu = dataService.updateTask({
			...t,
			list_id: listID
		});
		dataService.state.updateTask(tu);
	}
</script>

<Dialog.Root>
	<Dialog.Trigger
		>{t.list_id
			? (availableLists.find((l) => l.id === t.list_id)?.name ?? 'No List')
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
