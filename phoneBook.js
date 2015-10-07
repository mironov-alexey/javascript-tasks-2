'use strict';
Object.values = obj => Object.keys(obj).map(key => obj[key]);
var phoneRegExp = /^(\+?\d{1,2})?\s?(\(\d{3}\)|\d{3})\s?\d{3}(\-\d\-|\s\d\s|\d)\d{3}$/;
var emailRegExp = /^([a-z0-9._-])*@([a-zа-я0-9_-]+\.)+([a-zа-я]+)$/;
var phoneBook = {};

function isPhoneValid(phone) {
    return phoneRegExp.test(phone);
}

function isEmailValid(email) {

    return emailRegExp.test(email);
}

module.exports.add = function add(name, phone, email) {
    if (!(typeof name === 'string' && typeof phone === 'string' && typeof email === 'string')) {
        return;
    }
    var lowerEmail = email.toLocaleLowerCase();
    var key = [name, phone, email].join(' ');
    if (isPhoneValid(phone) && isEmailValid(lowerEmail)) {
        phoneBook[key] = {name: name, phone: phone, email: email};
    }
};

module.exports.find = function find(query) {
    if (query) {
        Object.values(phoneBook).forEach(function (record) {
            var found = false;
            Object.keys(record).forEach(function (key) {
                if (found) {
                    return;
                }
                if (record[key].includes(query)) {
                    console.log([record.name, record.phone, record.email].join(', '));
                    found = true;
                }
            });
        });
    } else {
        Object.values(phoneBook).forEach(function (record) {
            console.log([record.name, record.phone, record.email].join(', '));
        });
    }
};

module.exports.remove = function remove(query) {
    var removedContacts = 0;
    Object.keys(phoneBook).forEach(function (recordKey) {
        var removed = false;
        var record = phoneBook[recordKey];
        Object.keys(record).forEach(function (key) {
            if (!removed && record[key].includes(query)) {
                delete phoneBook[recordKey];
                removedContacts++;
            };
        });
    });
    if (removedContacts === 1) {
        console.log('Removed 1 contact');
    } else {
        if (removedContacts > 0) {
            console.log('Removed ' + removedContacts + ' contacts');
        } else {
            console.log('No contact wasn\'t removed');
        }
    }
};

module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    data.split('\r\n').forEach(function (line) {
        var splittedLine = line.split(';');
        module.exports.add(splittedLine[0], splittedLine[1], splittedLine[2]);
    });
};

String.prototype.repeat = function (n) {
    var r = '';
    if (typeof n == 'number') {
        for (var i = 1; i <= n; i++) {
            r += this;
        }
    }
    return r;
};

function getPrintLineFunction(maxNameLength, maxPhoneLength, maxEmailLength) {
    return function (first, second, third) {
        console.log('│' + ' '.repeat(Math.ceil((maxNameLength - first.length) / 2)) +
                    first + ' '.repeat(Math.floor((maxNameLength - first.length) / 3)) + '│' +
                    ' '.repeat(Math.ceil((maxPhoneLength - second.length) / 2)) +
                    second +
                    ' '.repeat(Math.floor((maxPhoneLength - second.length) / 2)) + '║' +
                    ' '.repeat(Math.ceil((maxEmailLength - third.length) / 2)) + third +
                    ' '.repeat(Math.floor((maxEmailLength - third.length) / 2)) +
                    '│'
                    );
    };
}

module.exports.showTable = function showTable(filename) {
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
    console.log('┌' + '─'.repeat(maxNameLength) + '┬' + '─'.repeat(maxPhoneLength) + '╥' +
        '─'.repeat(maxEmailLength) + '┐');
    printLine('Name', 'Phone number', 'Email');
    Object.values(phoneBook).forEach(function (record) {
        console.log(
            '├' + '─'.repeat(maxNameLength) + '┼' + '─'.repeat(maxPhoneLength) +
            '╫' + '─'.repeat(maxEmailLength) + '┤');
        printLine(record.name, record.phone, record.email);
    });
    console.log('└' + '─'.repeat(maxNameLength) + '┴' +
                '─'.repeat(maxPhoneLength) + '╨' + '─'.repeat(maxEmailLength) + '┘');
};
