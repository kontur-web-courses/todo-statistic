const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const commentStart = "/" + "/ TODO "
const importanceSign = "!";
const regex = /(?<user>.+?);\s*(?<date>\d{4}-\d{2}-\d{2});\s*(?<comment>.+)/;

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function showSortedBy(key) {
    const sorters = {
        importance: sortByImportance,
        user: sortByUser,
        //date: sortByDate
    }

    for (const comment of sorters[key]()) {
        console.log(comment);
    }
}

function sortByImportance() {
    const comments = getCommentLines();
    comments.sort(function (f, s) {return s.replace(/[^!]/g, '').length - f.replace(/[^!]/g, '').length});
    return comments;
}

function sortByUser() {
    const comments = getCommentLines();
    const commentsByUser = new Map();
    commentsByUser.set('', [])
    for (const comment of comments) {
        const regexUser = regex.exec(comment);
        if (regexUser !== null) {
            const username = regexUser.groups.user.toLowerCase();
            if (!commentsByUser.has(username)) {
                commentsByUser.set(username, []);
            }
            commentsByUser.get(username).push(comment);
        } else {
            commentsByUser.get('').push(comment);
        }
    }
    let sorted = [];
    for (const [user, userComments] of commentsByUser) {
        if (user !== '') {
            sorted = sorted.concat(userComments);
        }
    }
    return sorted.concat(commentsByUser.get(''));
}

function processCommand(command) {
    if (command === 'exit') {
        process.exit(0);
    } else if (command === 'show') {
        showAllComments();
    } else if (command === 'important') {
        showImportant();
    } else if (command.startsWith('user ')) {
        showComments(getCommentsByUser(command.split(' ')[1]));
    } else if (command.startsWith('sort ')) {
        showSortedBy(command.split(' ')[1]);
    } else {
        console.log('wrong command');
    }
}

function showComments(comments) {
    for (const comment of comments) {
        console.log(comment);
    }
}

function getCommentLines() {
    const comments = [];
    const files = getFiles();
    for (const data of files) {
        for (const line of data.split("\n")) {
            const pos = line.indexOf(commentStart);
            if (pos === -1) {
                continue;
            }
            comments.push(line.slice(pos + commentStart.length));
        }
    }
    return comments;
}

function showAllComments() {
    for (const comment of getCommentLines()) {
        console.log(comment);
    }
}

function showImportant() {
    for (const comment of getCommentLines().filter(function (c) {return c.includes(importanceSign)})) {
            console.log(comment);
    }
}

function getCommentsByUser(username) {
    const lowerCaseUser = username.toLowerCase();
    const comments = []
    for (const comment of getCommentLines()) {
        const matchComment = regex.exec(comment);
        if (matchComment === null) {
            continue;
        }
        if (matchComment.groups.user.toLowerCase() === lowerCaseUser) {
            comments.push(comment);
        }
    }
    return comments;
}


// (?<user>.+?);\s*(?<date>\d{4}\-\d{2}\-\d{2});\s*(?<comment>.+)
// TODO you can do it!
