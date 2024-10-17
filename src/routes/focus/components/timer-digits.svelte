<script lang="ts">
	import { dhms, getUnixEpochFromNow, padWithZero } from '$lib/datetime';

	type Props = {
		isPaused: boolean;
		startTime: number | null;
		endTime: number | null;
	};
	let { isPaused, startTime, endTime }: Props = $props();

	let now = $state<number>(getUnixEpochFromNow());

	let totalSeconds = $derived.by(() => {
		if (isPaused || endTime) {
			if (startTime && endTime) {
				return endTime - startTime;
			}
			return 0;
		}
		if (startTime) return now - startTime;
		return 0;
	});

	let time = $derived(dhms(totalSeconds));

	function initTimer(): number {
		return setInterval(() => {
			now = getUnixEpochFromNow();
		}, 1000) as unknown as number;
	}

	$effect(() => {
		const intervalID = initTimer();
		return () => {
			clearInterval(intervalID);
		};
	});
</script>

<div class="flex items-center space-x-1 font-mono">
	{#snippet digits(n: number)}
		<span class="text-4xl font-medium">{padWithZero(n)}</span>
	{/snippet}
	{#snippet divider()}
		<span class="text-3xl font-medium">:</span>
	{/snippet}
	{#if time.hours > 0}
		{@render digits(time.hours)}
		{@render divider()}
	{/if}
	{@render digits(time.minutes)}
	{@render divider()}
	{@render digits(time.seconds)}
</div>
