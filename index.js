const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

const selectors = new Map([
    ['name', function (o) { return o.groups.name }],
    ['date', function (o) { return new Date(o.groups.date) }],
    ['importance', function (o) { return getImportance(o.comment) }]
]);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos() {
    const re = new RegExp('\\/\\/\\sTODO\\s(?<command>.+)')
    const todoComments = [];
    for (const file of files) {
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

function getImportance(line) {
    let marks = 0;
    for (const sym of line) {
        if (sym === '!') {
            marks += 1;
        }
    }
    return marks;
}


function sortBy(key) {
    const formatted = getFormatted();
    const selector = selectors.get(key);
    return formatted.sort((a, b) => {
        return selector(a) > selector(b) ? 1 : -1;
    }).map(o => o.comment);
}


function getFormatted() {
    const re = new RegExp('(?<name>.+?);\\s(?<date>.+?);\\s(?<question>.+)');
    const formatted = [];
    for (const comment of getTodos()) {
        if (!re.test(comment)) {
            continue;
        }
        const { groups } = re.exec(comment);
        const obj = {
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
    const args = command.split(' ');
    switch (args[0]) {
        case 'user':
            console.log(getTodosByUser(args[1]));
            break;

        case 'important':
            console.log(getImportant());
            break;

        case 'show':
            console.log(getTodos());
            break;

        case 'exit':
            process.exit(0);
            break;

        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
