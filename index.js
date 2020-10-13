const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const path = require('path')

const commandHandler = {
    'exit': handleExit,
    'show': handleShow,
    'important': handleImportant,
    'user': handleUser,
    'sort': handleSort,
    'date': handleDate
}

const files = getFiles();

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(localPath => { return { name: path.basename(localPath), text: readFile(localPath) } });
}

console.log('Please, write your command!');
readLine(processCommand);

function processCommand(commandLine) {
    const [command, ...args] = commandLine.split(' ');
    const handler = commandHandler[command];
    if (handler) {
        handler(args);
    } else {
        console.log('wrong command');
    }
}

function handleExit() {
    process.exit(0);
}

function handleShow() {
    printTable(parseAllTodos());
}

function handleImportant() {
    printTable(parseAllTodos().filter(todo => todo.importance > 0));
}

function handleUser(args) {
    if (!args[0]) {
        console.log('wrong command')
        return
    }

    let user = args[0].trim().toLowerCase();
    printTable(parseAllTodos().filter(todo => todo.user && todo.user.toLowerCase() === user))
}

function handleSort(args) {
    if (!args[0]) {
        console.log('wrong command')
        return;
    }

    let compareType = compare(args[0].trim())
    printTable(parseAllTodos().sort(compareType));
}

function handleDate(args) {
    if (!args[0]) {
        console.log('wrong command')
        return;
    }

    let date = new Date(args[0].trim());
    printTable(parseAllTodos().sort(compare('date'))
        .reverse()
        .filter(todo => todo.date && todo.date > date));
}

function compare(compareType) {
    switch (compareType) {
        case 'importance':
            return (a, b) => b.importance - a.importance;
        case 'user':
            return (a, b) => b.user.localeCompare(a.user);
        case 'date':
            return (a, b) => b.date - a.date;
    }
}

function getAllTodos() {
    return files
        .map(file => file.text.match(/\/\/.*todo.*/gi))
        .flat(Infinity);
    //     .filter(x => x)
    //     .sort((a, b) => countItem(b, '!') - countItem(a, '!'));
}

function parseAllTodos() {
    let parsedTodos = [];

    for (let todo of getAllTodos()) {
        parsedTodos.push(parseTodo(todo, this.name));
    }

    return parsedTodos;
}

function parseTodo(todoString, fileName) {
    todoString = todoString.replace(/\/\/.*todo\s*:*\s*/gi, '');
    let parts = todoString.split('; ');

    let importance = 0;
    let user = '';
    let date = null;
    let comment;

    if (parts.length >= 3) {
        user = parts[0];
        date = new Date(parts[1]);
        comment = parts[2];
    } else if (parts.length === 2) {
        user = parts[0];
        comment = parts[2];
    } else {
        comment = parts[0];
    }

    if (isImportant(todoString)) {
        importance = countItem(todoString, '!')
    }

    return { importance, user, date, comment, fileName };
}

function countItem(string, item) {
    return string.split('').reduce((p, i) => i === item ? p + 1 : p, 0);
}

function isImportant(string) {
    return string.includes('!');
}

function formatDate(date) {
    let day = String(date.getDate());
    let month = String(date.getMonth() + 1);
    let year = String(date.getFullYear());

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return `${year}-${month}-${day}`
}

function printTable(todos) {
    let rows = [];
    const header = ['!', 'user', 'date', 'comment', 'file'];

    rows.push(header);
    for (let todo of todos) {
        rows.push(getInfo(todo));
    }

    const maxSizes = [1, 10, 10, 50, 20];
    const rowWidth = maxSizes.reduce((a, b) => a + b) + 5 * maxSizes.length - 2;

    printRow(rows[0], maxSizes)
    console.log('-'.repeat(rowWidth));

    for (let i = 1; i < rows.length; i++) {
        printRow(rows[i], maxSizes)
    }

    console.log('-'.repeat(rowWidth));
}

function getInfo(todo) {
    return [
        todo.importance > 0 ? '!' : '',
        todo.user || '',
        todo.date !== null ? formatDate(todo.date) : '',
        todo.comment || '',
        todo.file || ''
    ];
}

function convertArrayToObject(array) {
    return {
        importance: array[0],
        user: array[1],
        date: array[2],
        comment: array[3],
        file: array[4]
    };
}

function printRow(row, sizes) {
    row = convertArrayToObject(row);
    sizes = convertArrayToObject(sizes);

    if (row.comment.length >= sizes.comment) {
        row.comment = row.comment.substring(0, sizes.comment - 3) + '...';
    }

    if (row.user.length >= sizes.user) {
        row.user = row.user.substring(0, sizes.user - 3) + '...';
    }

    console.log(row.importance.padEnd(sizes.importance) + '  |  ' +
        row.user.padEnd(sizes.user) + '  |  ' +
        row.date.padEnd(sizes.date) + '  |  ' +
        row.comment.padEnd(sizes.comment) + '  |  ' +
        row.file.padEnd(sizes.file) + '  |  ');

}