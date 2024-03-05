const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

// TODO you can do it!
function getTODOComments() {
    const PATTERN = /\/\/(\s?)[tT][oO][dD][oO][\s:].+/g;
    return files.join('').match(PATTERN);
}

function showTodoComments() {
    console.log(getTODOComments()?.join('\n'));
}

function showTodoImportantComments() {
    console.log(getTODOComments());
    console.log(getTODOComments().filter(com => com.at(-1) === '!')?.join('\n'));
}

function showTodoUserComments(name) {
    console.log(getTODOComments().filter(com => {
        let s = com.match(/\/\/(\s?)[tT][oO][dD][oO][\s:](.+?);\s*(.+?);/);
        return s !== null && s[2].toLowerCase() === name.toLowerCase();
    })?.join('\n'));
}

function showSortComments(argSort) {
    switch (argSort) {
        case 'importance':
            showSortImportanceComments();
            break;
        case 'user':
            showSortUserComments();
            break;
        case 'date':
            showSortDateComments();
            break;
        default:
            console.log(`there is no sorting by parameter ${argSort}`)
    }
}

function showSortImportanceComments() {
    console.log(getTODOComments()
        .sort((com1, com2) => com2.split('').filter(ch => ch === '!').length -
            com1.split('').filter(ch => ch === '!').length)?.join('\n'));
}

function showSortUserComments() {
    console.log(getTODOComments()
        .sort((com1, com2) => {
            const s1 = com1.match(/\/\/(\s?)[tT][oO][dD][oO][\s:](.+?);\s*(.+?);\s*/);
            const s2 = com2.match(/\/\/(\s?)[tT][oO][dD][oO][\s:](.+?);\s*(.+?);\s*/);
            if (s1 === null) {
                return s2 !== null ? 1 : -1;
            } else if (s2 !== null) {
                return s1[2].toLowerCase() > s2[2].toLowerCase() ? 1 : -1;
            }
            return 1;
        })?.join('\n'));
}

function showSortDateComments() {
    console.log(getTODOComments()
        .sort((com1, com2) => {
            const s1 = com1.match(/\/\/(\s?)[tT][oO][dD][oO][\s:](.+?);\s*(.+?);\s*/);
            const s2 = com2.match(/\/\/(\s?)[tT][oO][dD][oO][\s:](.+?);\s*(.+?);\s*/);
            if (s1 === null) {
                return s2 !== null ? 1 : -1
            } else if (s2 !== null) {
                return s1[3].toLowerCase() < s2[3].toLowerCase() ? 1 : -1;
            }
            return 1;
        })?.join('\n'));
}

function showDateCommand(date) {
    console.log(getTODOComments().filter(com => {
        const s = com.match(/\/\/(\s?)[tT][oO][dD][oO][\s:](.+?);\s*(.+?);\s*/);
        return s !== null ? s[3] > date : false;
    })?.join('\n'));
}

function processCommand(command) {
    const args = command.split(' ');
    switch (args[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showTodoComments();
            break;
        case 'important':
            showTodoImportantComments();
            break;
        case 'user':
            showTodoUserComments(args[1]);
            break;
        case 'sort':
            showSortComments(args[1]);
            break;
        case 'date':
            showDateCommand(args[1]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}