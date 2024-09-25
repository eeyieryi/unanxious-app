<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

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

	let { children } = $props();
</script>

<div class="flex w-full flex-row">
	<nav class="flex min-w-[150px] flex-col border-r px-2 py-2">
		<a href="/" aria-current={$page.url.pathname === '/'}><span>Home</span></a>
		{#snippet item({ title, href }: PremadeListItem)}
			<a class="capitalize" aria-current={$page.url.pathname.includes(href)} {href}
				><span>{title}</span></a
			>
		{/snippet}

		{#each premadeLists as premadeItem}
			{@render item(premadeItem)}
		{/each}
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
