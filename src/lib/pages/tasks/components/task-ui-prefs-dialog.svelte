<script lang="ts">
	import { Eye, EyeOff, MoreVertical } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	import { getAppDataService } from '$lib/app-state';

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
		<Dialog.Close>
			<Button
				class="space-x-2"
				onclick={() => {
					uiPrefsService.toggleShowCompleted();
				}}
				variant="outline">
				{#if uiPrefsService.state.showCompletedTasks}
					<EyeOff />
					<span class="capitalize">hide&nbsp;completed&nbsp;tasks</span>
				{:else}
					<Eye />
					<span class="capitalize">show&nbsp;completed&nbsp;tasks</span>
				{/if}
			</Button>
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
