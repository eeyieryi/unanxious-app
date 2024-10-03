import moment from 'moment';

export function formatDueAt(seconds: number): string {
	return moment().to(getDateTimeFromUnixEpoch(seconds));
}

export function millisecondsToSeconds(ms: number) {
	return ms / 1000.0;
}

export function secondsToMilliseconds(s: number) {
	return s * 1000.0;
}

export function getDateTimeFromUnixEpoch(unixepoch: number) {
	return new Date(secondsToMilliseconds(unixepoch));
}

export function getUnixEpochFromNow(): number {
	return millisecondsToSeconds(new Date().getTime());
}

export type DHMS = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

export function dhms(seconds: number): DHMS {
	return {
		days: Math.floor(seconds / 86400),
		hours: Math.floor(seconds / 3600) % 24,
		minutes: Math.floor((seconds % 3600) / 60),
		seconds: Math.floor((seconds % 3600) % 60)
	};
}

export function padWithZero(n: number) {
	if (n < 0) {
		n = 0;
	}
	return n.toString().padStart(2, '0');
}
