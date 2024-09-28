import moment from 'moment';

export function formatDueAt(seconds: number): string {
	return moment().to(new Date(seconds * 1000));
}
