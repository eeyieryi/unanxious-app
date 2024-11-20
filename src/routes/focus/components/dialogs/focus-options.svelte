<script lang="ts">
	import { Archive, MoreVertical } from 'lucide-svelte';

	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';

	import { cn } from '$lib/components/utils';

	interface Props {
		handleShowArchived: () => void;
	}
	let { handleShowArchived }: Props = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
		<MoreVertical class="h-4 w-4" />
	</Dialog.Trigger>
	<Dialog.Content class="flex max-w-[80%] flex-col items-center rounded-md sm:max-w-[400px]">
		<Dialog.Title class="capitalize">options</Dialog.Title>

		<Dialog.Close
			class={cn(buttonVariants({ variant: 'secondary' }), 'space-x-2')}
			onclick={handleShowArchived}>
			<Archive class="h-4 w-4" />
			<span class="capitalize">show&nbsp;archived</span>
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
