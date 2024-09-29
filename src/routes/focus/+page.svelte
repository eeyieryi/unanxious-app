<script lang="ts">
	import { onMount } from 'svelte';

	import { Pause, Play, X } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	import TimerDigits from '$lib/components/TimerDigits.svelte';

	import {
		type TimerInterval,
		type Timer,
		fetchAPI,
		isAPIResponseError,
		logAPIResponseErrorToConsole
	} from '$lib/api';

	let { data } = $props();

	let selectedTimer = $state<Timer | null>(null);
	let lastTimerInterval = $state<TimerInterval | null>(null);
	let isPaused = $derived(!(lastTimerInterval !== null && lastTimerInterval.end_time === null));

	function selectTimer(t: Timer | null) {
		selectedTimer = t;
		getLastTimerInterval();
	}

	async function getLastTimerInterval() {
		const apiResponse = await fetchAPI<TimerInterval>(
			fetch,
			`/timers/intervals/last?timerID=${selectedTimer?.id ?? 'empty'}`
		);
		if (isAPIResponseError(apiResponse)) {
			if (apiResponse.res.status === 404) {
				lastTimerInterval = null;
				return;
			}
			logAPIResponseErrorToConsole(apiResponse);
			// handle error
			return;
		}
		lastTimerInterval = apiResponse.data;
	}

	async function toggleTimer() {
		let timer_id = 'empty';
		if (selectedTimer) {
			timer_id = selectedTimer.id;
		}

		let action = '';
		if (lastTimerInterval && lastTimerInterval.end_time === null) {
			action = 'stop';
		} else {
			action = 'start';
		}

		const apiResponse = await fetchAPI<TimerInterval>(fetch, `/timers/${action}`, {
			method: 'POST',
			body: JSON.stringify({
				timer_id: timer_id
			})
		});
		if (isAPIResponseError(apiResponse)) {
			logAPIResponseErrorToConsole(apiResponse);
			// handle error
			return;
		}
		lastTimerInterval = apiResponse.data;
		return;
	}

	onMount(() => {
		getLastTimerInterval();
	});
</script>

<div class="flex h-screen w-full min-w-[460px] max-w-[460px] flex-col space-y-8 border-r px-2 py-2">
	<div class="flex items-center justify-between">
		<Button variant="outline">
			{#if selectedTimer}
				Timer: {selectedTimer.title}
			{:else}
				<span class="font-lg font-mono uppercase">focus</span>
			{/if}
		</Button>
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
		method="POST"
		action="?/createTimer"
		class="flex items-center space-x-2">
		<Label for="timer-title-input">Timer</Label>
		<Input
			id="timer-title-input"
			name="timer-title" />
	</form>
	{#if data.timers && data.timers.length > 0}
		<ul class="flex w-full flex-col items-center justify-center space-y-2">
			{#each data.timers as timer (timer.id)}
				<li class="w-full">
					<Button
						onclick={() => selectTimer(timer)}
						variant="outline"
						class="w-full">
						{timer.title}
					</Button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
