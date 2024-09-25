import { writable } from 'svelte/store';
import type { Task } from '$lib/api';

export const tasksStore = writable<Task[]>();
