const Sequelize = require('sequelize')

async function connectToDatabase () {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite3'
  })
  try {
    await sequelize.authenticate()
    return sequelize
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

module.exports = {
  connectToDatabase
}
