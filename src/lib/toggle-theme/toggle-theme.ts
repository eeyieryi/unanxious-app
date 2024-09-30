import { withoutTransition } from './without-transition';

export const toggleTheme = () => {
	withoutTransition(() => {
		document.documentElement.classList.toggle('dark');
	});
};
