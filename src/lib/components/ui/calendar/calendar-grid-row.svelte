<script lang="ts">
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import { cn } from '$lib/components/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CalendarPrimitive.GridRowProps = $props();
</script>

<CalendarPrimitive.GridRow
	bind:ref={ref}
	class={cn('flex', className)}
	{...restProps} />
