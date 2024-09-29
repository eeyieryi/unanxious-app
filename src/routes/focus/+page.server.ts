import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { fetchAPI, isAPIResponseError, type CreateTimerDTO, type Timer } from '$lib/api';

export const load: PageServerLoad = async ({ fetch }) => {
	const apiResponse = await fetchAPI<Timer[]>(fetch, '/timers');
	if (isAPIResponseError(apiResponse)) {
		return error(apiResponse.res.status, apiResponse.error.message);
	}
	return {
		timers: apiResponse.data
	};
};

export const actions: Actions = {
	createTimer: async ({ request, fetch }) => {
		const formData = await request.formData();
		const timerTitle = formData.get('timer-title')?.toString();
		if (!timerTitle) {
			return fail(400);
		}
		const apiResponse = await fetchAPI(fetch, '/timers', {
			method: 'POST',
			body: JSON.stringify({
				title: timerTitle
			} satisfies CreateTimerDTO)
		});
		if (isAPIResponseError(apiResponse)) {
			return fail(apiResponse.res.status, { error: apiResponse.error.message });
		}
		return { success: true };
	}
};
