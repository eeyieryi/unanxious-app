<script lang="ts">
	import { Tally5 } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	import CounterItem from '$lib/components/CounterItem.svelte';

	import { getAppDataService } from '$lib/data-service.svelte';

	const dataService = getAppDataService();

	let createCounterInputName = $state('');
	let createCounterInputStep = $state(1);
	function handleSubmitCreateCounter(event: SubmitEvent) {
		event.preventDefault();
		dataService.createCounter(createCounterInputName, createCounterInputStep);
		createCounterInputName = '';
		createCounterInputStep = 1;
	}
</script>

<svelte:head>
	<title>Unanxious :: Counter</title>
</svelte:head>

<div class="flex h-screen w-full min-w-[460px] max-w-[460px] flex-col space-y-8 border-r px-2 py-2">
	<header class="flex items-center space-x-2">
		<Tally5 />
		<h1 class="text-lg font-bold leading-none">Counter</h1>
	</header>
	<form
		class="flex flex-col justify-center space-y-2 rounded-md border p-2"
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

	<ScrollArea>
		{#if dataService.state.counters.length > 0}
			<ul class="space-y-2">
				{#each dataService.state.counters as counter (counter.id)}
					<CounterItem counter={counter} />
				{/each}
			</ul>
		{:else}
			<p class="uppercase">no counters</p>
		{/if}
	</ScrollArea>
</div>
