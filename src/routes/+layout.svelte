<script lang="ts">
	import '../app.css';

	import { page } from '$app/stores';

	import { ListTodo, Timer } from 'lucide-svelte';

	let { children } = $props();
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
	{@render children()}
</div>
