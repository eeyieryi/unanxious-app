<script lang="ts">
	import { Circle } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { CustomScrollArea } from '$lib/components/ui/custom-scroll-area';
</script>

{#snippet separator()}
	<Separator class="bg-muted-foreground" />
{/snippet}

<div class="flex grow flex-col overflow-hidden rounded-md bg-muted py-4">
	<CustomScrollArea>
		<header class="mb-2 flex items-center space-x-2 text-2xl font-medium">
			<Circle />
			<span>Unanxious</span>
		</header>

		<div class="mb-4 space-y-1 text-base">
			<p>Free your memory slots from events that are not to be done at the moment.</p>
			<p>Keep it away from now, and bring it closer when it's time to do so.</p>
		</div>

		{@render separator()}

		<div class="my-4 text-center">
			<p>This app is under active development</p>
			<p>Breaking changes are expected</p>
		</div>

		{@render separator()}

		<div class="my-2 flex flex-col">
			<Button
				href="https://github.com/eeyieryi/unanxious-app/blob/master/LICENSE"
				target="_blank"
				referrerpolicy="no-referrer"
				size="lg"
				variant="link">
				License
			</Button>
			<Button
				href="https://github.com/eeyieryi/unanxious-app"
				target="_blank"
				referrerpolicy="no-referrer"
				size="lg"
				variant="link">
				Source Code
			</Button>
		</div>

		{@render separator()}
	</CustomScrollArea>
</div>
