import { onMount } from 'svelte';
import { withoutTransition } from './without-transition';

export class ThemeToggler {
	readonly storageKey = 'theme';

	constructor() {
		onMount(() => {
			const found = localStorage.getItem(this.storageKey);
			if (!found) return;

			if (found === 'dark') {
				if (document.documentElement.classList.contains('dark')) {
					return;
				} else {
					this.toggleTheme();
				}
			}

			if (found === 'light') {
				if (document.documentElement.classList.contains('dark')) {
					this.toggleTheme();
				} else {
					return;
				}
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
