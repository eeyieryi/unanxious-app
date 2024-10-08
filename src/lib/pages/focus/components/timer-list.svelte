<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { CustomScrollArea } from '$lib/components/ui/custom-scroll-area';

	import { getAppDataService, isTimerNotArchived } from '$lib/app-state';

	const { focusService } = getAppDataService();

	let timersToShow = $derived(
		Array.from(focusService.state.timers.values()).filter(isTimerNotArchived)
	);
</script>

<CustomScrollArea>
	{#if timersToShow.length > 0}
		<ul class="flex w-full flex-col items-center justify-center space-y-2">
			{#each timersToShow as timer (timer.id)}
				<li class="w-full">
					<Button
						onclick={() => {
							focusService.state.selectedTimerID = timer.id;
						}}
						variant="outline"
						class="w-full">
						{timer.name}
					</Button>
				</li>
			{/each}
		</ul>
	{/if}
</CustomScrollArea>
