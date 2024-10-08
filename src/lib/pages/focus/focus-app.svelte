<script lang="ts">
	import { Archive, Pause, Play, Trash2, X } from 'lucide-svelte';

	import { cn } from '$lib/utils';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';

	import { dhms, padWithZero } from '$lib/datetime';
	import { getAppDataService } from '$lib/app-state';

	import { TimerDigits, TimerList } from './components';

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
				<Dialog.Content>
					<Dialog.Title>
						{#if selectedTimerTask}
							<span class="capitalize">timer:</span>&nbsp;<span
								>{focusService.state.selectedTimer.name}</span>
						{:else}
							<span class="capitalize">attach&nbsp;to&nbsp;task</span>
						{/if}
					</Dialog.Title>

					<div class="flex items-center space-x-2">
						<Dialog.Close
							class={cn(buttonVariants({ variant: 'secondary' }), 'space-x-2')}
							onclick={() => {
								if (confirm('are you sure you want to archive this timer?')) {
									if (!focusService.state.selectedTimer) return;
									focusService.archiveTimer(focusService.state.selectedTimer);
								}
							}}>
							<Archive class="h-4 w-4" />
							<span class="capitalize">archive</span>
						</Dialog.Close>

						<Dialog.Close
							class={cn(buttonVariants({ variant: 'destructive' }), 'space-x-2')}
							onclick={() => {
								if (confirm('are you sure you want to delete this timer?')) {
									if (!focusService.state.selectedTimer) return;
									focusService.deleteTimer(focusService.state.selectedTimer);
								}
							}}>
							<Trash2 class="h-4 w-4" />
							<span class="capitalize">delete</span>
						</Dialog.Close>
					</div>

					{#if !selectedTimerTask}
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
					{/if}
					<Dialog.Footer>
						<Dialog.Close class={cn(buttonVariants({ variant: 'secondary' }))}>
							<span class="capitalize">cancel</span>
						</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		{:else}
			<Button variant="outline">
				<span class="font-lg font-mono uppercase">focus</span>
			</Button>
		{/if}

		<div class="flex items-center space-x-2">
			<Button
				class="space-x-2"
				variant="secondary"
				onclick={() => {}}>
				<Archive class="h-4 w-4" />
				<span class="capitalize">show&nbsp;archived</span>
			</Button>

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

<TimerList />
