import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

import type { LayoutServerLoad } from './$types';

import type { ListWithTasks } from '$lib/api';

export const load: LayoutServerLoad = async ({ fetch, params }) => {
	let res: Response | undefined;
	let data = undefined;
	try {
		res = await fetch(`${env.PUBLIC_API_BASE_URL}/lists/${params.name}/tasks`, {
			method: 'GET'
		});
		if (res.headers.get('Content-Type') === 'application/json') {
			data = await res.json();
		}
	} catch (err: unknown) {
		console.error(err);
		return error(500, { message: String(err) });
	}

	if (!res) {
		return error(500, { message: 'something went wrong' });
	}

	if (!res.ok) {
		return error(res.status, { message: String(data) });
	}
	return {
		listWithTasks: data as ListWithTasks
	};
};
