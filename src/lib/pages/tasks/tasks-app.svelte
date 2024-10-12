<script lang="ts">
	import { ListTodo, PanelLeftOpen, PanelLeftClose, Plus } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { CustomScrollArea } from '$lib/components/ui/custom-scroll-area';

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

<div class="relative h-full">
	{#if showNav}
		<nav class="absolute flex h-full w-full max-w-full flex-col space-y-2 bg-background px-2 py-2">
			<header class="flex justify-between">
				<div class="flex items-center space-x-2">
					<ListTodo />
					<h1 class="text-lg font-bold leading-none">Task Lists</h1>
				</div>

				{@render toggleListShowBtn()}
			</header>

			<Separator />

			{#snippet item({ id, name: title }: ListItem)}
				<Button
					variant="outline"
					onclick={() => selectList(id)}
					class="capitalize">
					<span>{title}</span>
				</Button>
			{/snippet}

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

			<CustomScrollArea>
				<div class="flex flex-col space-y-2 py-4">
					{#each fixedLists as fixedList (fixedList.id)}
						{@render item(fixedList)}
					{/each}

					{#each Array.from(tasksService.state.lists.values()) as { name, id } (id)}
						{@render item({ name, id })}
					{/each}
				</div>
			</CustomScrollArea>
		</nav>
	{:else}
		<div class="space-x-2 py-2">
			<span class="sr-only">show&nbsp;lists</span>
			{@render toggleListShowBtn()}
		</div>
	{/if}

	{#if tasksService.state.selectedListID}
		<TaskList />
	{:else}
		<p>Select a list to see its tasks</p>
	{/if}
</div>
