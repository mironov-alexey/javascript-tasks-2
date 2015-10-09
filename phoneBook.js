'use strict';
var phoneRegExp = /^(\+?\d{1,2})?\s?(\(\d{3}\)|\d{3})\s?\d{3}(\-\d\-|\s\d\s|\d)\d{3}$/;
var emailRegExp = /^([a-z0-9._-])*@([a-zа-я0-9_-]+\.)+([a-zа-я]+)$/;
var phoneBook = {};

function add(name, phone, email) {
    if (!(typeof name === 'string' && typeof phone === 'string' && typeof email === 'string')) {
        return;
    }
    var lowerEmail = email.toLocaleLowerCase();
    var key = [name, phone, email].join(' ');
    if (phoneRegExp.test(phone) && emailRegExp.test(lowerEmail)) {
        phoneBook[key] = {name: name, phone: phone, email: email};
    }
};

function find(query) {
    Object.keys(phoneBook).forEach(function (recordKey) {
        if (query) {
            if (recordKey.includes(query)) {
                console.log(recordKey);
            }
        } else {
            console.log(recordKey);
        }
    });
};

function remove(query) {
    var removedContacts = 0;
    Object.keys(phoneBook).forEach(function (recordKey) {
        if (recordKey.includes(query)) {
            delete phoneBook[recordKey];
            removedContacts++;
        }
    });
    if (removedContacts > 0) {
        console.log('Removed ' + removedContacts + ' contacts');
    } else {
        console.log('No contact wasn\'t removed');
    }
};

function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    data.split('\r\n').forEach(function (line) {
        var splittedLine = line.split(';');
        module.exports.add(splittedLine[0], splittedLine[1], splittedLine[2]);
    });
};

function concatenate(line, n) {
    var r = '';
    if (typeof n == 'number') {
        for (var i = 1; i <= n; i++) {
            r += line;
        }
    }
    return r;
};

function supplementLineWhiteSpaces(line, desiredLength) {
    while (line.length < desiredLength) {
        line = ' ' + line;
        line = line + ' ';
    }
    if (line.length > desiredLength) {
        line = line.substr(1);
    }
    return line;
}

function getPrintLineFunction(maxNameLength, maxPhoneLength, maxEmailLength) {
    return function (name, phone, email) {
        console.log('│' + supplementLineWhiteSpaces(name, maxNameLength) + '│' +
                    supplementLineWhiteSpaces(phone, maxPhoneLength) + '║' +
                    supplementLineWhiteSpaces(email, maxEmailLength) +
                    '│'
        );
    };
}

function showTable(filename) {
    var maxNameLength = 0;
    var maxEmailLength = 0;
    var maxPhoneLength = 0;
    for (var key in phoneBook) {
        if (phoneBook[key].name.length > maxNameLength) {
            maxNameLength = phoneBook[key].name.length;
        }
        if (phoneBook[key].email.length > maxEmailLength) {
            maxEmailLength = phoneBook[key].email.length;
        }
        if (phoneBook[key].phone.length > maxPhoneLength) {
            maxPhoneLength = phoneBook[key].phone.length;
        }
    }
    var printLine = getPrintLineFunction(maxNameLength, maxPhoneLength, maxEmailLength);
    console.log(
                '┌' + concatenate('─', maxNameLength) +
                '┬' + concatenate('─', maxPhoneLength) + '╥' +
                concatenate('─', maxEmailLength) + '┐'
    );
    printLine('Name', 'Phone number', 'Email');
    var values = Object.keys(phoneBook).map(key => phoneBook[key]);
    values.forEach(function (record) {
        console.log(
                    '├' + concatenate('─', maxNameLength) + '┼' +
                    concatenate('─', maxPhoneLength) +
                    '╫' + concatenate('─', maxEmailLength) + '┤'
        );
        printLine(record.name, record.phone, record.email);
    });
    console.log('└' + concatenate('─', maxNameLength) + '┴' +
                concatenate('─', maxPhoneLength) + '╨' + concatenate('─', maxEmailLength) + '┘');
};

module.exports.showTable = showTable;
module.exports.importFromCsv = importFromCsv;
module.exports.remove = remove;
module.exports.find = find;
module.exports.add = add;
