<script lang="ts">
	import { Trash2 } from 'lucide-svelte';

	import { cn } from '$lib/components/utils';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';

	interface Props {
		handleDelete: () => void;
	}
	let { handleDelete }: Props = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'secondary' }), 'space-x-2')}>
		<Trash2 class="h-5 w-5" />
		<span class="capitalize">delete&nbsp;task</span>
	</Dialog.Trigger>

	<Dialog.Content class="flex max-w-[90%] flex-col items-center rounded-md sm:max-w-[400px]">
		<Dialog.Title>Delete Task</Dialog.Title>

		<p class="font-light">Are you sure you want to delete this task?</p>

		<Dialog.Close class={cn(buttonVariants({ variant: 'outline' }), 'w-full capitalize')}
			>cancel</Dialog.Close>

		<Dialog.Close
			onclick={handleDelete}
			class={cn(
				buttonVariants({ variant: 'destructive' }),
				'space-x-2 bg-destructive/40 text-destructive-foreground hover:bg-destructive',
				'w-full'
			)}>
			<Trash2 class="h-5 w-5" />
			<span class="capitalize">delete&nbsp;task</span>
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
