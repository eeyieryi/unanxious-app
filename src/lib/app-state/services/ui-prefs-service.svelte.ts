import { onMount } from 'svelte';

interface UIPreferences {
	showCompletedTasks: boolean;
	showListAll: boolean;
}

function isValidUIPreferences(data: unknown): data is UIPreferences {
	return typeof data === 'object' && data !== null && 'showCompletedTasks' in data;
}

class UIState {
	public showCompletedTasks = $state(false);
	public showListAll = $state(false);

	constructor() {}

	private setState(prefs: UIPreferences) {
		this.showCompletedTasks = prefs.showCompletedTasks;
	}

	public fromJSON(): string {
		return JSON.stringify({
			showCompletedTasks: this.showCompletedTasks,
			showListAll: this.showListAll
		} satisfies UIPreferences);
	}

	public initFrom(data: string): void {
		try {
			const jsonData = JSON.parse(data);
			if (!isValidUIPreferences(jsonData)) {
				throw new Error('invalid ui preferences');
			}
			this.setState(jsonData);
		} catch (error1) {
			console.error(error1);
		}
	}
}

export class UIPreferencesService {
	private static UI_PREFERENCES_KEY = 'ui-prefs';

	public readonly state;

	constructor() {
		this.state = new UIState();
		onMount(() => {
			this.readFromLocalStorage();
		});
	}

	public toggleShowCompleted(): void {
		this.state.showCompletedTasks = !this.state.showCompletedTasks;
		this.saveToLocalStorage();
	}

	public toggleShowListAll(): void {
		this.state.showListAll = !this.state.showListAll;
		this.saveToLocalStorage();
	}

	private saveToLocalStorage(): void {
		localStorage.setItem(UIPreferencesService.UI_PREFERENCES_KEY, this.state.fromJSON());
	}

	private readFromLocalStorage() {
		const prefsData = localStorage.getItem(UIPreferencesService.UI_PREFERENCES_KEY);
		if (prefsData === null) {
			return null;
		}
		this.state.initFrom(prefsData);
	}
}
