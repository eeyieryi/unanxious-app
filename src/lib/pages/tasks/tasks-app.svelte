<script lang="ts">
	import { Plus, ListTodo } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	import { TaskList } from './components';

	import { getAppDataService } from '$lib/app-state/data-service.svelte';

	const { tasksService } = getAppDataService();

	type ListItem = {
		id: string;
		name: string;
	};

	const fixedLists: ListItem[] = [
		{
			id: 'all',
			name: 'all'
		},
		{
			id: 'inbox',
			name: 'inbox'
		}
	];

	let createListForm = $state<HTMLFormElement>();
	let createListFormInputName = $state('');
	function handleSubmitCreateList(event: SubmitEvent) {
		event.preventDefault();
		const list = tasksService.createList({ name: createListFormInputName });
		createListForm?.reset();
		tasksService.state.selectedListID = list.id;
	}
</script>

<svelte:head>
	<title>Unanxious :: Tasks</title>
</svelte:head>

<nav class="flex w-full min-w-[200px] max-w-[200px] flex-col space-y-2 border-r px-2 py-2">
	<header class="flex items-center space-x-2">
		<ListTodo />
		<h1 class="text-lg font-bold leading-none">Tasks</h1>
	</header>

	<Separator />

	{#snippet item({ id, name: title }: ListItem)}
		<Button
			variant="outline"
			onclick={() => {
				tasksService.state.selectedListID = id;
			}}
			class="capitalize">
			<span>{title}</span>
		</Button>
	{/snippet}

	{#each fixedLists as fixedList (fixedList.id)}
		{@render item(fixedList)}
	{/each}

	{#each Array.from(tasksService.state.lists.values()) as { name, id } (id)}
		{@render item({ name, id })}
	{/each}

	<Separator />

	<form
		bind:this={createListForm}
		class="mt-2 flex flex-row space-x-2"
		onsubmit={handleSubmitCreateList}>
		<Input
			name="title"
			bind:value={createListFormInputName}
			placeholder="studies" />
		<Button
			variant="outline"
			size="icon"
			type="submit"><Plus /></Button>
	</form>
</nav>

{#if tasksService.state.selectedListID}
	<TaskList />
{:else}
	<p>Select a list to see its tasks</p>
{/if}
