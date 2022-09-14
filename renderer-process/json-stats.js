const { ipcRenderer, remote } = require('electron');
const app = remote.app

const { glob } = require('glob')
const path = require('path')
const fs = require('fs')
const bytes = require('bytes')
const swal = require('sweetalert')


const ElectronStore = require('electron-store')
const settings = new ElectronStore()
const auth = require('../services/auth')
const sha1 = require('sha1')

const dom_context = '#json-stats'
const { $$, $on } = require('../services/selector_factory')(dom_context)

$on('page:load', dom_context, function(e){
    $$('#user-data-path').text(app.getPath('userData'))

    populateJsonDbData()
})

$on('click', '#user-data-path', (e) => {
    e.preventDefault()
    ipcRenderer.send('shell.showItemInFolder', app.getPath('userData') + '/.')
})


$on('click', '#clear-upload', async () => {
    await clearUploadDb()
})

function populateJsonDbData() {
    $$('#json-files').html('')
    const dbFiles = getJsonDbFiles()

    for (let i = 0; i < dbFiles.length; i++) {
        let fileSize = getFilesizeInBytes(dbFiles[i]);
        let badgeClass = fileSize > 0 ? 'badge-success' : 'badge-light'
        $$('#json-files').append(`<li><span style="width: 70px; text-align: right;" class="badge ${badgeClass}">${bytes(fileSize)}</span> ${path.basename(dbFiles[i])}</li>`)
    }
    $$('#json-files').append(`<li style="font-size: 0.7em">Rand seed: ${Math.random()}</li>`)
}

async function clearUploadDb() {
    let willDelete = await swal({
        title: "Are you sure?",
        text: "This will delete all the content in the upload transfer list!",
        buttons: true,
        dangerMode: true,
    })

    if (willDelete) {
        await swal("The application will restart after clearing the upload list.")
    } else {
        return;
    }

    fs.writeFile(getDbFilePath('uploads'), '', err => {
        if (err) throw err;

        app.relaunch()
        app.exit()
    })
}

function getDbFilePath(dbFile) {
    let xnat_server = settings.get('xnat_server');
    let username = auth.get_current_user();
    let db_sha1 = sha1(xnat_server + username)

    const appDataDir = app.getPath('userData')
    return path.join(appDataDir, `db.${dbFile}.${db_sha1}.json`)
}

function getJsonDbFiles() {
    let xnat_server = settings.get('xnat_server');
    let username = auth.get_current_user();

    let db_sha1 = sha1(xnat_server + username)

    const appDataDir = app.getPath('userData')
    const dbPath = path.join(appDataDir, `db.*.${db_sha1}.json`)
    //const dbPath = path.join(appDataDir, `db.*.json`)

    return glob.sync(dbPath)
}

function getFilesizeInBytes(filename) {
    let stats = fs.statSync(filename);
    let fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}
