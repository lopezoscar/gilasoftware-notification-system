const Joi = require('joi')
const { StatusCodes } = require('http-status-codes')
const NotificationService = require('../services/notification-service')
const ValidationError = require('../errors/ValidationError')
const createError = require('http-errors')
const VALID_CATEGORIES = ['Sports', 'Finance', 'Movies']

function validate ({ schema, data }) {
  const { error } = schema.validate(data)
  if (error) {
    throw new ValidationError(error)
  }
}

class NotificationRouter {
  constructor ({ db }) {
    this.db = db
    this.notificationService = new NotificationService({ db: this.db })
  }

  sendNotification () {
    const schema = Joi.object({
      category: Joi.string().valid(...VALID_CATEGORIES).required(),
      message: Joi.string().max(10000).required()
    })
    return async (req, res, next) => {
      try {
        validate({ schema, data: req.body })

        const { category, message } = req.body
        const userId = req.auth.userId
        console.log('sending notification', category, message)
        const notificationResponse = await this.notificationService.sendNotification({ category, message, userId })
        return res.status(StatusCodes.CREATED).send(notificationResponse)
      } catch (error) {
        console.log(error)
        if (error instanceof ValidationError) {
          return next(new createError.BadRequest(error.message))
        }
        return next(new createError.InternalServerError(error))
      }
    }
  }
}

module.exports = NotificationRouter
