<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, ListTodo } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	import TaskList from '$lib/components/TaskList.svelte';

	import { getAppState } from '$lib/app-state.svelte';
	import { createList, fetchLists } from '$lib/api-legacy';

	const appState = getAppState();

	type PremadeListItem = {
		id: string;
		title: string;
	};
	const premadeLists: PremadeListItem[] = [
		{
			id: 'all',
			title: 'all'
		},
		{
			id: 'inbox',
			title: 'inbox'
		}
	];

	let createTaskForm = $state<HTMLFormElement>();
	let createTaskFormTitleInput = $state('');
	let selectedList = $state('inbox');

	onMount(async () => {
		appState.lists = await fetchLists(fetch);
	});
</script>

<nav class="flex w-full min-w-[200px] max-w-[200px] flex-col space-y-2 border-r px-2 py-2">
	<header class="flex items-center space-x-2">
		<ListTodo />
		<h1 class="text-lg font-bold leading-none">Tasks</h1>
	</header>

	<Separator />

	{#snippet item({ id, title }: PremadeListItem)}
		<Button
			variant="outline"
			onclick={() => {
				selectedList = id;
			}}
			class="capitalize">
			<span>{title}</span>
		</Button>
	{/snippet}

	{#each premadeLists as premadeItem}
		{@render item(premadeItem)}
	{/each}

	{#if appState}
		{#each appState.lists as l}
			{@render item({ title: l.title, id: l.id })}
		{/each}
	{/if}

	<Separator />

	<form
		bind:this={createTaskForm}
		class="mt-2 flex flex-row space-x-2"
		onsubmit={async (e) => {
			e.preventDefault();
			const list = await createList(fetch, createTaskFormTitleInput);
			if (list) {
				appState.lists = [...appState.lists, list];
				selectedList = list.id;
				createTaskForm?.reset();
			}
		}}>
		<Input
			name="title"
			bind:value={createTaskFormTitleInput}
			placeholder="studies" />
		<Button
			variant="outline"
			size="icon"
			type="submit"><Plus /></Button>
	</form>
</nav>

{#if selectedList}
	<TaskList listID={selectedList} />
{:else}
	<div class="p-4">
		<h1>Select a list on the left</h1>
	</div>
{/if}
