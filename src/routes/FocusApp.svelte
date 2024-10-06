<script lang="ts">
	import { Pause, Play, X } from 'lucide-svelte';

	import { cn } from '$lib/utils';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';

	import TimerDigits from '$lib/components/TimerDigits.svelte';

	import { dhms, padWithZero } from '$lib/datetime';
	import { getAppDataService } from '$lib/data-service.svelte';

	const dataService = getAppDataService();

	let isPaused = $derived(
		!(
			dataService.state.selectedTimerLastInterval !== null &&
			dataService.state.selectedTimerLastInterval.end_time === null
		)
	);

	let selectedTimerTask = $derived.by(() => {
		if (dataService.state.selectedTimer && dataService.state.selectedTimer.task_id) {
			const taskID = dataService.state.selectedTimer.task_id;
			const found = dataService.state.tasks.find((t) => t.id === taskID);
			if (found) return found;
		}
		return null;
	});

	const timerTaskIDs = $derived(
		dataService.state.timers.map((timer) => timer.task_id).filter((id) => id !== null)
	);
	const availableToAttachTasks = $derived(
		dataService.state.tasks.filter((t) => !timerTaskIDs.includes(t.id))
	);

	let selectedTimerStatsToday = $derived(dhms(dataService.state.selectedTimerStats.today));
	let selectedTimerStatsTotal = $derived(dhms(dataService.state.selectedTimerStats.total));

	let createTimerForm = $state<HTMLFormElement>();
	let createTimerFormInputName = $state('');
</script>

<svelte:head>
	<title>Unanxious :: Focus</title>
</svelte:head>

<div class="flex h-screen w-full min-w-[460px] max-w-[460px] flex-col space-y-8 border-r px-2 py-2">
	<div class="flex items-center justify-between">
		{#if dataService.state.selectedTimer}
			{#if selectedTimerTask}
				<Button variant="outline">
					Task: {selectedTimerTask.name}
				</Button>
			{:else}
				<Dialog.Root>
					<Dialog.Trigger
						class={cn(
							buttonVariants({
								variant: 'outline'
							})
						)}>
						Timer: {dataService.state.selectedTimer.name}
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Title>Attach to task</Dialog.Title>
						<div>
							<ul>
								{#each availableToAttachTasks as task (task.id)}
									<li>
										<Dialog.Close onclick={() => dataService.attachTaskToTimer(task)}
											>{task.name}</Dialog.Close>
									</li>
								{/each}
							</ul>
						</div>
						<Dialog.Footer>
							<Dialog.Close>Cancel</Dialog.Close>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			{/if}
		{:else}
			<Button variant="outline">
				<span class="font-lg font-mono uppercase">focus</span>
			</Button>
		{/if}
		{#if dataService.state.selectedTimer}
			<Button
				variant="outline"
				size="icon"
				onclick={() => (dataService.state.selectedTimerID = null)}>
				<X />
			</Button>
		{/if}
	</div>
	<div class="flex flex-col items-center justify-center space-y-4">
		<TimerDigits
			startTime={dataService.state.selectedTimerLastInterval?.start_time ?? null}
			endTime={dataService.state.selectedTimerLastInterval?.end_time ?? null}
			isPaused={isPaused} />

		<Button
			size="icon"
			variant="outline"
			onclick={() => dataService.toggleTimer()}>
			{#if isPaused}
				<Play />
			{:else}
				<Pause />
			{/if}
		</Button>
	</div>
	<div class="flex justify-around text-center">
		<div class="flex w-20 flex-col items-center">
			<span class="text-muted-foreground">Today</span>
			<div class="flex items-center font-mono">
				{#if selectedTimerStatsToday.hours > 0}
					<span>{padWithZero(selectedTimerStatsToday.hours)}</span>
					<span>:</span>
				{/if}
				<span>{padWithZero(selectedTimerStatsToday.minutes)}</span>
				<span>:</span>
				<span>{padWithZero(selectedTimerStatsToday.seconds)}</span>
			</div>
		</div>
		<div class="flex w-20 flex-col items-center">
			<span class="text-muted-foreground">Total</span>
			<div class="flex items-center font-mono">
				{#if selectedTimerStatsTotal.hours > 0}
					<span>{padWithZero(selectedTimerStatsTotal.hours)}</span>
					<span>:</span>
				{/if}
				<span>{padWithZero(selectedTimerStatsTotal.minutes)}</span>
				<span>:</span>
				<span>{padWithZero(selectedTimerStatsTotal.seconds)}</span>
			</div>
		</div>
	</div>
	<form
		bind:this={createTimerForm}
		onsubmit={async (e) => {
			e.preventDefault();
			const timer = dataService.createTimer(createTimerFormInputName);
			dataService.state.selectedTimerID = timer.id;
			createTimerForm?.reset();
		}}
		class="flex items-center space-x-2">
		<Label for="timer-title-input">Timer</Label>
		<Input
			bind:value={createTimerFormInputName}
			placeholder="mindfulness" />
	</form>
	{#if dataService.state.timers.length > 0}
		<ul class="flex w-full flex-col items-center justify-center space-y-2">
			{#each dataService.state.timers as timer (timer.id)}
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
</div>
