<script lang="ts">
	import { ListTodo, PanelLeftOpen, PanelLeftClose, Plus } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { CustomScrollArea } from '$lib/components/ui/custom-scroll-area';

	import { TaskList } from './components';

	import { getAppDataService } from '$lib/app-state/data-service.svelte';

	const { tasksService, uiPrefsService } = getAppDataService();

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
		},
		{
			id: 'due',
			name: 'due'
		},
		{
			id: 'today',
			name: 'today'
		},
		{
			id: 'tomorrow',
			name: 'tomorrow'
		},
		{
			id: 'next-seven-days',
			name: 'Next 7 Days'
		},
		{
			id: 'this-month',
			name: 'This Month'
		}
	];

	let filteredLists = $derived<ListItem[]>(
		fixedLists.filter((li) => {
			if (li.id === 'all') {
				return uiPrefsService.state.showListAll;
			}
			return true;
		})
	);

	let createListForm = $state<HTMLFormElement>();
	let createListFormInputName = $state('');
	function handleSubmitCreateList(event: SubmitEvent) {
		event.preventDefault();
		const list = tasksService.createList({ name: createListFormInputName });
		createListForm?.reset();
		tasksService.state.selectedListID = list.id;
	}

	let showNav = $state(false);

	function selectList(id: string) {
		tasksService.state.selectedListID = id;
		showNav = false;
	}
</script>

<svelte:head>
	<title>Unanxious :: Tasks</title>
</svelte:head>

{#snippet toggleListShowBtn()}
	<Button
		class="w-[140px] max-w-[140px] justify-between"
		onclick={() => (showNav = !showNav)}
		variant="outline">
		{#if showNav}
			<span class="mr-2 capitalize">hide&nbsp;lists</span>
			<PanelLeftClose />
		{:else}
			<span class="mr-2 capitalize">show&nbsp;lists</span>
			<PanelLeftOpen />
		{/if}
	</Button>
{/snippet}

<div class="relative flex h-full flex-col">
	{#if showNav}
		<nav class="flex h-full w-full max-w-full flex-col space-y-4 bg-background">
			<header class="flex justify-between">
				{@render toggleListShowBtn()}
				<div class="flex items-center space-x-2">
					<h1 class="text-lg font-bold leading-none">Lists</h1>
					<ListTodo />
				</div>
			</header>

			<Separator />

			{#snippet item({ id, name }: ListItem)}
				<Button
					variant="outline"
					onclick={() => selectList(id)}
					class="capitalize">
					<span>{name}</span>
				</Button>
			{/snippet}

			<form
				bind:this={createListForm}
				class="mt-2 flex flex-row space-x-2 px-2"
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

			<CustomScrollArea>
				<div class="flex flex-col space-y-2">
					{#each filteredLists as fixedList (fixedList.id)}
						{@render item(fixedList)}
					{/each}

					{#each Array.from(tasksService.state.lists.values()) as list (list.id)}
						{@render item({ id: list.id, name: list.name })}
					{/each}
				</div>
			</CustomScrollArea>
		</nav>
	{:else if tasksService.state.selectedListID}
		<TaskList toggleListShowBtn={toggleListShowBtn} />
	{:else}
		<p>Select a list to see its tasks</p>
	{/if}
</div>
