const electron = require('electron')
const path = require('path')
const fs = require('fs')
const checksum = require('checksum')
const FileSaver = require('file-saver')

const ElectronStore = require('electron-store')
const settings = new ElectronStore()

const tempDir = require('temp-dir')
const rimraf = require('rimraf')

exports.isDevEnv = () => {
    // return process.argv && process.argv.length >= 3 && /--debug/.test(process.argv[2]);

    // console.log(process.argv)
    // console.log(process.mainModule.filename);
    // alternative
    return process.mainModule.filename.indexOf('app.asar') === -1;
}

exports.getApp = () => electron.remote ? electron.remote.app : electron.app

exports.currentVersionChannel = () => {
    const app = this.getApp()
    const versionString = app.getVersion()
    
    return versionString.includes("-beta") ? "beta" : 
        versionString.includes("-alpha") ? "alpha" :
        "latest";
}

exports.getUpdateChannel = () => {
    return settings.get('electron-updater-channel', this.currentVersionChannel())
}

exports.setUpdateChannel = (channel) => {
    if (!['alpha', 'beta', 'latest'].includes(channel)) {
        channel = 'latest'
    }
    return settings.set('electron-updater-channel', channel)
}

exports.clearDefaultTempFiles = () => {
    return new Promise((resolve, reject) => {
        const directory = path.resolve(tempDir, '_xdc_temp', '*')

        rimraf(directory, {disableGlob: false}, error => {
            if (error) {
                reject(error)
            } else {
                resolve(true)
            }
        })
    })
}

exports.objToJsonFile = (jsonObject, target_path) => {
    if (this.isReallyWritable(path.dirname(target_path))) {
        const data = JSON.stringify(jsonObject, null, 2)
        fs.writeFile(target_path, data, function(err) {
            if (err) {
                console.log(err)
            }
        })
    } else {
        console.log(`Not writable: ${path.dirname(target_path)}`)
    }
}

function objArrayToCSV(objArray, header_fields = false) {
    function isObject (value) {
        return value && typeof value === 'object' && value.constructor === Object;
    }

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    const replacer = (key, value) => value === null ? '' : value; // handle null values here

    const header = header_fields ? header_fields : Object.keys(objArray[0]);

    // let csv = objArray.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));

    let csv = objArray.map(row => {
        return header.map(fieldName => {
            let str = JSON.stringify(row[fieldName], replacer);

            if (isObject(row[fieldName])) {
                return `"${replaceAll(str, '"', '""')}"`;
            } else {
                return str;
            }
            
        }).join(',')
    });

    csv.unshift(header.join(','));
    csv = csv.join('\r\n');

    return csv;
}

exports.objArrayToCSV = objArrayToCSV

exports.saveAsCSV = (data, filename, header_fields = false) => {
    let csv = objArrayToCSV(data, header_fields);

    var file = new File([csv], filename, {type: "text/csv;charset=utf-8"});
    FileSaver.saveAs(file);
}

exports.isReallyWritable = (_path) => {
    let new_dir = '__TEST__'  + Date.now();
    let write_test_path = path.join(_path, new_dir)

    // using a workaround since fs.accessSync(_path, fs.constants.R_OK | fs.constants.W_OK) does not work
    // check if it works for built version
    try {
        fs.mkdirSync(write_test_path);
        fs.rmdirSync(write_test_path);
        return true;
    } catch(err) {
        return false;
    }
}

exports.isEmptyObject = (myObj) => {
    return JSON.stringify(myObj) === '{}'
}

exports.promiseSerial = (funcs) => {
    const reducer = (promise, func) => {
        return promise.then(result => {
            return func().then(resp => {
                //return Array.prototype.concat.bind(result)(resp)
                return (resp !== false) ? result.concat(resp) : result
            })
        })
    }

    return funcs.reduce(reducer, Promise.resolve([]))
}

exports.uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

exports.uuidv4_crypto = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

exports.random_string = (length, charset = 'ALPHA', include_lowercase = false) => {
    let chars = ''
    let rand_str = ''

    switch (charset) {
        case 'ALNUM':
        case 'ALPHANUM':
        case 'ALPHANUMERIC':
            chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            if (include_lowercase) {
                chars += chars.replace(/[0-9]/g, '').toLowerCase()
            }
            break
        
        case 'NUM':
        case 'NUMERIC':
            chars = "0123456789"
            break

        case 'ALPHA':
        default:
            chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            if (include_lowercase) {
                chars += chars.toLowerCase()
            }
            break
    }

    for (let i = 0; i < length; i++) {
        rand_str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return rand_str;
};

exports.file_checksum = async (file_path) => {
    return new Promise((resolve, reject) => {
        checksum.file(file_path, {algorithm: 'md5'}, function(checksum_err, checksum) {
            if (checksum_err) {
                reject(checksum_err)
            } else {
                resolve(checksum)
            }
        })
    })
}

// sort alphabetically (if attr is set, sort objects by attr alphabetically)
// string_arr.sort(sortAlpha())
// obj_arr.sort(sortAlpha('name'))
exports.sortAlpha = (attr = false) => {
    return function (a, b) {
        var aValue = attr === false ? a : a[attr].toLowerCase();
        var bValue = attr === false ? b : b[attr].toLowerCase(); 
        return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
    }
}

function normalizeDateTimeString(date_string, time_string = false) {
    let date = normalizeDateString(date_string);
    if (date) {
        let time = normalizeTimeString(time_string)
        if (!time) {
            time = '00:00:00'
        }

        return `${date} ${time}`;
    } else {
        return false
    }
}
exports.normalizeDateTimeString = normalizeDateTimeString

function normalizeDateString(date_string) {
    if (!date_string) {
        return false;
    } else {
        let only_numbers = date_string.replace(/[^\d]/g, '');

        return only_numbers.length == 8 ? `${only_numbers.substr(0, 4)}-${only_numbers.substr(4, 2)}-${only_numbers.substr(6, 2)}` : false
    }
}
exports.normalizeDateString = normalizeDateString

function normalizeTimeString(only_numbers) {
    if (!only_numbers) {
        return false;
    } else {
        only_numbers = only_numbers.replace(/[^\d]/g, '');

        // time is sometimes stored with decimal point so ">= 6" instead of "== 6"
        return only_numbers.length >= 6 ? `${only_numbers.substr(0, 2)}:${only_numbers.substr(2, 2)}:${only_numbers.substr(4, 2)}` : false;
    }
}
exports.normalizeTimeString = normalizeTimeString

// INFO: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
const escapeRegExp = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
}

const multiLetterRegExp = (char) =>
    char !== "" ? new RegExp(`${escapeRegExp(char)}+`, "g") : ""

exports.replaceFactory = (allowRegExp, input, replacedBy = "") => {
    return input
        .replace(allowRegExp, replacedBy)
        .replace(multiLetterRegExp(replacedBy), replacedBy)
}

exports.alNum = (input, replacedBy = "") => {
    const allowRegExp = /[^A-Z0-9]+/gim
    return exports.replaceFactory(allowRegExp, input, replacedBy)
}

exports.alNumDash = (input, replacedBy = "-") => {
    const allowRegExp = /[^A-Z0-9-]+/gim
    return exports.replaceFactory(allowRegExp, input, replacedBy)
}

exports.alNumDashUnderscore = (input, replacedBy = "_") => {
    const allowRegExp = /[^A-Z0-9_-]+/gim
    return exports.replaceFactory(allowRegExp, input, replacedBy)
}

exports.arrayUnique = (arr) => {
    return arr.filter((item, pos) => arr.indexOf(item) === pos)
}
