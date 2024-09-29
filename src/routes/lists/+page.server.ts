import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

import { fetchAPI, isAPIResponseError, type List } from '$lib/api';

export const actions: Actions = {
	default: async ({ fetch, request }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		if (!title) return fail(400, { title, missing: true });

		const apiResponse = await fetchAPI<List>(fetch, '/lists', {
			method: 'POST',
			body: JSON.stringify({
				title: title.toString()
			})
		});
		if (isAPIResponseError(apiResponse)) {
			return fail(apiResponse.res.status, { message: apiResponse.error.message });
		}
		return redirect(303, `/lists/${apiResponse.data.id}`);
	}
};
