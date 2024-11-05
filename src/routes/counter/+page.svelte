<script lang="ts">
	import { Tally5 } from 'lucide-svelte';

	import { CustomScrollArea } from '$lib/components/ui/custom-scroll-area';

	import { CounterCreate, CounterList } from './components';
	import { getAppDataService } from '$lib/app-state';

	const { counterService } = getAppDataService();

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

	<CounterCreate />
</div>

<CustomScrollArea>
	<CounterList counters={countersToShow} />
</CustomScrollArea>
