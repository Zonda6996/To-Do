// Функция для показа сообщений всплывающими подсказками

export function showNotification(message, type) {
	const notificationContainer = document.getElementById(
		'notification-container'
	)

	// Создаём элемент для уведомления
	let notification = document.createElement('div')
	notification.className = `notification ${type}`
	notification.textContent = message

	// Добавляем кнопку для закрытия уведомления
	const closeButton = document.createElement('button')
	closeButton.className = 'notification-close'
	closeButton.addEventListener('click', () => notification.remove())

	// Вставляем кнопку в уведомление
	notification.append(closeButton)
	notificationContainer.append(notification)

	// Автоматическое удаление уведомления через 5 секунд
	setTimeout(() => notification.remove(), 5000)
}
