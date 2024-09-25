<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import { Plus } from 'lucide-svelte';

	async function toggleTaskCompleted(id: string) {
		let res: Response | undefined = undefined;
		let data = undefined;
		try {
			res = await fetch(`${env.PUBLIC_API_BASE_URL}/tasks/${id}/toggle-completed`, {
				method: 'PATCH'
			});
			if (res.headers.get('Content-Type') === 'application/json') {
				data = await res.json();
			}
		} catch (err: unknown) {
			console.error(err);
		}
		console.log(data);
		if (!res) {
			console.error('something went wrong!');
			return;
		}
		if (!res.ok) {
			console.error(data);
			return;
		}
	}

	let { data, children } = $props();
</script>

<div class="min-w-[500px] max-w-[500px] border-r px-4">
	<form class="flex flex-col" method="POST" action="/?/createTask">
		<label class="label">
			<span class="label-text mr-2 uppercase">task</span>
			<input
				class="input input-sm input-bordered"
				type="text"
				name="title"
				placeholder="organize room"
			/>
			<button class="btn btn-square btn-ghost btn-sm ml-2" type="submit">
				<Plus />
			</button>
		</label>
	</form>
	<ul>
		{#each data.tasks as t (t.id)}
			<li class="w-full">
				<input
					class="checkbox checkbox-xs"
					onchange={() => toggleTaskCompleted(t.id)}
					type="checkbox"
					checked={t.completed}
				/>
				<a href="/lists/{$page.params.name}/tasks/{t.id}">
					<span>{t.title}</span>
				</a>
			</li>
		{/each}
	</ul>
</div>

<div>
	{@render children()}
</div>
