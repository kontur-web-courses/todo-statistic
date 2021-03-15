const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getComments() {
    let files = getFiles();
    let comments = [];
    for (let file of files) {
        for (let line of file.split('\r\n')) {
            let idx = line.indexOf('// TODO ');
            if (idx !== -1) {
                comments.push(line.substring(idx));
            }
        }
    }
    return comments;
}

function getImportantComments() {
    let comments = getComments();
    let importantComments = [];
    for (let comment of comments) {
        if (comment.indexOf('!') !== -1) {
            importantComments.push(comment);
        }
    }
    return importantComments;
}

function getUserComments(name) {
    let comments = getComments();
    let userComments = [];
    for (let comment of comments) {
        if (comment.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
            userComments.push(comment);
        }
    }
    return userComments;
}

function getSortedCommentsByImportance() {
    let importantComments = [];
    let otherComments = [];
    let comments = getComments();
    for (let comment of comments) {
        if (comment.indexOf('!') !== -1) {
            importantComments.push(comment);
        } else {
            otherComments.push(comment);
        }
    }
    importantComments.sort(function (a, b) {
        return getImportanceCount(b) - getImportanceCount(a);
    });
    return importantComments.concat(otherComments);
}

function getImportanceCount(line) {
    return line.match(/!/g).length;
}

function getSortedCommentsByUser() {
    let users = {};
    let otherComments = [];
    let comments = getComments();
    for (let comment of comments) {
        let idx = comment.match(/;/g);
        if (idx === null || idx.length !== 2) {
            otherComments.push(comment);
            continue;
        }
        let name = comment.substring(8, comment.indexOf(';')).toLowerCase();
        if (!(name in users)) {
            users[name] = [];
        }
        users[name].push(comment);
    }
    let arr = Object.keys(users);
    arr.sort();
    let result = [];
    for (let i=0; i < arr.length; i++) {
         result = result.concat(users[arr[i]]);
    }
    return result.concat(otherComments);
}

function getSortedCommentsByDate() {
    let comments = getComments();
    comments.sort(function (a, b) {
        let m1 = a.match(/\/\/ TODO (.+?);\s*(.+?);\s*/);
        let m2 = b.match(/\/\/ TODO (.+?);\s*(.+?);\s*/);
        if (m1 === null) {
            return m2 !== null ? m2[2].length : -1;
        } else if (m2 !== null) {
            return m1[2].toLowerCase() < m2[2].toLowerCase() ? m1.length : -1;
        } else {
            return m1[2].length;
        }
    });
    return comments;
}

function getCommentsAfterDate(date) {
    let d = date.split('-');
    if (d.length === 1) {
        date += '-01';
    }
    let time = new Date(date);
    let comments = getComments();
    let result = [];
    for (let comment of comments) {
        let m1 = comment.match(/\/\/ TODO (.+?);\s*(.+?);\s*/);
        if (m1 !== null) {
            if (new Date(m1[2]) > time) {
                result.push(comment);
            }
        }
    }
    return result;
}

function commentToString(comment) {
    let imp = comment.indexOf('!');
    let importance = '   ';
    if (imp !== -1) {
        importance = '!  ';
    }
    let dateName = comment.match(/\/\/ TODO (.+?);\s*(.+?);\s*(.+?)/);
    let name = ' '.padEnd(14);
    let date = ' '.padEnd(14);
    let com;
    if (dateName !== null) {
        let n = dateName[1].trim();
        let d = dateName[2].trim();
        let c = comment.substring(comment.lastIndexOf(';') + 1).trim();
        if (n.length > 10) {
            n = n.substr(0, 9) + '…';
        }
        if (d.length > 10) {
            d = d.substr(0, 9) + '…';
        }
        if (c.length > 50) {
            c = c.substr(0, 49) + '…';
        }
        name = `  ${n.padEnd(10)}  `;
        date = `  ${d.padEnd(10)}  `;
        com = `  ${c.padEnd(50)}  `;
    } else {
        let c = comment.substring(8).trim();
        if (c.length > 50) {
            c = c.substr(0, 49) + '…';
        }
        com = `  ${c.padEnd(50)}  `;
    }
    return `${importance}|${name}|${date}|${com}`;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let comment of getComments()) {
                console.log(commentToString(comment));
            }
            break;
        case 'important':
            for (let comment of getImportantComments()) {
                console.log(commentToString(comment));
            }
            break;
        case `user ${name = command.split(' ')[1]}`:
            for (let comment of getUserComments(name)) {
                console.log(commentToString(comment));
            }
            break;
        case `sort ${arg = command.split(' ')[1]}`:
            if (arg === 'importance') {
                for (let comment of getSortedCommentsByImportance()) {
                    console.log(commentToString(comment));
                }
            } else if (arg === 'user') {
                for (let comment of getSortedCommentsByUser()) {
                    console.log(commentToString(comment));
                }
            } else if (arg === 'date') {
                for (let comment of getSortedCommentsByDate()) {
                    console.log(commentToString(comment));
                }
            } else {
                console.log('wrong command');
            }
            break;
        case `date ${date = command.split(' ')[1]}`:
            for (let comment of getCommentsAfterDate(date)) {
                console.log(commentToString(comment));
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
