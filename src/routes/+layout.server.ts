import { env } from '$env/dynamic/public';

import type { LayoutServerLoad } from './$types';

import type { List } from '$lib/api';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const res = await fetch(`${env.PUBLIC_API_BASE_URL}/lists`);
	const data = (await res.json()) as List[];
	return {
		lists: data
	};
};
