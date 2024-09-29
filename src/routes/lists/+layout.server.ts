import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

import { fetchAPI, isAPIResponseError, type List } from '$lib/api';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const apiResponse = await fetchAPI<List[]>(fetch, '/lists');
	if (isAPIResponseError(apiResponse)) {
		return error(apiResponse.res.status, { message: apiResponse.error.message });
	}
	return {
		lists: apiResponse.data
	};
};
