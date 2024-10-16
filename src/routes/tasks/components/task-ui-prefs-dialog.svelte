<script lang="ts">
	import { Eye, EyeOff, MoreVertical } from 'lucide-svelte';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	import { getAppDataService } from '$lib/app-state';
	import { cn } from '$lib/utils';

	const { uiPrefsService } = getAppDataService();
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button
			variant="outline"
			size="icon">
			<MoreVertical class="h-4 w-4" />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content class="flex max-w-[80%] flex-col items-center rounded-md sm:max-w-[400px]">
		<span class="mb-2 font-medium">Tasks User Interface</span>
		<Dialog.Close
			class={cn(buttonVariants({ variant: 'outline' }), 'space-x-2')}
			onclick={() => {
				uiPrefsService.toggleShowCompleted();
			}}>
			{#if uiPrefsService.state.showCompletedTasks}
				<EyeOff />
				<span class="capitalize">hide&nbsp;completed&nbsp;tasks</span>
			{:else}
				<Eye />
				<span class="capitalize">show&nbsp;completed&nbsp;tasks</span>
			{/if}
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
