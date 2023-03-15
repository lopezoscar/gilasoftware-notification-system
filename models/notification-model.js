class NotificationModel {
  constructor ({ db }) {
    this.db = db
  }

  createNotification (newNotification) {
    console.log('inserting newNotification', newNotification)
  }
}

module.exports = NotificationModel
