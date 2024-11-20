<script lang="ts">
	import { Eye, EyeOff, MoreVertical } from 'lucide-svelte';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	import { getAppDataService } from '$lib/app-state';
	import { cn } from '$lib/components/utils';

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
			class={cn(buttonVariants({ variant: 'outline' }), 'min-w-[80%] space-x-2')}
			onclick={() => {
				uiPrefsService.toggleShowCompleted();
			}}>
			{#if uiPrefsService.state.showCompletedTasks}
				<EyeOff />
				<div class="grow">
					<span class="capitalize">hide&nbsp;completed&nbsp;tasks</span>
				</div>
			{:else}
				<Eye />
				<div class="grow">
					<span class="capitalize">show&nbsp;completed&nbsp;tasks</span>
				</div>
			{/if}
		</Dialog.Close>
		<Dialog.Close
			class={cn(buttonVariants({ variant: 'outline' }), 'min-w-[80%] space-x-2')}
			onclick={() => {
				uiPrefsService.toggleShowListAll();
			}}>
			{#if uiPrefsService.state.showListAll}
				<EyeOff />
				<div class="grow">
					<span class="capitalize">hide&nbsp;list&nbsp;</span><span class="uppercase"
						>&quot;all&quot;</span>
				</div>
			{:else}
				<Eye />
				<div class="grow">
					<span class="capitalize">show&nbsp;list&nbsp;</span><span class="uppercase"
						>&quot;all&quot;</span>
				</div>
			{/if}
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
