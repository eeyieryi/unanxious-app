import type { Timer } from '../models';

export function isTimerArchived(timer: Timer) {
	if (timer.archived !== undefined) {
		return timer.archived;
	}
	return false;
}

export function isTimerNotArchived(timer: Timer) {
	return !isTimerArchived(timer);
}
