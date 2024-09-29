import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

import { fetchAPI, isAPIResponseError, type ListWithTasks } from '$lib/api';

export const load: LayoutServerLoad = async ({ fetch, params }) => {
	const apiResponse = await fetchAPI<ListWithTasks>(fetch, `/lists/${params.name}/tasks`);
	if (isAPIResponseError(apiResponse)) {
		return error(apiResponse.res.status, { message: apiResponse.error.message });
	}
	return {
		listWithTasks: apiResponse.data
	};
};
