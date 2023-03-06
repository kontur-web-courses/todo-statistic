const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos() {
    const re = new RegExp('\\/\\/\\sTODO\\s(?<command>.+)')
    const todoComments = [];
    for (const file of getFiles()) {
        for (const line of file.split('\n')) {
            if (!re.test(line)){
                continue;
            }

            const { groups: { command } } = re.exec(line);
            todoComments.push(command);
        }
    }

    return todoComments;
}

function getImportant() {
    const re = new RegExp('.+?!+');
    const important = [];
    for (const comment of getTodos()) {
        if (re.test(comment)) {
            important.push(comment);
        }
    }
    return important;
}

function getFormatted() {
    const re = new RegExp('(?<name>.+?);\\s(?<date>.+?);\\s(?<question>.+)');
    const formatted = [];
    for (const comment of getTodos()) {
        if (!re.test(comment)) {
            continue;
        }
        const { groups } = re.exec(comment);
        const obj = new {
            groups: groups,
            comment: comment
        }
        formatted.push(obj);
    }
    return formatted;
}

function getTodosByUser(userName) {
    return getFormatted()
        .filter(o => o.groups.name.toLowerCase() === userName.toLowerCase())
        .map(o => o.comment);
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
