<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { CustomScrollArea } from '$lib/components/ui/custom-scroll-area';

	import { isTimerNotArchived } from '$lib/app-state/data-service.svelte';
	import { getAppDataService } from '$lib/app-state/data-service.svelte';

	const dataService = getAppDataService();

	let timersToShow = $derived(dataService.state.timers.filter(isTimerNotArchived));
</script>

<CustomScrollArea>
	{#if timersToShow.length > 0}
		<ul class="flex w-full flex-col items-center justify-center space-y-2">
			{#each timersToShow as timer (timer.id)}
				<li class="w-full">
					<Button
						onclick={() => {
							dataService.state.selectedTimerID = timer.id;
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
