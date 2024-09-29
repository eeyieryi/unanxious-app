import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

import { fetchAPI, isAPIResponseError, type CreateTaskDTO, type Task } from '$lib/api';

export const actions: Actions = {
	createTask: async ({ request, fetch, params }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		if (!title) return fail(400, { title, missing: true });

		let listId: string | undefined = undefined;
		if (params.name !== 'all' && params.name !== 'inbox') {
			listId = params.name;
		}

		const apiResponse = await fetchAPI<Task>(fetch, '/tasks', {
			method: 'POST',
			body: JSON.stringify({
				title: title.toString(),
				description: undefined,
				list_id: listId
			} satisfies CreateTaskDTO)
		});
		if (isAPIResponseError(apiResponse)) {
			return fail(apiResponse.res.status, { message: apiResponse.error.message });
		}
		return apiResponse.data;
	}
};
