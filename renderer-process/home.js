const ipcRenderer = require('electron').ipcRenderer;
const shell = require('electron').shell;

const fs = require('fs');

const path = require('path');
const ElectronStore = require('electron-store');
const settings = new ElectronStore();

const axios = require('axios');
require('promise.prototype.finally').shim();

const xml2js = require('xml2js');
const swal = require('sweetalert');

const remote = require('electron').remote;
const electron_log = remote.require('./services/electron_log');

const FileSaver = require('file-saver');
const zlib = require('zlib');

const unzipper = require('unzipper');
const sha1 = require('sha1');

const app = remote.app;

const db_downloads = remote.require('./services/db/downloads')

const nedb_logger = remote.require('./services/db/nedb_logger')
const nedb_log_reader = remote.require('./services/db/nedb_log_reader')

const dom_context = '#home-section';
const { $$, $on } = require('./../services/selector_factory')(dom_context)

const { isReallyWritable } = require('../services/app_utils');


let xnat_server, user_auth, default_local_storage;
let manifest_urls = new Map();

let protocol_data;


const NProgress = require('nprogress');
NProgress.configure({ 
    trickle: false,
    easing: 'ease',
    speed: 1,
    minimum: 0.03
});

$(document).on('click', '#nedb_log_insert', function() {
    let transfer_id, type, message, details_object;

    transfer_id = Math.random();
    type = 'upload';
    message = `Some message for ... ${transfer_id}`;
    
    nedb_logger.debug(transfer_id, type, message)
    nedb_logger.info(transfer_id, type, message)
    nedb_logger.error(transfer_id, type, message)
    nedb_logger.success(transfer_id, type, message)

    

    transfer_id = 152;
    type = 'upload';
    message = `Some message for ... ${transfer_id}`;
    
    nedb_logger.debug(transfer_id, type, message)
    nedb_logger.info(transfer_id, type, message)
    nedb_logger.error(transfer_id, type, message)
    nedb_logger.success(transfer_id, type, message)
});

$(document).on('click', '#nedb_log_read', function() {
    nedb_log_reader.fetch_log(152, (err, docs) => {
        console.log(docs);
    })
});

$(document).on('page:load', '#home-section', function(e){
    console.log('HOME page:load triggered');
    _init_variables();
});

$(document).on('show.bs.modal', '#download_modal', function(e) {
    const default_local_storage = settings.get('default_local_storage')
	
    if (default_local_storage) {
        $$('#download_destination_text').val(default_local_storage)
        $$('#default_local_storage_dir').text(default_local_storage);
    } else {
        $$('#download_destination_text').val('');
        $$('#default_local_storage_dir').text(`N/A`);
    }
});

$(document).on('change', '#download_destination_file', function(e) {
    let $input = $$('#download_destination_text');
    let $ds = $$('#set_default_local_storage')

    if (this.files.length) {
        if (isReallyWritable(this.files[0].path)) {
            $input.val(this.files[0].path);

            let not_default_dir = this.files[0].path !== settings.get('default_local_storage')
            $ds.toggle(not_default_dir)
        } else {
            Helper.pnotify(null, `Selected location "${this.files[0].path}" is not accessible.`, 'error', 3000);
        }
    }

    $(this).val('');
});

$(document).on('change', '#xnt_manifest_file', function(e) {
    console.log(this.files);

    let $input = $('#xnt_manifest_text');

    if (this.files.length) {
        $input.val(this.files[0].path);
    }

    $(this).val('');
});

$(document).on('click', '.js_download_session_files', async function(){
    // validate
    let error_message = '';
    let $alert = $(this).closest('.modal-content').find('.alert');

    let xnt_file = $.trim($('#xnt_manifest_text').val());
    let destination = $.trim($('#download_destination_text').val());

    if (xnt_file === '') {
        error_message = 'Please select a valid XNAT XML catalog file.';
    } else if (destination === '') {
        error_message = 'Please set a download destination path.';
    } else {
        try {
            await attempt_download(xnt_file, destination)
        } catch(err) {
            error_message = err.message;
        }
        
    }

    if (error_message.length) {
        $alert.show().find('.error_message').html(error_message);
    } else {
        $alert.hide();
    }
});

$on('change', '#set_default_local_storage_dir', function() {
    const folder_path = $$('#download_destination_text').val()

    if ($(this).is(':checked')) {
        settings.set('default_local_storage', folder_path)
        $$('#default_local_storage_dir').text(folder_path)
        $$('#set_default_local_storage').hide()
        Helper.pnotify(null, 'Default download destination was updated.', 'success', 3000);

        $$('#set_default_local_storage_dir').prop('checked', false)
    }
})

async function attempt_download(file_path, destination) {
    let data;
    let parser = new xml2js.Parser({
        explicitArray: true,
        normalizeTags: true,
        tagNameProcessors: [
            function(str) {
                var prefixMatch = new RegExp(/(?!xmlns)^.*:/);
                return str.replace(prefixMatch, '');
            }
        ]
    });

    let test_path = '__TEST__'  + (new Date() / 1);
    let write_test_path = path.join(destination, test_path)
    
    
    // using a workaround since fs.accessSync(destination, fs.constants.R_OK | fs.constants.W_OK) does not work
    try {
        fs.mkdirSync(write_test_path);
        fs.rmdirSync(write_test_path);
        
    } catch(err) {
        electron_log.error('Download Destination Permission Error', err);
        throw new Error(`Destination "${destination}" is not writable. Please choose a different destination path.`);
    }

    

    try {
        // add if (file_path starts with "xnat(s)://" and put THAT into data)
        if (file_path.indexOf(app.app_protocol + '://') === 0 || file_path.indexOf(app.app_protocol + 's://') === 0) {
            
            let xml_request = axios.get(protocol_data.REST_XML, {
                auth: {
                    username: protocol_data.ALIAS,
                    password: protocol_data.SECRET
                }
            });
            
            let xml_resp = await xml_request; // wait till the promise resolves (*)
            
            data = xml_resp.data;
        } else {
            data = fs.readFileSync(file_path);
        }

    } catch (err) {
        console.log(err.message);
        throw new Error('File reading error. Please choose another XML manifest file.');
    }

    let parsing_error_message = 'An error occurred while parsing manifest file! Please try again, use another manifest file or check the documentation (<a href="https://wiki.xnat.org/xnat-tools/xnat-desktop-client-dxm/downloading-image-sessions">Downloading Image Sessions</a>).';

    parser.parseString(data, function (err2, result) {
        if (err2) {
            throw new Error(`${parsing_error_message} <br><small>[Error: ${err2.message}]</small>`);
        }
        
        try {
            let catalog_description = result.catalog.$.description ? result.catalog.$.description : '';
            let has_project = catalog_description.indexOf('projectIncludedInPath') !== -1;
            let has_subject = has_project || catalog_description.indexOf('subjectIncludedInPath') !== -1;
            
            manifest_urls = new Map();
            
            let my_sets = result.catalog.sets[0].entryset;

            let download_digest = {
                id: Helper.uuidv4(),
                basename: path.basename(file_path),
                destination: destination,
                server: xnat_server,
                user: user_auth.username,
                //user_auth: user_auth,
                transfer_start: Helper.unix_timestamp(),
                sessions: [],
                canceled: false
            }

            console.log('===================================== my_sets =====================================');
            console.log(my_sets);
            
            for (let i = 0; i < my_sets.length; i++) {
                if (my_sets[i].hasOwnProperty('sets')) {

                    let session = {
                        name: my_sets[i].$.description,
                        id: Helper.uuidv4(),
                        files: []
                    }

                    let entrysets = my_sets[i].sets[0].entryset;

                    for (let k = 0; k < entrysets.length; k++) {
                        let entries = entrysets[k].entries[0].entry;
                        
                        for (let j = 0; j < entries.length; j++) {
                            let uri_data = entries[j].$;
                            let real_uri = uri_data.URI.replace(/^\/archive\//, '/data/') + '?format=zip';
                            
                            manifest_urls.set(uri_data.name, real_uri);
                            
                            session.files.push({
                                name: uri_data.name,
                                uri: real_uri,
                                status: 0
                            })
                        }
                    }

                    download_digest.sessions.push(session)
                } else {
                    console.log('SKIPPing ---------------');
                }
            }

            //console.log(download_digest);

            db_downloads().insert(download_digest, (err, newItem) => {
                console.log(newItem);
            })
            
            //console.log(manifest_urls);
            
            $('.modal').modal('hide');

            ipcRenderer.send('start_download');
            ipcRenderer.send('redirect', 'progress.html');

        } catch(parse_error) {
            throw new Error(`${parsing_error_message} <br><small>[Error: ${parse_error.message}]</small>`);
        }

    });
    
}

function _init_variables() {
    xnat_server = settings.get('xnat_server');
    user_auth = settings.get('user_auth');
    default_local_storage = settings.get('default_local_storage')
}

ipcRenderer.on('launch_download_modal',function(e, data){
    var $dm = $('#download_modal');

    var show_modal = function(){
        //console.log(data);
        protocol_data = data;

        $('#xnt_manifest_text').val(data.URL);
        $dm.modal('show');
    }

    $dm.modal('hide');
    $('.modal-backdrop').remove();

    setTimeout(show_modal, 500)
    
});
