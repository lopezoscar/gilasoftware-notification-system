const NotificationModel = require('../models/notification-model')
const InternalServerError = require('../errors/InternalServerError')
const ValidationError = require('../errors/ValidationError')
const VALID_CATEGORIES = ['Sports', 'Finance', 'Movies']

class NotificationService {
  constructor ({ db }) {
    this.db = db
    this.notificationModel = new NotificationModel({ db })
  }

  async sendNotification ({ category, message, userId }) {
    if (!category) {
      throw new ValidationError('category is required')
    }
    if (!message) {
      throw new ValidationError('message is required')
    }
    if (VALID_CATEGORIES.indexOf(category) === -1) {
      throw new ValidationError('invalid category')
    }
    if (!userId) {
      throw new ValidationError('userId is required')
    }
    const newNotification = {
      message,
      category,
      createdAt: new Date(),
      userId
    }
    try {
      const result = await this.notificationModel.createNotification(newNotification)
      if (result && result.id) {
        newNotification.id = result.id
      }
      return newNotification
    } catch (error) {
      console.log(error)
      throw new InternalServerError(error)
    }
  }
}

module.exports = NotificationService
