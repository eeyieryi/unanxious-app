<script lang="ts">
	import {
		Archive,
		ArchiveRestore,
		ChevronLeft,
		Pause,
		Play,
		TimerReset,
		Trash2,
		X
	} from 'lucide-svelte';

	import { cn } from '$lib/utils';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ConfirmDialog } from '$lib/components/ui/confirm-dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { CustomScrollArea } from '$lib/components/ui/custom-scroll-area';

	import { dhms } from '$lib/datetime';
	import { getAppDataService } from '$lib/app-state';

	import { TimerDigits, TimerList, TimerStats, FocusOptions } from './components';

	const { focusService, tasksService } = getAppDataService();

	let isPaused = $derived(
		!(
			focusService.state.selectedTimerLastInterval !== null &&
			focusService.state.selectedTimerLastInterval.end_time === null
		)
	);

	let selectedTimerTask = $derived.by(() => {
		if (focusService.state.selectedTimer && focusService.state.selectedTimer.task_id) {
			const taskID = focusService.state.selectedTimer.task_id;
			const found = tasksService.state.tasks.get(taskID);
			if (found) return found;
		}
		return null;
	});

	const timerTaskIDs = $derived(
		Array.from(focusService.state.timers.values())
			.map((timer) => timer.task_id)
			.filter((id) => id !== null)
	);
	const availableToAttachTasks = $derived(
		Array.from(tasksService.state.tasks.values()).filter((t) => !timerTaskIDs.includes(t.id))
	);

	let selectedTimerStatsToday = $derived(dhms(focusService.state.selectedTimerStats.today));
	let selectedTimerStatsTotal = $derived(dhms(focusService.state.selectedTimerStats.total));

	let createTimerForm = $state<HTMLFormElement>();
	let createTimerFormInputName = $state('');

	let showArchived = $state(false);
	const toggleShowArchived = () => {
		showArchived = !showArchived;
		focusService.state.selectedTimerID = null;
	};
</script>

<svelte:head>
	<title>Unanxious :: Focus</title>
</svelte:head>

<div class="mb-10 flex max-w-full flex-col space-y-6">
	<div class="flex items-center justify-between">
		{#if focusService.state.selectedTimer}
			<Dialog.Root>
				<Dialog.Trigger
					class={cn(
						buttonVariants({
							variant: 'outline'
						})
					)}>
					{#if selectedTimerTask}
						<span>Task:&nbsp;{selectedTimerTask.name}</span>
					{:else}
						<span>Timer:&nbsp;{focusService.state.selectedTimer.name}</span>
					{/if}
				</Dialog.Trigger>
				<Dialog.Content
					class="flex max-h-[80%] max-w-[80%] flex-col items-center rounded-md sm:max-w-[400px]">
					<Dialog.Title>
						<span class="capitalize">timer:</span>&nbsp;<span
							>{focusService.state.selectedTimer.name}</span>
					</Dialog.Title>

					<div class="flex items-center space-x-2">
						{#if showArchived}
							<Dialog.Close
								class={cn(buttonVariants({ variant: 'secondary' }), 'space-x-2')}
								onclick={() => {
									if (focusService.state.selectedTimer) {
										focusService.unarchiveTimer(focusService.state.selectedTimer);
										focusService.state.selectedTimerID = null;
									}
								}}>
								<ArchiveRestore class="h-4 w-4" />
								<span class="capitalize">restore</span>
							</Dialog.Close>
						{:else}
							<ConfirmDialog
								onconfirm={() => {
									if (!focusService.state.selectedTimer) return;
									focusService.archiveTimer(focusService.state.selectedTimer);
									focusService.state.selectedTimerID = null;
								}}
								title="Archive Timer"
								message="Are you sure you want to archive this timer?">
								{#snippet trigger()}
									<Dialog.Close class={cn(buttonVariants({ variant: 'secondary' }), 'space-x-2')}>
										<Archive class="h-4 w-4" />
										<span class="capitalize">archive</span>
									</Dialog.Close>
								{/snippet}
							</ConfirmDialog>
						{/if}

						<ConfirmDialog
							onconfirm={() => {
								if (!focusService.state.selectedTimer) return;
								focusService.deleteTimer(focusService.state.selectedTimer);
							}}
							title="Delete Timer"
							message="Are you sure you want to delete this timer?">
							{#snippet trigger()}
								<Dialog.Close class={cn(buttonVariants({ variant: 'destructive' }), 'space-x-2')}>
									<Trash2 class="h-4 w-4" />
									<span class="capitalize">delete</span>
								</Dialog.Close>
							{/snippet}
						</ConfirmDialog>
					</div>

					{#if !selectedTimerTask}
						<span class="font-medium capitalize">attach&nbsp;to&nbsp;task</span>
						<div class="flex grow overflow-hidden">
							<CustomScrollArea>
								<div>
									<ul>
										{#each availableToAttachTasks as task (task.id)}
											<li>
												<Dialog.Close
													onclick={() => {
														if (!focusService.state.selectedTimer) return;
														focusService.attachTaskToTimer(focusService.state.selectedTimer, task);
													}}>{task.name}</Dialog.Close>
											</li>
										{/each}
									</ul>
								</div>
							</CustomScrollArea>
						</div>
					{/if}

					<Dialog.Footer>
						<Dialog.Close class={cn(buttonVariants({ variant: 'secondary' }))}>
							<span class="capitalize">cancel</span>
						</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		{:else if !showArchived}
			<Button variant="outline">
				<span class="font-lg font-mono uppercase">focus</span>
			</Button>
		{:else}
			<span class={cn(buttonVariants({ variant: 'outline' }), 'font-lg font-mono uppercase')}
				>archived&nbsp;timers</span>
		{/if}

		<div class="flex items-center space-x-2">
			{#if !showArchived && focusService.state.selectedTimerLastInterval}
				<Dialog.Root>
					<Dialog.Trigger
						class={cn('self-start', buttonVariants({ variant: 'outline', size: 'icon' }))}>
						<TimerReset />
					</Dialog.Trigger>
					<Dialog.Content
						class="flex max-w-[80%] flex-col items-center rounded-md sm:max-w-[400px]">
						<Dialog.Title>Clear Interval</Dialog.Title>
						<p class="font-light">Are you sure you want to delete the last/current interval?</p>
						<Dialog.Close
							onclick={() => focusService.clearIntervalSelectedTimer()}
							class={cn('space-x-2', buttonVariants({ variant: 'destructive' }))}>
							<TimerReset />
							<span>Clear Interval</span>
						</Dialog.Close>
					</Dialog.Content>
				</Dialog.Root>
			{/if}
			{#if showArchived}
				<Button
					class="space-x-2"
					variant="outline"
					onclick={() => toggleShowArchived()}>
					<ChevronLeft class="h-4 w-4" />
					<span class="uppercase">go&nbsp;back</span>
				</Button>
			{:else}
				<FocusOptions handleShowArchived={() => toggleShowArchived()} />
			{/if}
			{#if focusService.state.selectedTimer}
				<Button
					variant="outline"
					size="icon"
					onclick={() => (focusService.state.selectedTimerID = null)}>
					<X />
				</Button>
			{/if}
		</div>
	</div>
	<div class="flex flex-col items-center justify-center space-y-4">
		<TimerDigits
			startTime={focusService.state.selectedTimerLastInterval?.start_time ?? null}
			endTime={focusService.state.selectedTimerLastInterval?.end_time ?? null}
			isPaused={isPaused} />

		{#if showArchived && focusService.state.selectedTimer}
			<Button
				variant="outline"
				onclick={() => {
					if (focusService.state.selectedTimer) {
						focusService.unarchiveTimer(focusService.state.selectedTimer);
						focusService.state.selectedTimerID = null;
					}
				}}
				class="flex items-center space-x-2">
				<ArchiveRestore />
				<span class="capitalize">restore</span>
			</Button>
		{:else}
			<Button
				size="icon"
				variant="outline"
				onclick={() => focusService.toggleSelectedTimer()}>
				{#if isPaused}
					<Play />
				{:else}
					<Pause />
				{/if}
			</Button>
		{/if}
	</div>

	<div class="flex justify-around text-center">
		<div class="flex w-20 flex-col items-center">
			<span class="text-muted-foreground">Today</span>
			<div class="flex items-center font-mono">
				<TimerStats
					withDHMS={selectedTimerStatsToday}
					hours={selectedTimerStatsToday.hours > 0}
					minutes
					seconds />
			</div>
		</div>
		<div class="flex w-20 flex-col items-center">
			<span class="text-muted-foreground">Total</span>
			<div class="flex items-center font-mono">
				<TimerStats
					withDHMS={selectedTimerStatsTotal}
					days
					hours
					minutes />
			</div>
		</div>
	</div>

	<form
		bind:this={createTimerForm}
		onsubmit={async (e) => {
			e.preventDefault();
			const timer = focusService.createTimer(createTimerFormInputName);
			focusService.state.selectedTimerID = timer.id;
			createTimerForm?.reset();
		}}
		class="flex items-center space-x-2">
		<Label for="timer-title-input">Timer</Label>
		<Input
			bind:value={createTimerFormInputName}
			placeholder="mindfulness" />
	</form>
</div>

<TimerList showArchived={showArchived} />
