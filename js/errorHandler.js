import * as constants from './constants.js'
import * as notificationShow from './notificationShow.js'
// import { eventHandlers } from './eventHandlers.js'
export function validateTaskName(taskName) {
	if (taskName.length > constants.MAX_TASK_NAME_LENGTH) {
		notificationShow.showNotification(
			constants.ERROR_MESSAGE_MAX_LENGTH,
			'notification-warning'
		)
		return false
	}

	if (taskName.length < constants.MIN_TASK_NAME_LENGTH) {
		notificationShow.showNotification(
			constants.ERROR_MESSAGE_MIN_LENGTH,
			'notification-warning'
		)
		return false
	}
	return true
}

export function showMinLengthExceeded() {
	notificationShow.showNotification(
		constants.ERROR_MESSAGE_MIN_LENGTH,
		'notification-warning'
	)
}

export function showMaxLengthExceeded() {
	notificationShow.showNotification(
		constants.ERROR_MESSAGE_MAX_LENGTH,
		'notification-warning'
	)
}
