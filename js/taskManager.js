export class TaskManager {
	constructor() {
		this.tasks = []
		this.sortedTasks = []
		this.tasks = this.loadFromLocalStorage() || []
	}

	addTask(description) {
		this.tasks.push({
			description: description,
			isCompleted: false,
			isPriorityActive: false,
		})
		this.saveToLocalStorage()
	}

	toggleTaskCompletion(index) {
		this.tasks[index].isCompleted = !this.tasks[index].isCompleted
		this.saveToLocalStorage()
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
		this.saveToLocalStorage()
	}

	saveToLocalStorage() {
		localStorage.setItem('tasks', JSON.stringify(this.tasks))
	}

	loadFromLocalStorage() {
		const tasks = localStorage.getItem('tasks')
		return tasks ? JSON.parse(tasks) : []
	}

	editTask(index, newDesc) {
		this.tasks[index].description = newDesc
		this.saveToLocalStorage()
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
		this.saveToLocalStorage()
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
