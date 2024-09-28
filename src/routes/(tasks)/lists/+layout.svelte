<script lang="ts">
	import { page } from '$app/stores';

	import { Plus, ListTodo } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	type PremadeListItem = {
		href: string;
		title: string;
	};

	const premadeLists: PremadeListItem[] = [
		{
			href: '/lists/all',
			title: 'all'
		},
		{
			href: '/lists/inbox',
			title: 'inbox'
		}
	];

	let { data, children } = $props();
</script>

<nav class="flex min-w-[200px] flex-col space-y-2 border-r px-2 py-2">
	<header class="flex items-center space-x-2">
		<ListTodo />
		<h1 class="text-lg font-bold leading-none">Tasks</h1>
	</header>

	<Separator />

	{#snippet item({ title, href }: PremadeListItem)}
		<a
			class="capitalize"
			aria-current={$page.url.pathname.includes(href)}
			href={href}>
			<span>{title}</span>
		</a>
	{/snippet}

	{#each premadeLists as premadeItem}
		{@render item(premadeItem)}
	{/each}

	{#each data.lists as l}
		{@render item({ title: l.title, href: `/lists/${l.id}` })}
	{/each}

	<Separator />

	<form
		class="mt-2 flex flex-row space-x-2"
		action="/lists"
		method="post">
		<Input name="title" />
		<Button
			variant="outline"
			size="icon"
			type="submit"><Plus /></Button>
	</form>
</nav>

{@render children()}

<style lang="postcss">
	nav > a {
		@apply no-underline [@media(hover:hover)]:hover:underline;
		&:hover {
			@apply cursor-pointer underline;
		}
	}
	[aria-current='true'] {
		@apply text-center underline;
	}
</style>
