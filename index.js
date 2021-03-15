const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const comments = getComments();
const objects = getObjects();

function getComments() {
    let res = [];
    const regular_todo = /\/\/ TODO .+/g
    for (let file of files) {
        let answ = file.match(regular_todo);
        if (answ === null)
            continue;
        res = res.concat(answ);
    }
    return res;
}

function getObjects() {
    return comments.map(comment => {
            return {
                importance: getImportance(comment),
                user: getUser(comment),
                date: getDate(comment),
                text: comment
            }
        }
    );
}

function getImportance(comment) {
    return (comment.match('!') || []).length;
}

function getUser(comment) {
    let parts = comment.split(';');
    if (parts === undefined || parts.length !== 3) {
        return undefined;
    }
    return (parts[0].split(' '))[2].toLowerCase();
}

function getDate(comment) {
    let parts = comment.split(':');
    if (parts === undefined || parts.length !== 3) {
        return undefined;
    }
    return Date.parse(parts[1]);
}

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    const args = command.split(' ');
    switch (args[0]) {
        // case 'sort':
        //     switch (args[1]) {
        //         case 'user':
        //             console.log(
        //                 objects.
        //             )
        //     }
        //     break;
        case 'user':
            const user = args[1].toLowerCase();
            console.log(objects
                .filter(obj => obj.user === user)
                .map(obj => obj.text)
                .join('\n'));
            break;
        case 'important':
            console.log(objects
                .filter(obj => obj.importance !== 0)
                .map(obj => obj.text)
                .join('\n'));
            break;
        case 'show':
            console.log(comments);
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}
