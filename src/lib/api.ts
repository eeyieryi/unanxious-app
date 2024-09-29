import { env } from '$env/dynamic/public';

export type Task = {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	due_at: number | null; // Unix epoch
	list_id: string | null;
};

export type List = {
	id: string;
	title: string;
};

export type ListWithTasks = {
	list: List;
	list_tasks: Task[];
};

export type CreateTaskDTO = {
	title: string;
	description: string | undefined;
	list_id: string | undefined;
};

export type UpdateTaskDueAtDTO = {
	due_at: number | undefined;
};

export type APIError = {
	error: string;
};

export type Timer = {
	id: string;
	title: string;
	task_id: string | null;
};

export type TimerInterval = {
	id: string;

	timer_id: string | null;
	task_id: string | null;

	start_time: number; // unixepoch
	end_time: number | null; // unixepoch
};

export type CreateTimerDTO = {
	title?: string | undefined;
	task_id?: string | undefined;
};

export type APIResponse<T> = APIResponseSuccess<T> | APIResponseError;
export type APIResponseSuccess<T> = {
	res: Response;
	data: T;
};
export type APIResponseError = {
	res: Response;
	error: Error;
};
export async function handleAPIResponse<T>(response: Response): Promise<APIResponseSuccess<T>> {
	if (response.ok) {
		try {
			// Try to read body
			const clone = response.clone();
			const contentType = clone.headers.get('content-type');
			if (contentType && contentType === 'application/json') {
				const data = (await clone.json()) as T;
				return Promise.resolve({
					res: response,
					data: data
				} as APIResponseSuccess<T>);
			} else {
				return Promise.reject({
					res: response,
					error: new Error(`content-type is not json, got: ${contentType}`)
				} as APIResponseError);
			}
		} catch {
			return Promise.reject({
				res: response,
				error: new Error(`could not parse response '${await response.clone().text()}' as json`)
			} as APIResponseError);
		}
	} else {
		// Try to extract APIError from response
		try {
			const clone = response.clone();
			const apiError = (await clone.json()) as APIError;
			return Promise.reject({
				res: response,
				error: new Error(apiError.error)
			} as APIResponseError);
		} catch {
			return Promise.reject({
				res: response,
				error: new Error(response.statusText)
			} as APIResponseError);
		}
	}
}

export async function fetchAPI<T>(
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
	path: string,
	init?: RequestInit
): Promise<APIResponse<T>> {
	let data: APIResponseSuccess<T> | APIResponseError;
	await fetch(`${env.PUBLIC_API_BASE_URL}${path}`, init)
		.then((res) => handleAPIResponse<T>(res))
		.then((apiResponse) => {
			data = apiResponse;
		})
		.catch((apiResponseError: APIResponseError) => {
			data = apiResponseError;
		});
	return data!;
}

export function isAPIResponseError<T>(
	apiResponse: APIResponse<T>
): apiResponse is APIResponseError {
	return apiResponse && !apiResponse.res.ok && 'error' in apiResponse;
}

export function isAPIResponseSuccess<T>(
	apiResponse: APIResponse<T>
): apiResponse is APIResponseSuccess<T> {
	return apiResponse && !isAPIResponseError(apiResponse);
}

export function logAPIResponseErrorToConsole(apiResponseError: APIResponseError) {
	console.error(apiResponseError.res.status, apiResponseError.error.message);
}
