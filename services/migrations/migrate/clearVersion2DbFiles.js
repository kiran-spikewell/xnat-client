const firstRun = require('electron-first-run')
const fs = require('fs')

const { getJsonDbFiles } = require('../../db/utils')

const tokenName = 'clear-version2-db-files'

module.exports = async () => {
    const isFirstRun = firstRun({
        name: tokenName
    })

    if (isFirstRun) {
        const dbFiles = getJsonDbFiles()

        for (let i = 0; i < dbFiles.length; i++) {
            fs.unlinkSync(dbFiles[i])
        }
        console.log('IS clear-version2-db-files')

        return dbFiles.length ? true : false
    } else {
        console.log('NOT clear-version2-db-files')
        return false
    }
}
