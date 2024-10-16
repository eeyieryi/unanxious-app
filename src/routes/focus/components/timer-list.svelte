<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { CustomScrollArea } from '$lib/components/ui/custom-scroll-area';

	import { getAppDataService, isTimerArchived, isTimerNotArchived } from '$lib/app-state';

	const { focusService } = getAppDataService();

	type Props = {
		showArchived: boolean;
	};
	let { showArchived }: Props = $props();

	let timersToShow = $derived(
		Array.from(focusService.state.timers.values()).filter((timer) => {
			return showArchived ? isTimerArchived(timer) : isTimerNotArchived(timer);
		})
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
	{:else if showArchived}
		<span class="uppercase">no&nbsp;archived&nbsp;timers</span>
	{:else}
		<span class="capitalize">no&nbsp;timers</span>
	{/if}
</CustomScrollArea>
