import {
	type CreateTaskDTO,
	type CreateTimerDTO,
	type List,
	type ListWithTasks,
	type Task,
	type Timer,
	fetchAPI,
	isAPIResponseError,
	logAPIResponseErrorToConsole
} from '$lib/api';

export async function createList(
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
	title: string
): Promise<List | null> {
	const apiResponse = await fetchAPI<List>(fetch, '/lists', {
		method: 'POST',
		body: JSON.stringify({
			title: title.toString()
		})
	});
	if (isAPIResponseError(apiResponse)) {
		logAPIResponseErrorToConsole(apiResponse);
		return null;
	}
	return apiResponse.data;
}

export async function createTask(
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
	title: string,
	listName?: string
): Promise<Task | null> {
	let listId: string | undefined = undefined;
	if (listName !== 'all' && listName !== 'inbox') {
		listId = listName;
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
		logAPIResponseErrorToConsole(apiResponse);
		return null;
	}
	return apiResponse.data;
}

export async function fetchLists(
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
): Promise<List[]> {
	const apiResponse = await fetchAPI<List[]>(fetch, '/lists');
	if (isAPIResponseError(apiResponse)) {
		logAPIResponseErrorToConsole(apiResponse);
		return [];
	}
	return apiResponse.data;
}

export async function fetchListTasks(
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
	listID: string
): Promise<ListWithTasks | null> {
	console.log(listID);
	const apiResponse = await fetchAPI<ListWithTasks>(fetch, `/lists/${listID}/tasks`);
	if (isAPIResponseError(apiResponse)) {
		logAPIResponseErrorToConsole(apiResponse);
		return null;
	}
	return apiResponse.data;
}

export async function fetchTimers(
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
): Promise<Timer[]> {
	const apiResponse = await fetchAPI<Timer[]>(fetch, '/timers');
	if (isAPIResponseError(apiResponse)) {
		logAPIResponseErrorToConsole(apiResponse);
		return [];
	}
	return apiResponse.data;
}

export async function createTimer(
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
	timerTitle: string
): Promise<Timer | null> {
	const apiResponse = await fetchAPI<Timer>(fetch, '/timers', {
		method: 'POST',
		body: JSON.stringify({
			title: timerTitle
		} satisfies CreateTimerDTO)
	});
	if (isAPIResponseError(apiResponse)) {
		logAPIResponseErrorToConsole(apiResponse);
		return null;
	}
	return apiResponse.data;
}
