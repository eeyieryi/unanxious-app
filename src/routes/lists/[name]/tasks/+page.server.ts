/* eslint-disable @typescript-eslint/no-unused-vars */
import { env } from '$env/dynamic/public';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { CreateTaskDTO, Task } from '$lib/api';

export const actions: Actions = {
	createTask: async ({ request, fetch, url }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		if (!title) {
			return fail(400, { title, missing: true });
		}
		let res: Response | undefined = undefined;
		let data = undefined;
		try {
			res = await fetch(`${env.PUBLIC_API_BASE_URL}/tasks`, {
				method: 'POST',
				body: JSON.stringify({
					title
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
