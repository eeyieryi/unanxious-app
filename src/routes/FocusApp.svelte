<script lang="ts">
	import { onMount } from 'svelte';

	import { Pause, Play, X } from 'lucide-svelte';

	import { cn } from '$lib/utils';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';

	import TimerDigits from '$lib/components/TimerDigits.svelte';

	import {
		getAppDataService,
		type Task,
		type Timer,
		type TimerInterval
	} from '$lib/data-service.svelte';

	const dataService = getAppDataService();

	let selectedTimer = $state<Timer | null>(null);
	let lastTimerInterval = $state<TimerInterval | null>(null);
	let isPaused = $derived(!(lastTimerInterval !== null && lastTimerInterval.end_time === null));

	let selectedTimerTask = $derived.by(() => {
		if (selectedTimer && selectedTimer.task_id) {
			const taskID = selectedTimer.task_id;
			const found = dataService.state.tasks.find((t) => t.id === taskID);
			if (found) return found;
		}
		return null;
	});

	function selectTimer(t: Timer | null) {
		selectedTimer = t;
		getLastTimerInterval();
	}

	function getLastTimerInterval() {
		lastTimerInterval = dataService.fetchLastTimerInterval(selectedTimer);
	}

	function toggleTimer() {
		const timerInterval = dataService.toggleTimer(selectedTimer);
		lastTimerInterval = timerInterval;
	}

	function attachTaskToTimer(task: Task) {
		if (!selectedTimer) return;
		selectedTimer = dataService.attachTaskToTimer(selectedTimer, task);
	}

	const timerTaskIDs = $derived(
		dataService.state.timers.map((timer) => timer.task_id).filter((id) => id !== null)
	);
	const availableToAttachTasks = $derived(
		dataService.state.tasks.filter((t) => !timerTaskIDs.includes(t.id))
	);

	onMount(() => {
		getLastTimerInterval();
	});

	let createTimerForm = $state<HTMLFormElement>();
	let createTimerName = $state('');
</script>

<div class="flex h-screen w-full min-w-[460px] max-w-[460px] flex-col space-y-8 border-r px-2 py-2">
	<div class="flex items-center justify-between">
		{#if selectedTimer}
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
						Timer: {selectedTimer.name}
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Title>Attach to task</Dialog.Title>
						<div>
							<ul>
								{#each availableToAttachTasks as task (task.id)}
									<li>
										<Dialog.Close onclick={() => attachTaskToTimer(task)}>{task.name}</Dialog.Close>
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
		{#if selectedTimer}
			<Button
				variant="outline"
				size="icon"
				onclick={() => selectTimer(null)}>
				<X />
			</Button>
		{/if}
	</div>
	<div class="flex flex-col items-center justify-center space-y-4">
		<TimerDigits
			startTime={lastTimerInterval?.start_time ?? null}
			endTime={lastTimerInterval?.end_time ?? null}
			isPaused={isPaused} />

		<Button
			size="icon"
			variant="outline"
			onclick={() => toggleTimer()}>
			{#if isPaused}
				<Play />
			{:else}
				<Pause />
			{/if}
		</Button>
	</div>
	<form
		bind:this={createTimerForm}
		onsubmit={async (e) => {
			e.preventDefault();
			const t = dataService.createTimer(createTimerName);
			selectTimer(t);
			createTimerForm?.reset();
		}}
		class="flex items-center space-x-2">
		<Label for="timer-title-input">Timer</Label>
		<Input
			bind:value={createTimerName}
			placeholder="mindfulness" />
	</form>
	{#if dataService.state.timers.length > 0}
		<ul class="flex w-full flex-col items-center justify-center space-y-2">
			{#each dataService.state.timers as timer (timer.id)}
				<li class="w-full">
					<Button
						onclick={() => selectTimer(timer)}
						variant="outline"
						class="w-full">
						{timer.name}
					</Button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
