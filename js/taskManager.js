export class TaskManager {
	constructor() {
		this.tasks = []
		this.sortedTasks = []
	}

	addTask(description) {
		this.tasks.push({
			description: description,
			isCompleted: false,
			isPriorityActive: false,
		})
	}

	toggleTaskCompletion(index) {
		this.tasks[index].isCompleted = !this.tasks[index].isCompleted
	}

	getPendingTasks() {
		return this.tasks.filter(item => !item.isCompleted)
	}

	getCompletedTasks() {
		return this.tasks.filter(item => item.isCompleted)
	}

	getAllTasks() {
		return this.tasks
	}

	removeTask(index) {
		this.tasks.splice(index, 1)
	}

	editTask(index, newDesc) {
		this.tasks[index].description = newDesc
	}

	clearCompletedTasks() {
		this.tasks = this.tasks.filter(task => !task.isCompleted)
	}

	findTaskByDesc(str) {
		return this.tasks.filter(task =>
			task.description.toUpperCase().includes(str.toUpperCase())
		)
	}

	deleteAllTasks() {
		this.tasks.splice(0, this.tasks.length)
	}

	sortAlphabetically() {
		this.tasks.sort((a, b) => a.description.localeCompare(b.description))
	}

	sortByPriority() {
		this.tasks.sort((a, b) => b.isPriorityActive - a.isPriorityActive)
	}

	handleMenuAction(action) {
		switch (action) {
			case 'clear-comp-tasks':
				this.clearCompletedTasks()
				break
			case 'sort-alphabetically':
				this.sortAlphabetically()
				break
			case 'sort-by-priority':
				this.sortByPriority()
				break
			default:
				alert('Ошибка.')
				break
		}
	}
}
