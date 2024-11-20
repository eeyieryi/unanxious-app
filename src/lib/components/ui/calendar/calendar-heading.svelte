<script lang="ts">
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import { cn } from '$lib/components/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CalendarPrimitive.HeadingProps = $props();
</script>

<CalendarPrimitive.Heading
	bind:ref={ref}
	class={cn('text-sm font-medium', className)}
	{...restProps} />
