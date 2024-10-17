<script lang="ts">
	import { ArrowLeft, Trash2 } from 'lucide-svelte';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';

	import { TaskCheckbox, TaskMoveToList, TaskDateTimePicker } from '.';

	import { getAppDataService } from '$lib/app-state/data-service.svelte';

	const { tasksService } = getAppDataService();

	let task = $derived({ ...tasksService.state.selectedTask! });

	let taskName = {
		get value() {
			return task?.name;
		},
		set value(v) {
			task.name = v;
		}
	};
	let taskDescription = {
		get value() {
			return task?.description;
		},
		set value(v) {
			task.description = v;
		}
	};
	let availableLists = $derived(Array.from(tasksService.state.lists.values()));
</script>

<div class="flex flex-col space-y-4">
	<div class="flex items-center justify-between space-x-2">
		<div class="flex items-center space-x-3">
			<Button
				class="h-8 w-8"
				variant="outline"
				size="icon"
				onclick={() => {
					tasksService.state.selectedTaskID = null;
				}}>
				<ArrowLeft class="h-5 w-5" />
			</Button>

			<TaskMoveToList
				availableLists={availableLists}
				task={task} />
		</div>

		<Button
			class="space-x-2 bg-destructive/40 text-destructive-foreground hover:bg-destructive"
			onclick={() => {
				if (confirm('are you sure you want to delete this task?')) {
					if (!tasksService.state.selectedTask) return;
					tasksService.deleteTask({ taskID: task.id });
					tasksService.state.selectedTaskID = null;
				}
			}}>
			<span class="capitalize">delete&nbsp;task</span>
			<Trash2 class="h-5 w-5" />
		</Button>
	</div>

	<div class="flex items-center space-x-2">
		<TaskCheckbox task={task} />
		<TaskDateTimePicker task={task} />
	</div>

	<div class="mt-4 flex flex-col space-y-4">
		<Input
			onchange={() => {
				tasksService.updateTask({
					task: {
						...task,
						name: taskName.value
					}
				});
			}}
			onkeyup={() => {
				tasksService.state.tasks.set(task.id, { ...task, name: taskName.value });
			}}
			type="text"
			placeholder="No title"
			bind:value={taskName.value} />
		<Textarea
			class="h-72"
			onchange={() => {
				tasksService.updateTask({
					task: {
						...task,
						description: taskDescription.value
					}
				});
			}}
			bind:value={taskDescription.value}></Textarea>
	</div>
</div>
