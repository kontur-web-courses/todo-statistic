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
        default:
            console.log('wrong command123');
            break;
    }
}

// TODO you can do it!
