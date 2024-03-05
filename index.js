const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const comments = [];

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getComments() {
    for (let file of files) {
        const regex = /\/\/\s*[tT][oO][dD][oO]\s*:?([^\n]*)/g;
        const matches = [...file.matchAll(regex)];
        for (const match of matches) {
             comments.push(match[0].toString());
        }
    }
}

function findExclamationIndex(str) {
    return str.includes('!') ? str.indexOf('!') : -1;
}

function findUserIndex(str, user) {
    user = user.toLowerCase()
    str = str.toLowerCase()
    return str.includes(user + ';') ? str.indexOf(user + ';') : -1;
}

function findAllUsers(comments) {
    let users = new Set();
    for (let i = 0; i < comments.length; i++) {
        var todoWithoutSpaces = comments[i].replace(/ /g,'');
        for (var j = 3; j < todoWithoutSpaces.length; j++) {
            if (todoWithoutSpaces.slice(j-3, j+1).toLowerCase() == 'todo') {

                let usernameEnd = todoWithoutSpaces.indexOf(';');
                if (usernameEnd < 0) {
                    break;
                }
                if (todoWithoutSpaces[j + 1] == ':') {
                    users.add(todoWithoutSpaces.slice(j+2, usernameEnd).toLowerCase())
                } else {
                    users.add(todoWithoutSpaces.slice(j+1, usernameEnd).toLowerCase())
                }
            }
        }
    }
    return users;
}


function processCommand(command) {
    getComments();
    let commandParams = command.split(' ');
    let command1 = commandParams[0];
    switch (command1) {
        case 'exit':
            process.exit(0);
            break;
        case 'date':
            const regex = /(\d{4}(?:-\d{2})?(?:-\d{2})?)/;
            const match = command.match(regex);
            if (match) {
                const date = match[1];
                console.log(date);
                let commandDate = new Date(date);

                for (let comment of comments) {
                    const regex2 = /\b(\d{4})-(\d{2})-(\d{2})\b/;
                    let commentDataStr = comment.match(regex2);
                    if (commentDataStr !== null) {
                        let commentDate = new Date(commentDataStr[1]);
                        if (commentDate > commandDate)
                            console.log(comment)
                    }

                }

            }
            break;

        case 'sort':
            if (commandParams[1] === 'date') {


                let arr = comments.sort((a, b) => {
                    if (a.match(/\b(\d{4})-(\d{2})-(\d{2})\b/) === null)
                        return 10000;
                    if (b.match(/\b(\d{4})-(\d{2})-(\d{2})\b/) === null)
                        return 10000;

                    let dateA = new Date(a.match(/\b(\d{4})-(\d{2})-(\d{2})\b/)[0]).getTime();
                    let dateB = new Date(b.match(/\b(\d{4})-(\d{2})-(\d{2})\b/)[0]).getTime();

                    if (dateA > dateB) {
                        return 1;
                    }
                    if (dateA < dateB) {
                        return -1;
                    }
                    if (dateA === dateB) {
                        return 0;
                    }
                } )

                for (let comment of arr)
                    console.log(comment)

                break;
            }
        case 'show':
            for (let comment of comments)
                console.log(comment);
            break;
        case 'important':
            for (let i = 0; i < comments.length; i++) {
                if (findExclamationIndex(comments[i]) >= 0) {
                    console.log(comments[i])
                }
            }
            break;
        case 'user':
            if (commandParams.length === 2) {
                for (let i = 0; i < comments.length; i++) {
                    if (findUserIndex(comments[i], commandParams[1]) >= 0) {
                        console.log(comments[i])
                    }
                }
            } else {
                console.log('No user entered')
            }
            break;
        case 'sort':
            if (commandParams.length === 2) {
                if (commandParams[1] == 'importance') {
                    let exclamationsCounts = [];
                    for (let i = 0; i < comments.length; i++) {
                        exclamationsCounts.push(({'count': comments[i].split('!').length, 'index': i}))
                    }
                    exclamationsCounts.sort((a, b) => b.count - a.count);
                    for (let i = 0; i < exclamationsCounts.length; i++) {
                        console.log(comments[exclamationsCounts[i].index]);
                    }
                }
                if (commandParams[1] == 'user') {
                    let untitled = new Set();
                    let users = findAllUsers(comments);
                    var it = users.values();
                    for (let i = 0; i < users.size; i++) {
                        let usr = it.next()
                        console.log('>>> ' + usr.value)
                        for (let j = 0; j < comments.length; j++) {
                            if (findUserIndex(comments[j].replace(/ /g,'').toLowerCase(), usr.value) >= 0) {
                                console.log(comments[j]);
                            } else if (!(comments[j].includes(';'))) {
                                untitled.add(comments[j]);
                            }
                        }
                    }
                    var it = untitled.values();
                    console.log('>>> UNTITLED')
                    for (let i = 0; i < untitled.size; i++) {
                        console.log(it.next().value)
                    }
                }
                if (commandParams[1] == 'date') {
                    
                }
            } else {
                console.log('No sorting parameter')
            }

            break;
        default:
            console.log('wrong command123');
            break;
    }
}

// TODO you can do it!
