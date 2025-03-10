<script lang="ts">
	import { Minus, Plus } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	import { formatDueAt } from '$lib/datetime';
	import type { Counter } from '$lib/app-state';
	import { getAppDataService } from '$lib/app-state/data-service.svelte';

	import CounterOptionsDialog from './counter-options-dialog.svelte';

	const { counterService } = getAppDataService();

	type Props = {
		counter: Counter;
	};
	let { counter }: Props = $props();
	let counterStats = $derived(
		counterService.state.countersStats.get(counter.id) || {
			total: 0,
			lastUpdatedAt: 0
		}
	);
	let stepBy = $state(counter.step);
</script>

<li class="relative flex w-full flex-col items-center justify-start rounded-md border">
	<header class="relative w-full py-2 text-center">
		<span class="mb-4 mt-4 text-sm font-medium">{counter.name}</span>
		<CounterOptionsDialog counter={counter} />
	</header>
	<div class="mb-2 flex items-center">
		<Button
			onclick={() => counterService.decreaseCounter(counter, stepBy)}
			variant="outline"
			size="icon"
			class="h-8 w-8 rounded-r-none">
			<Minus class="h-4 w-4" />
			<span class="sr-only">decrease</span>
		</Button>
		<div class="flex h-8 w-16 items-center justify-center border-y">
			<span class="font-mono">{counterStats.total}</span>
		</div>
		<Button
			onclick={() => counterService.increaseCounter(counter, stepBy)}
			variant="outline"
			size="icon"
			class="h-8 w-8 rounded-l-none">
			<Plus class="h-4 w-4" />
			<span class="sr-only">increase</span>
		</Button>
	</div>

	<div class="mb-10">
		{#if counterStats.lastUpdatedAt > 0}
			{formatDueAt(counterStats.lastUpdatedAt)}
		{/if}
	</div>

	<div class="absolute bottom-1 right-1 flex items-center space-x-2">
		<Label
			class="font-extralight capitalize"
			for="counter-{counter.id}-step-by">step&nbsp;by</Label>
		<Input
			onchange={() => counterService.updateCounter({ ...counter, step: stepBy })}
			id="counter-{counter.id}-step-by"
			class="h-8 w-16 text-center font-mono"
			type="number"
			bind:value={stepBy} />
	</div>
</li>
