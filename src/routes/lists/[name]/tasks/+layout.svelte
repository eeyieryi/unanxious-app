<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { Plus } from 'lucide-svelte';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	import TaskCheckbox from '$lib/components/TaskCheckbox.svelte';

	import type { Task } from '$lib/api';
	import { listsStore, tasksStore } from '$lib/tasks.store.js';

	let { data, children } = $props();

	$effect(() => {
		listsStore.set(data.lists);
		tasksStore.init(data.listWithTasks.list_tasks);
	});

	let filteredTasks = $derived(
		$tasksStore.filter((task) => {
			const listName = $page.params.name;
			if (listName === 'all') {
				return true;
			}
			if (listName === 'inbox') {
				return task.list_id === null;
			}
			return task.list_id === listName;
		})
	);
</script>

<div class="min-w-[500px] max-w-[500px] space-y-4 border-r px-4 pt-4">
	<form
		class="flex flex-col"
		method="POST"
		action="/lists/{$page.params.name}/tasks?/createTask"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					const tu = result.data as Task;
					tasksStore.addTask(tu);
					let listID = 'inbox';
					if (tu.list_id) {
						if (tu.list_id) {
							listID = tu.list_id;
						}
					}
					await goto(`/lists/${listID}/tasks/${tu.id}`);
				} else {
					await applyAction(result);
				}
			};
		}}>
		<div class="flex flex-row items-center space-x-2">
			<Label for="create-task-title-input">
				<span class="uppercase">task</span>
			</Label>
			<Input
				id="create-task-title-input"
				type="text"
				name="title"
				placeholder="organize room" />
			<Button
				variant="outline"
				size="icon"
				type="submit">
				<Plus />
			</Button>
		</div>
	</form>
	{#if filteredTasks.length > 0}
		<ul>
			{#each filteredTasks as t (t.id)}
				<li class="flex w-full items-center space-x-2">
					<TaskCheckbox t={t} />
					<a href="/lists/{$page.params.name}/tasks/{t.id}">
						<span>{t.title.length > 0 ? t.title : 'No title'}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<div>
	{@render children()}
</div>
