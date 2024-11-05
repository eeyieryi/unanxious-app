<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	import { getAppDataService } from '$lib/app-state';

	const { counterService } = getAppDataService();

	let createCounterInputName = $state('');
	let createCounterInputStep = $state(1);
	function handleSubmitCreateCounter(event: SubmitEvent) {
		event.preventDefault();
		counterService.createCounter(createCounterInputName, createCounterInputStep);
		createCounterInputName = '';
		createCounterInputStep = 1;
	}
</script>

<form
	class="mx-4 flex flex-col justify-center space-y-2 rounded-md border p-6"
	onsubmit={handleSubmitCreateCounter}>
	<div>
		<Label
			class="capitalize"
			for="create-counter-input-name">name</Label>
		<Input
			type="text"
			bind:value={createCounterInputName}
			id="create-counter-input-name" />
	</div>
	<div>
		<Label
			class="capitalize"
			for="create-counter-input-step"
			><span class="uppercase">preset</span>&nbsp;step&nbsp;by</Label>
		<Input
			type="number"
			bind:value={createCounterInputStep}
			min="1" />
	</div>
	<Button
		variant="secondary"
		class="capitalize"
		type="submit">create&nbsp;counter</Button>
</form>
