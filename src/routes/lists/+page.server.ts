import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { env } from '$env/dynamic/public';

export const actions: Actions = {
	default: async ({ fetch, request }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		if (!title) return fail(400, { title, missing: true });

		const res = await fetch(`${env.PUBLIC_API_BASE_URL}/lists`, {
			method: 'POST',
			body: JSON.stringify({
				title
			})
		});
		if (res.ok) {
			return await res.json();
		}
		return fail(500, { message: res.statusText });
	}
};
