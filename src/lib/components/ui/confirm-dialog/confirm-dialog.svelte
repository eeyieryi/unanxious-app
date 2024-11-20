<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Check, X } from 'lucide-svelte';

	import { cn } from '$lib/components/utils';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';

	interface Props {
		trigger: Snippet<[]>;
		title: string;
		message: string;
		onconfirm: () => void;
	}
	let { trigger, title, message, onconfirm }: Props = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger>
		{@render trigger()}
	</Dialog.Trigger>

	<Dialog.Content class="flex max-w-[90%] flex-col items-center rounded-md sm:max-w-[400px]">
		<Dialog.Title>{title}</Dialog.Title>

		<p class="font-light">{message}</p>

		<Dialog.Close
			onclick={onconfirm}
			class={cn(
				buttonVariants({ variant: 'destructive' }),
				'space-x-2 bg-destructive/40 text-destructive-foreground hover:bg-destructive',
				'w-[80%]'
			)}>
			<Check class="h-5 w-5" />
			<div class="grow">
				<span class="capitalize">ok</span>
			</div>
		</Dialog.Close>

		<Dialog.Close class={cn(buttonVariants({ variant: 'outline' }), 'w-[80%]')}>
			<X class="h-5 w-5" />
			<div class="grow">
				<span class="capitalize">cancel</span>
			</div>
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
