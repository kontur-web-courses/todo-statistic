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

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let comment of getComments()) {
                console.log(comment);
            }
            break;
        case 'important':
            for (let comment of getImportantComments()) {
                console.log(comment);
            }
            break;
        case `user ${name = command.split(' ')[1]}`:
            for (let comment of getUserComments(name)) {
                console.log(comment);
            }
            break;
        case `sort ${arg = command.split(' ')[1]}`:
            if (arg === 'importance') {
                for (let comment of getSortedCommentsByImportance()) {
                    console.log(comment);
                }
            }
            if (arg === 'user') {
                for (let comment of getSortedCommentsByUser()) {
                    console.log(comment);
                }
            }
            if (arg === 'date') {
                for (let comment of getSortedCommentsByDate()) {
                    console.log(comment);
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
