const constants = require('../services/constants');
//require('promise.prototype.finally').shim();
const path = require('path');
const ElectronStore = require('electron-store');
const settings = new ElectronStore();
const ipcRenderer = require('electron').ipcRenderer
const swal = require('sweetalert');
const fs = require('fs');

const remote = require('electron').remote;

const electron_log = remote.require('./services/electron_log');

const app = remote.app

const auth = require('../services/auth');
const user_settings = require('../services/user_settings');

const { isReallyWritable } = require('../services/app_utils');
const tempDir = require('temp-dir');

const dom_context = '#settings-section';
const { $$, $on } = require('./../services/selector_factory')(dom_context)

//const blockUI = require('blockui-npm');
let allow_insecure_ssl;

$on('page:load', dom_context, async function(e){
    if (auth.get_current_user()) {
        $('.nav-tabs a.hidden').removeClass('hidden');
        display_user_preferences()
    }
    
    render_users();
    show_default_email_address();
    show_default_local_storage();  
    show_default_pet_tracers();

    $('input[data-role="tagsinput"]').tagsinput({
        onTagExists: function(item, $tag) {
            $tag.hide().fadeIn();
        }
    });

    if (settings.get('send_crash_reports', false) === true) {
        $('#send-crash-reports').val('1')
    }

    template_variables()
});

function template_variables() {
    let loginData = auth.current_login_data()

    let data = {
        username: loginData.username,
        server: loginData.server
    }

    $$('[data-var]').each(function() {
        let varname = $(this).data('var')
        console.log({varname: data[varname]});
        $(this).text(data[varname])
    })
}

function display_user_preferences() {
    display_missing_anon_script_warnings_settings();
    show_default_temp_storage();
    show_default_upload_mode();
    show_recent_upload_projects_count();
    show_upload_concurrency();
    update_pdf_settings_info();
}

function display_missing_anon_script_warnings_settings() {
    let suppress = user_settings.get('suppress_anon_script_missing_warning');
    let warning_suppressed = suppress ? suppress : [];

    let table_rows = [];

    warning_suppressed.forEach(function(el, i){
        let items = el.split('|');
        table_rows.push({
            server: items[0],
            project_id: items[1],
            action: ''
        });
    });

    let bt_options = $('#suppress_anon_script_missing_warnings').bootstrapTable('getOptions');

    if ($.isPlainObject(bt_options)) { // bootstrap table already initialized
        $('#suppress_anon_script_missing_warnings').bootstrapTable('destroy')
    }

    $('#suppress_anon_script_missing_warnings').bootstrapTable({
        filterControl: table_rows.length > 4 ? true : false,
        height: table_rows.length > 4 ? 242 : 0,
        columns: [
            {
                field: 'server',
                title: 'Server',
                sortable: true,
                filterControl: 'input'
            }, 
            {
                field: 'project_id',
                title: 'Project ID',
                sortable: true,
                filterControl: 'input'
            }, 
            {
                field: 'action',
                title: 'Actions',
                width: '100px',
                class: 'action',
                formatter: function(value, row, index, field) {
                    return `
                
                    <a href="#" 
                        class="trash js_remove_suppress_anon_warning"
                        data-match="${row.server}|${row.project_id}"
                        ><i class="fas fa-trash-alt"></i></a>
                    `;
                }
            }
        ],
        data: table_rows
    });
}


function show_default_local_storage() {
    $('#default_local_storage').val(settings.get('default_local_storage'));
}

function show_default_email_address() {
    $('#default_email_address').val(settings.get('default_email_address'));
}

function show_default_pet_tracers() {
    $('#default_pet_tracers').val(settings.get('default_pet_tracers'));
}

function show_default_temp_storage() {
    let dicom_temp_folder_path = user_settings.getDefault('temp_folder_alternative', path.resolve(tempDir, '_xdc_temp'))

    $('#temp_folder_alt').val(dicom_temp_folder_path);
}

function show_default_upload_mode() {
    if (user_settings.get('zip_upload_mode') === true) {
        $('#zip_upload_mode').val('1')
    }
}

function show_recent_upload_projects_count() {
    let recent_upload_projects_count = user_settings.get('recent_upload_projects_count') !== undefined ? user_settings.get('recent_upload_projects_count') : constants.DEFAULT_RECENT_UPLOAD_PROJECTS_COUNT;
    $('#recent_upload_projects_count').attr('max', constants.MAX_RECENT_UPLOAD_PROJECTS_STORED).val(recent_upload_projects_count);
}

$(document).on('input', '#recent_upload_projects_count', function(e) {
    $('#save_recent_upload_projects_count').prop('disabled', false);
});

$(document).on('click', '#save_recent_upload_projects_count', function(e) {
    e.preventDefault();

    if ($('#recent_upload_projects_count').is(':invalid')) {
        swal({
            title: "Error!",
            text: "Please validate `Number of Recent Projects` field",
            icon: "error",
            button: "Okay",
          });
    } else {
        let recent_upload_projects_count = $('#recent_upload_projects_count').val() ? parseInt($('#recent_upload_projects_count').val()) : 0;
        
        user_settings.set('recent_upload_projects_count', recent_upload_projects_count);

        Helper.pnotify('Success!', `Recent upload projects count successfully updated! (New value: ${recent_upload_projects_count})`);
        
        $(this).prop('disabled', true);
    }
    
});


function show_upload_concurrency() {
    let upload_concurrency = user_settings.get('upload_concurrency') !== undefined ? 
        user_settings.get('upload_concurrency') : constants.DEFAULT_UPLOAD_CONCURRENCY;
    $('#upload_concurrency').attr('max', constants.MAX_UPLOAD_CONCURRENCY).val(upload_concurrency);
}

$(document).on('input', '#upload_concurrency', function(e) {
    $('#save_upload_concurrency').prop('disabled', false);
});

$(document).on('click', '#save_upload_concurrency', function(e) {
    e.preventDefault();

    if ($('#upload_concurrency').is(':invalid')) {
        swal({
            title: "Error!",
            text: "Please validate `Upload Concurrency` field",
            icon: "error",
            button: "Okay",
          });
    } else {
        let upload_concurrency = parseInt($('#upload_concurrency').val() || constants.DEFAULT_UPLOAD_CONCURRENCY);
        
        user_settings.set('upload_concurrency', upload_concurrency);

        Helper.pnotify('Success!', `Upload concurrency successfully updated! (New value: ${upload_concurrency})`);
        
        $(this).prop('disabled', true);
    }
    
});

function render_users() {
    let logins = settings.get('logins') || [];

    let table_rows = [];

    logins.forEach(function(el, i){
        table_rows.push({
            server: el.server,
            user: el.username,
            allow_insecure_ssl: el.allow_insecure_ssl ? true : false,
            action: ''
        });
    });

    let bt_options = $('#user_table').bootstrapTable('getOptions');

    if ($.isPlainObject(bt_options)) { // bootstrap table already initialized
        $('#user_table').bootstrapTable('destroy')
    }

    $('#user_table').bootstrapTable({
        filterControl: table_rows.length > 4 ? true : false,
        height: table_rows.length > 4 ? 242 : 0,
        columns: [
            {
                field: 'server',
                title: 'Server',
                sortable: true,
                filterControl: 'input',
                formatter: function(value, row, index, field) {
                    var server_name = value.split('//');
                    return server_name[1];
                }
            }, 
            {
                field: 'user',
                title: 'User',
                sortable: true,
                filterControl: 'input'
            }, 
            {
                field: 'allow_insecure_ssl',
                title: 'Allow insecure SSL',
                sortable: true,
                width: '170px',
                align: 'center',
                filterControl: 'select',
                formatter: function(value, row, index, field) {
                    return value ? `<i class="fas fa-check"></i>` : '';
                }
            }, 
            {
                field: 'action',
                title: 'Actions',
                width: '140px',
                class: 'action',
                formatter: function(value, row, index, field) {
                    return `
                    <a href="#" 
                        class="edit"
                        data-username="${row.user}" data-server="${row.server}" data-allow_insecure_ssl="${row.allow_insecure_ssl}"
                        data-toggle="modal" data-target="#user_connection"
                        ><i class="fas fa-edit"></i></a>
                
                    <a href="#" 
                        class="trash js_remove_login"
                        data-username="${row.user}" data-server="${row.server}"
                        ><i class="fas fa-trash-alt"></i></a>
                    `;
                }
            }
        ],
        data: table_rows
    });
    
}


function test_login(xnat_server, user_auth, old_user_data) {
    console.log(xnat_server, user_auth, old_user_data);

    if (xnat_server.indexOf('http://') === 0 || xnat_server.indexOf('https://') === 0) {
        login_attempt(xnat_server, user_auth, old_user_data);
    } else {
        let server_with_protocol = 'https://' + xnat_server;
        
        auth.login_promise(server_with_protocol, user_auth)
            .then(res => {
                handleLoginSuccess(server_with_protocol, user_auth, old_user_data);
            })
            .catch(err => {
                server_with_protocol = 'http://' + xnat_server;
                login_attempt(server_with_protocol, user_auth, old_user_data);
            });
    }
    
}

function handleLoginSuccess(xnat_server, user_auth, old_user_data) {
    auth.save_login_data(xnat_server, user_auth, allow_insecure_ssl, old_user_data);

    $('#user_connection').modal('hide')
    render_users();

    Helper.pnotify('Success!', `User connection is ${old_user_data.username ? 'updated': 'added'}.`);

    // swal({
    //     title: "Success!",
    //     text: `User connection is ${old_user_data.username ? 'updated': 'added'}.`,
    //     icon: "success",
    //     button: "Okay",
    // });
}

function login_attempt(xnat_server, user_auth, old_user_data) {
    auth.login_promise(xnat_server, user_auth)
        .then(res => {
            handleLoginSuccess(xnat_server, user_auth, old_user_data);
        })
        .catch(error => {
            // more error details
            let error_details = error.response ? error.response : {
                error: error,
                message: error.message
            };

            error_details = auth.anonymize_response(error_details)

            var div = document.createElement("div");
            div.innerHTML = JSON.stringify(error_details);
            var text = div.textContent || div.innerText || "";
            
            text = text.replace(/<!--[\s\S]*?-->/g, "")
            electron_log.error(text)

            $('#login_error_details').html(text);


            let msg = `
                User credentials were not saved!<br>
                XNAT server: ${xnat_server}<br>
                Username: ${user_auth.username}<br><br>
                ${Helper.errorMessage(error)}
            `;

            $('#login_feedback').removeClass('hidden');
            $('#login_error_message').html(msg);
        })
        .finally(() => {
            Helper.unblockModal('#user_connection');
            $('#password').val('').focus();

            app.allow_insecure_ssl = false;
        });
}


$(document).on('input', '#default_email_address', function(e) {
    $('#save_default_email_address').prop('disabled', false);
});


$(document).on('itemAdded itemRemoved', '#default_pet_tracers', function(e) {
    $('#save_default_pet_tracers').prop('disabled', false);
});

$(document).on('click', '#save_default_pet_tracers', function(e) {
    e.preventDefault();

    settings.set('default_pet_tracers', $('#default_pet_tracers').val());

    Helper.pnotify('Success!', `Default PET tracers successfully updated! (${$('#default_pet_tracers').val()})`);

    $(this).prop('disabled', true);
})

$(document).on('change', '#send-crash-reports', function(e) {
    let send_crash_reports = $('#send-crash-reports').val() === '1';
    settings.set('send_crash_reports', send_crash_reports);
    Helper.pnotify('Success!', `Crash Report status was updated! (${send_crash_reports ? 'ON' : 'OFF'})`);
})


$(document).on('click', '#save_default_email_address', function(e) {
    e.preventDefault();

    if ($('#default_email_address').is(':invalid')) {
        swal({
            title: "Error!",
            text: "Please validate email field",
            icon: "error",
            button: "Okay",
          });
    } else {
        settings.set('default_email_address', $('#default_email_address').val());

        Helper.pnotify('Success!', `Default email address successfully updated! (${$('#default_email_address').val()})`);
        
        $(this).prop('disabled', true);
    }
    
});

$(document).on('change', '#file_default_local_storage', function(e) {
    settings.set('default_local_storage', this.files[0].path);
    $('#default_local_storage').val(this.files[0].path);

    Helper.pnotify('Success!', `Default local storage path successfully updated! (${this.files[0].path})`);
    // swal({
    //     title: "Success!",
    //     text: "Default local storage path successfully updated!",
    //     icon: "success",
    //     button: "Okay"
    // });
});

$(document).on('submit', '#userForm', function(e) {
    Helper.blockModal('#user_connection');

    e.preventDefault();
    $('#login_feedback').addClass('hidden')

    let xnat_server = $('#server').val().replace(/\/$/, '');
    let user_auth = {
        username: $('#username').val(),
        password: $('#password').val()
    }
    let old_user_data = {
        server: $('#old_server').val(),
        username: $('#old_username').val()
    }
    allow_insecure_ssl = $('#allow_insecure_ssl').is(':checked');
    app.allow_insecure_ssl = allow_insecure_ssl;

    test_login(xnat_server, user_auth, old_user_data)
});

$(document).on('show.bs.modal', '#user_connection', function(e) {
    let $button = $(e.relatedTarget);
    let $form = $(e.currentTarget);
    
    //get data-id attribute of the clicked element
    let username = $button.data('username');
    $form.find('input[name="username"]').val(username);

    let server = $button.data('server');
    $form.find('input[name="server"]').val(server);

    let allow_insecure_ssl = $button.data('allow_insecure_ssl');
    $form.find('input[name="allow_insecure_ssl"]').prop('checked', allow_insecure_ssl);
    $('.form-check', $form).toggleClass('hidden', !allow_insecure_ssl)


    let focused_field = server && username ? '#password' : '#server';
    setTimeout(function(){
        $(focused_field).focus();
    }, 500);

    if (typeof username == 'undefined') {
        $('#remove_login').hide();
    } else {
        $('#old_server').val(server);
        $('#old_username').val(username);

        $('#remove_login').show();
    }
});

$(document).on('click', '.js_remove_login', function(e){
    let $this = $(this);
    swal({
        title: "Remove stored connection?",
        text: `Are you sure you want to remove it from the list?
            
            Server: ${$this.data('server')}
            Username: ${$this.data('username')}
        `,
        icon: "warning",
        buttons: [true, 'Remove'],
        closeOnEsc: false,
        dangerMode: true
    })
    .then((doRemove) => {
        if (doRemove) {
            let xnat_server = $this.data('server');
            let user_auth = {
                username: $this.data('username')
            }

            auth.remove_login_data(xnat_server, user_auth)

            render_users();

            Helper.pnotify('Connection data removed!', 'Connection data removed from the list of stored connections.');

            // swal({
            //     title: "Connection data removed",
            //     text: "Connection data removed from the list of stored connections",
            //     icon: "success",
            //     closeOnEsc: false
            // })
        }
    });
});


$(document).on('click', '.js_remove_suppress_anon_warning', function(e){
    let match = $(this).data('match');
    
    user_settings.pop('suppress_anon_script_missing_warning', match)

    display_user_preferences()
});



$(document).on('change', '#file_temp_folder_alt', function(e) {
    let alt_path = this.files[0].path;
    if (alt_path) {
        if (isReallyWritable(alt_path)) {
            console.log('WRITABLE', alt_path);

            $('#temp_folder_alt').val(alt_path);

            user_settings.set('temp_folder_alternative', alt_path);
            Helper.pnotify('Success!', `Default temporary storage path successfully updated! (${alt_path})`);

            // TODO add Helper.notify
        } else {
            console.log('NOT WRITABLE', alt_path);
            Helper.pnotify('Permissions Error!', `Selected directory (${alt_path}) is not writable! Please select a different directory.`);
        }
    }
    

});

$(document).on('click', '#reset_temp_folder_alt', async function() {
    let default_temp_path = path.resolve(tempDir, '_xdc_temp');
    const proceed = await swal({
        title: `Are you sure?`,
        text: `Reset temporary upload path to "${default_temp_path}"?`,
        icon: "warning",
        buttons: ['Cancel', 'Continue'],
        dangerMode: true
    })

    if (proceed) {
        user_settings.unset('temp_folder_alternative')
        $('#temp_folder_alt').val(default_temp_path)
        Helper.pnotify('Success!', `Temporary folder reset to system default!`, 'success', 2000)
    }
})


$(document).on('change', '#zip_upload_mode', function(e) {
    let use_zip_upload_mode = $('#zip_upload_mode').val() === '1';
    user_settings.set('zip_upload_mode', use_zip_upload_mode);
    Helper.pnotify('Success!', `Upload mode was updated! (${use_zip_upload_mode ? 'Zip' : 'Stream'})`);
})


$on('click', '#change-pdf-receipt-settings', function() {
    let pdf_enabled = user_settings.getDefault('receipt_pdf_settings--enabled', false)
    $$('#receipt_pdf_settings--enabled').prop('checked', pdf_enabled)
    $$('#receipt_pdf_settings_additional').toggle(pdf_enabled)
    
    
    $$('#pdf_destination').val(user_settings.getDefault('receipt_pdf_settings--destination', ''))

    let orientation = user_settings.getDefault('receipt_pdf_settings--orientation', false)
    if (orientation) {
        $$('[name="pdf_orientation"]', '#upload-receipt-destination').each(function() {
            const is_checked = $(this).val() === orientation
            $(this).prop("checked", is_checked)
        })
    }

    let pagesize = user_settings.getDefault('receipt_pdf_settings--pagesize', false)
    if (pagesize) {
        $$('[name="pdf_pagesize"]', '#upload-receipt-destination').each(function() {
            const is_checked = $(this).val() === pagesize
            $(this).prop("checked", is_checked)
        })
    }

    $$('#upload-receipt-destination-settings').modal('show')
});


$on('change', '#pdf_destination_folder', function(e) {
    if (this.files.length) {
        let pth = this.files[0].path;

        $$('#pdf_destination').val(pth);
    }
});

$on('change', '#receipt_pdf_settings--enabled', function() {
    const pdf_enabled = $(this).is(':checked')
    const $additional = $$('#receipt_pdf_settings_additional')
    if (pdf_enabled) {
        $additional.slideDown()
    } else {
        $additional.slideUp()
    }
})

$on('click', '#save-pdf-destination', function(e) {
    const pdf_enabled = $$('#receipt_pdf_settings--enabled').is(':checked')
    const pdf_destination = $$('#pdf_destination').val()
    const pdf_orientation = $$('[name="pdf_orientation"]:checked').val()
    const pdf_pagesize = $$('[name="pdf_pagesize"]:checked').val()

    if (pdf_enabled && pdf_destination === '') {
        Helper.pnotify('Warning', 'PDF receipt store location is a required field!', 'notice')
    } else {
        user_settings.set('receipt_pdf_settings--enabled', pdf_enabled)
        user_settings.set('receipt_pdf_settings--destination', pdf_destination)
        user_settings.set('receipt_pdf_settings--orientation', pdf_orientation)
        user_settings.set('receipt_pdf_settings--pagesize', pdf_pagesize)

        update_pdf_settings_info()

        $(this).closest('.modal').modal('hide')
    }
})

$on('click', '[data-js="show-user-data-folder"]', function() {
    ipcRenderer.send('shell.showItemInFolder', app.getPath('userData') + path.sep + '.')
})

$on('click', '[data-js="clear-app-cache"]', async function() {
    const proceed = await swal({
        title: 'Clear Application Cache?',
        text: 'If you clear the application cache, all transfer data will be lost and the application will relaunch!',
        icon: "warning",
        buttons: ['Cancel', 'Yes'],
        dangerMode: true
    })
    
    if (proceed) {
        const appDataDir = app.getPath('userData')
        const clear_cache_flag_file = path.join(appDataDir, constants.CLEAR_APPLICATION_CACHE_FILENAME)

        if (!fs.existsSync(clear_cache_flag_file)) {
            fs.writeFileSync(clear_cache_flag_file, '')
        }
        
        app.relaunch()
        app.exit()
    }
})

function update_pdf_settings_info() {
    let $infobox = $$('#pdf-receipt-settings')
    
    let enabled = user_settings.getDefault('receipt_pdf_settings--enabled', false)

    if (!enabled) {
        $infobox.html('<b>Status</b>: DISABLED')
    } else {
        $infobox.html(`
            <span style="display: inline-block; width: 100px;">Status:</span> ENABLED<br>
            <span style="display: inline-block; width: 100px;">Destination:</span> ${user_settings.get('receipt_pdf_settings--destination')}<br>
            <span style="display: inline-block; width: 100px;">Orientation:</span> ${user_settings.get('receipt_pdf_settings--orientation')}<br>
            <span style="display: inline-block; width: 100px;">Page Size:</span> ${user_settings.get('receipt_pdf_settings--pagesize')}<br>
        `)
    }
}