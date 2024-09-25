<script lang="ts">
	import { page } from '$app/stores';

	let { data } = $props();

	let task = $derived(data.tasks.find((t) => t.id === $page.params.id));
</script>

<div class="p-4">
	{#if task}
		{JSON.stringify(task)}
	{/if}
</div>
