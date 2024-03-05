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
        const regex = /\/\/ TODO (.+?)(?=\r\n|\n|$)/g;
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

function processCommand(command) {
    getComments();
    let commandParams = command.split(' ');
    command = commandParams[0];
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
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
        default:
            console.log('wrong command123');
            break;
    }
}

// TODO you can do it!
