import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

import type { Actions } from './$types';

import type { CreateTaskDTO, Task } from '$lib/api';

export const actions: Actions = {
	createTask: async ({ request, fetch, params }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		if (!title) {
			return fail(400, { title, missing: true });
		}
		let res: Response | undefined = undefined;
		let data = undefined;
		try {
			let listId: string | undefined = undefined;
			if (params.name !== 'all' && params.name !== 'inbox') {
				listId = params.name;
			}

			res = await fetch(`${env.PUBLIC_API_BASE_URL}/tasks`, {
				method: 'POST',
				body: JSON.stringify({
					title,
					list_id: listId
				} as CreateTaskDTO)
			});
			if (res.headers.has('Content-Type')) {
				if (res.headers.get('Content-Type') === 'application/json') {
					data = await res.json();
				}
			}
		} catch (err: unknown) {
			console.error(err);
		}
		if (!res) {
			return fail(500, { error: 'something went wrong' });
		}
		if (!res.ok) {
			return fail(res.status, { error: String(data) });
		}

		return data as Task;
	}
};
