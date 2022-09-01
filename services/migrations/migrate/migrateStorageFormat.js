const { getApp } = require('../../app_utils')
const migrateSettings = require('./settings_to_store_migration')

module.exports = async () => {
    migrateSettings(getApp().getPath('userData'))

    return true
}