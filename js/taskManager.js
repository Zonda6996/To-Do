export class TaskManager {
	constructor() {
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

	toggleTaskPriority(index) {
		this.tasks[index].isPriorityActive = !this.tasks[index].isPriorityActive
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

	editTask(index, newDescription) {
		this.tasks[index].description = newDescription
		this.saveToLocalStorage()
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

	clearCompletedTasks() {
		this.tasks = this.tasks.filter(task => !task.isCompleted)
		this.saveToLocalStorage()
	}

	searchTasks(query) {
		return this.tasks.filter(task =>
			task.description.toUpperCase().includes(query.toUpperCase())
		)
	}

	deleteAllTasks() {
		this.tasks.splice(0, this.tasks.length)
		this.saveToLocalStorage()
	}

	sortTasks(sortType) {
		switch (sortType) {
			case 'alphabetically':
				this.tasks.sort((a, b) => a.description.localeCompare(b.description))
				break
			case 'priority':
				this.tasks.sort((a, b) => b.isPriorityActive - a.isPriorityActive)
				break
			default:
				console.error('Invalid sort type', sortType)
				return
		}
		this.saveToLocalStorage()
	}
	handleMenuAction(action) {
		switch (action) {
			case 'clear-completed-tasks':
				this.clearCompletedTasks()
				break

			case 'sort-alphabetically':
				this.sortTasks('alphabetically')
				break

			case 'sort-by-priority':
				this.sortTasks('priority')
				break

			default:
				console.error('Unknown action', action)
		}
		this.saveToLocalStorage()
	}
}

export const taskManager = new TaskManager()
