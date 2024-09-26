<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { Plus } from 'lucide-svelte';

	type PremadeListItem = {
		href: string;
		title: string;
	};

	const premadeLists: PremadeListItem[] = [
		{
			href: '/lists/all',
			title: 'all'
		}
	];

	let { data, children } = $props();
</script>

<div class="flex w-full flex-row">
	<nav class="flex min-w-[200px] flex-col border-r px-2 py-2">
		<a href="/" aria-current={$page.url.pathname === '/'}><span>Home</span></a>
		{#snippet item({ title, href }: PremadeListItem)}
			<a class="capitalize" aria-current={$page.url.pathname.includes(href)} {href}
				><span>{title}</span></a
			>
		{/snippet}

		{#each premadeLists as premadeItem}
			{@render item(premadeItem)}
		{/each}

		{#each data.lists as l}
			{@render item({ title: l.title, href: `/lists/${l.id}` })}
		{/each}

		<div class="divider"></div>

		<form class="flex flex-row" action="/lists" method="post">
			<input class="input input-xs input-bordered" name="title" />
			<button class="btn btn-outline btn-xs ml-2" type="submit"><Plus class="h-4 w-4" /></button>
		</form>
	</nav>

	{@render children()}
</div>

<style lang="postcss">
	nav > a {
		@apply link-hover;
	}
	[aria-current='true'] {
		@apply text-center underline;
	}
</style>
