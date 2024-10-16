<script lang="ts">
	import type { DHMS } from '$lib/datetime';

	interface Props {
		withDHMS: DHMS;
		days?: boolean;
		hours?: boolean;
		minutes?: boolean;
		seconds?: boolean;
	}
	let { withDHMS, days, hours, minutes, seconds }: Props = $props();
</script>

{#if days}<span>{withDHMS.days}d</span>{/if}
{#if hours}<span>{withDHMS.hours}h</span>{/if}
{#if minutes}<span>{withDHMS.minutes}m</span>{/if}
{#if seconds}<span>{withDHMS.seconds}s</span>{/if}
