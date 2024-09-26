import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';
import type { Config as DaisyConfig } from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [daisyui],
	daisyui: {
		logs: false
	} as DaisyConfig
} as Config;
