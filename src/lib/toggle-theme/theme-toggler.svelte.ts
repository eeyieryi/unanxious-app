import { onMount } from 'svelte';
import { withoutTransition } from './without-transition';

export class ThemeToggler {
	readonly storageKey = 'theme';

	constructor() {
		onMount(() => {
			const found = localStorage.getItem(this.storageKey);
			if (!found) return;

			if (document.documentElement.classList.contains('dark')) {
				// Dark Mode
				if (found === 'dark') return;
				if (found === 'light') this.toggleTheme();
			} else {
				// Light Mode
				if (found === 'light') return;
				if (found === 'dark') this.toggleTheme();
			}
		});
	}

	toggleTheme() {
		if (document.documentElement.classList.contains('dark')) {
			localStorage.setItem(this.storageKey, 'light');
		} else {
			localStorage.setItem(this.storageKey, 'dark');
		}
		withoutTransition(() => {
			document.documentElement.classList.toggle('dark');
		});
	}
}
