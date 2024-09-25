<script lang="ts">
	import { page } from '$app/stores';
	import TaskCheckbox from '$lib/components/TaskCheckbox.svelte';
	import { tasksStore } from '$lib/tasks.store.js';
	import { Plus } from 'lucide-svelte';

	let { data, children } = $props();

	$effect(() => {
		if (data.tasks) {
			tasksStore.set(data.tasks);
		}
	});
</script>

<div class="min-w-[500px] max-w-[500px] border-r px-4">
	<form class="flex flex-col" method="POST" action="/?/createTask">
		<label class="label">
			<span class="label-text mr-2 uppercase">task</span>
			<input
				class="input input-sm input-bordered"
				type="text"
				name="title"
				placeholder="organize room"
			/>
			<button class="btn btn-square btn-ghost btn-sm ml-2" type="submit">
				<Plus />
			</button>
		</label>
	</form>
	<ul>
		{#if $tasksStore}
			{#each $tasksStore as t (t.id)}
				<li class="w-full">
					<TaskCheckbox {t} />
					<a href="/lists/{$page.params.name}/tasks/{t.id}">
						<span>{t.title.length > 0 ? t.title : 'No title'}</span>
					</a>
				</li>
			{/each}
		{/if}
	</ul>
</div>

<div>
	{@render children()}
</div>
