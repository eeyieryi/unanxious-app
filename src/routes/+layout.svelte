<script lang="ts">
	import '../app.css';

	import { page } from '$app/stores';

	import { Plus, ListTodo, Timer } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

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

<div class="flex w-full flex-row">
	<nav class="flex w-full max-w-[29px] flex-col items-center space-y-2 border-r px-0.5 pt-2">
		<a href={$page.url.pathname.startsWith('/lists') ? '#' : '/lists'}>
			<ListTodo class="h-4 w-4" />
		</a>
		<a href="/timer">
			<Timer class="h-4 w-4" />
		</a>
	</nav>

	<nav class="flex min-w-[200px] flex-col border-r px-2 py-2">
		<a
			href="/"
			aria-current={$page.url.pathname === '/'}><span>Home</span></a>
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

		<div class="divider"></div>

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
</div>

<style lang="postcss">
	nav > a {
		@apply no-underline [@media(hover:hover)]:hover:underline;
		&:hover {
			@apply cursor-pointer underline;
		}
	}
	.divider {
		@apply flex flex-row items-center self-stretch;
		&:before,
		&:after {
			@apply h-0.5 w-full flex-grow content-[''];
		}
	}
	[aria-current='true'] {
		@apply text-center underline;
	}
</style>
