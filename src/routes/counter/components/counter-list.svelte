<script lang="ts">
	import type { Counter } from '$lib/app-state';

	import CounterItem from './counter-item.svelte';

	interface Props {
		counters: Counter[];
	}
	let { counters }: Props = $props();
</script>

{#if counters.length > 0}
	<ul class="flex flex-col items-center justify-center space-y-4">
		{#each counters as counter (counter.id)}
			<CounterItem counter={counter} />
		{/each}
	</ul>
{:else}
	<p class="uppercase">no counters</p>
{/if}
