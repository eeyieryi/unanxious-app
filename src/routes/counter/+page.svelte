<script lang="ts">
	import { Tally5 } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { CustomScrollArea } from '$lib/components/ui/custom-scroll-area';

	import { CounterItem } from './components';

	import { getAppDataService } from '$lib/app-state';

	const { counterService } = getAppDataService();

	let createCounterInputName = $state('');
	let createCounterInputStep = $state(1);
	function handleSubmitCreateCounter(event: SubmitEvent) {
		event.preventDefault();
		counterService.createCounter(createCounterInputName, createCounterInputStep);
		createCounterInputName = '';
		createCounterInputStep = 1;
	}

	let countersToShow = $derived(Array.from(counterService.state.counters.values()));
</script>

<svelte:head>
	<title>Unanxious :: Counter</title>
</svelte:head>

<div class="mb-6 flex max-w-full flex-col space-y-6">
	<header class="mx-4 mt-2 flex items-center space-x-2">
		<Tally5 />
		<h1 class="text-lg font-bold leading-none">Counter</h1>
	</header>

	<form
		class="mx-4 flex flex-col justify-center space-y-2 rounded-md border p-6"
		onsubmit={handleSubmitCreateCounter}>
		<div>
			<Label
				class="capitalize"
				for="create-counter-input-name">name</Label>
			<Input
				type="text"
				bind:value={createCounterInputName}
				id="create-counter-input-name" />
		</div>
		<div>
			<Label
				class="capitalize"
				for="create-counter-input-step"
				><span class="uppercase">preset</span>&nbsp;step&nbsp;by</Label>
			<Input
				type="number"
				bind:value={createCounterInputStep}
				min="1" />
		</div>
		<Button
			variant="secondary"
			class="capitalize"
			type="submit">create&nbsp;counter</Button>
	</form>
</div>

<CustomScrollArea>
	{#if countersToShow.length > 0}
		<ul class="flex flex-col items-center justify-center space-y-4">
			{#each countersToShow as counter (counter.id)}
				<CounterItem counter={counter} />
			{/each}
		</ul>
	{:else}
		<p class="uppercase">no counters</p>
	{/if}
</CustomScrollArea>
