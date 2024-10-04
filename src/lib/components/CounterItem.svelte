<script lang="ts">
	import { Plus, Minus } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	import { type Counter, getAppDataService } from '$lib/data-service.svelte';

	const dataService = getAppDataService();

	type Props = {
		counter: Counter;
	};
	let { counter }: Props = $props();
	let counterStats = $derived(dataService.state.countersStats.get(counter.id) || { total: 0 });
	let stepBy = $state(counter.step);
</script>

<li class="relative flex flex-col items-center rounded-md border py-4">
	<div>
		<span class="text-sm font-medium">{counter.name}</span>
	</div>
	<div class="mt-2 flex items-center">
		<Button
			onclick={() => dataService.decreaseCounter(counter, stepBy)}
			variant="outline"
			size="icon"
			class="h-8 w-8 rounded-r-none">
			<Minus class="h-4 w-4" />
			<span class="sr-only">decrease</span>
		</Button>
		<div class="flex h-8 w-8 items-center justify-center border-y">
			<span class="font-mono">{counterStats.total}</span>
		</div>
		<Button
			onclick={() => dataService.increaseCounter(counter, stepBy)}
			variant="outline"
			size="icon"
			class="h-8 w-8 rounded-l-none">
			<Plus class="h-4 w-4" />
			<span class="sr-only">increase</span>
		</Button>
	</div>

	<div class="absolute bottom-1 right-1 flex items-center space-x-2">
		<Label for="counter-{counter.id}-step-by">Step by</Label>
		<Input
			id="counter-{counter.id}-step-by"
			class="h-8 w-16 text-center font-mono"
			type="number"
			bind:value={stepBy} />
	</div>
</li>
