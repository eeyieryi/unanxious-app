<script lang="ts">
	import { MoreVertical } from 'lucide-svelte';

	import { cn } from '$lib/components/utils';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ConfirmDialog } from '$lib/components/ui/confirm-dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';

	import { getAppDataService, type Counter } from '$lib/app-state';

	const { counterService } = getAppDataService();

	interface Props {
		counter: Counter;
	}
	let { counter }: Props = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={cn(
			buttonVariants({ variant: 'ghost', size: 'icon' }),
			'absolute right-2 top-2 h-6 w-6'
		)}>
		<MoreVertical class="h-4 w-4" />
	</Dialog.Trigger>
	<Dialog.Content class="flex max-w-[80%] flex-col items-center rounded-md sm:max-w-[400px]">
		<Dialog.Title>Counter: {counter.name}</Dialog.Title>
		<ConfirmDialog
			title="Delete Counter"
			message="Are you sure you want to delete this counter?"
			onconfirm={() => {
				counterService.deleteCounter(counter);
			}}>
			{#snippet trigger()}
				<Button
					class="w-full capitalize"
					variant="destructive">delete&nbsp;counter</Button>
			{/snippet}
		</ConfirmDialog>
	</Dialog.Content>
</Dialog.Root>
