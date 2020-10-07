const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const path = require('path');

const files = getFiles();

const TODOS = getAllTodos(files);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(filePath => {
        return {
            fileName: path.win32.basename(filePath),
            data: readFile(filePath),
        }
    });
}

function processCommand(command) {
    let com = '';
    switch (command) {
        case 'exit':
            com = command;
            process.exit(0);
            break;
        case 'show':
            printTable(TODOS);
                // .map(todo => formatTodo(todo)));
            break;
        case 'important':
            printTable(TODOS
                .filter(todo => todo.importance > 0));
                // .map(todo => formatTodo(todo)));
            break;
        case command.match(/^user [a-zа-я0-9_\s]+$/g) ? command : null:
            const user = command.replace('user ', '').trim().toLowerCase();
            printTable(TODOS
                .filter(todo => todo.user && todo.user.toLowerCase() === user));
                // .map(todo => formatTodo(todo)));
            break;
        case command.match(/^sort importance$/g) ? command : null:
            printTable(TODOS
                .sort((a, b) => b.importance - a.importance));
                // .map(todo => formatTodo(todo)));
            break;
        case command.match(/^sort user$/g) ? command : null:
            printTable(TODOS
                .sort((a, b) => (a.user && b.user) ? (a.user).localeCompare(b.user, 'ru', {caseFirst: 'upper'}) :
                    a.user ? -1 : b.user ? 1 : 0));
                // .map(todo => formatTodo(todo)));
            break;
        case command.match(/^sort date$/g) ? command : null:
            printTable(TODOS
                .sort((a, b) => {
                    return (a.date && b.date) ? b.date.date - a.date.date :
                        a.date ? -1 : b.date ? 1 : 0;
                }));
                // .map(todo => formatTodo(todo)));
            break;
        case command.match(/^((date [0-9]{4}-[0-9]{2}-[0-9]{2}|date [0-9]{4}-[0-9]{2})|date [0-9]{4})$/g) ? command : null:
            const date = new Date(command.match(/(([0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{4}-[0-9]{2})|[0-9]{4})$/g)[0]);
            printTable(TODOS
                .filter(todo => todo.date && todo.date.date > date));
                // .map(todo => formatTodo(todo)));
            break;
        default:
            console.log('wrong command');
            break;
    }
}
//toDo:Alex;2020-10;добавить writeLine!!!

// TODO you can do it!
// TODO ; 2016; добавить writeLine!!!
// TODO ; ; добавить writeLine!!!

function getAllTodos(files) {
    let todos = [];
    files.forEach(file => {
        const newTodo = file.data.match(/\/\/\s?todo(\s|:).+/gi).map(el => {
            return {
                fileName: file.fileName,
                comment: el,
            }
        });
        todos.push(...newTodo);
    });
    todos = todos.map(todo => {
        const arr = todo.comment.replace(/\/\/\s?todo(\s|:)/gi, '').split(';').map(e => e.trim());
        let newTodo = {};
        newTodo.fileName = todo.fileName;
        const importance = todo.comment.match(/!/g) || [];
        newTodo.importance = importance.length;
        if (arr.length === 1) {
            newTodo.text = arr[0].trim();
        } else if (arr.length === 3) {
            const user = arr[0].trim();
            newTodo.user = user && user.length > 0 ? user : null;
            const dateAsText = arr[1].trim();
            const dateAssArray = dateAsText.split('-');
            const date = new Date(dateAsText);
            newTodo.date = {
                date: date,
                year: dateAssArray[0] ? Number(dateAssArray[0]) : null,
                month: dateAssArray[1] ? Number(dateAssArray[1]) : null,
                day: dateAssArray[2] ? Number(dateAssArray[2]) : null,
            };
            newTodo.text = arr[2].trim();
        }
        return formatTodo(newTodo);
    });
    console.log(todos, todos.length);
    return todos;
}

function formatTodo(todo) {
    const ending = '…';
    const importance = todo.importance > 0 ? '!' : '';

    let user = (todo.user ? todo.user : '');
    if (user.length > 10) {
        user = trimString(user, ending, 0, 10);
    }

    let date = '';
    if (todo.date) {
        if (todo.date.day && todo.date.month && todo.date.year) {
            date = `${todo.date.year.toString().padStart(4, '0')}-${todo.date.month.toString().padStart(2, '0')}-${todo.date.day.toString().padStart(2, '0')}`;
        } else if (todo.date.month && todo.date.year) {
            date = `${todo.date.year.toString().padStart(4, '0')}-${todo.date.month.toString().padStart(2, '0')}`;
        } else if (todo.date.year) {
            date = `${todo.date.year.toString().padStart(4, '0')}`;
        }
    }

    const text = todo.text.length > 50 ? trimString(todo.text, ending, 0, 50) : todo.text;

    const fileName = todo.fileName.length > 10 ? trimString(todo.fileName, ending, 0, 10) : todo.fileName;

    return {
        ...todo,
        fieldsForPrint: {
            importance,
            user,
            date,
            text,
            fileName,
        },
        fieldSize: {
            importance: importance.length,
            user: user.length,
            date: date.length,
            text: text.length,
            fileName: fileName.length,
        }
    }
}

function trimString(str, ending, start, length) {
    return str.slice(start, length - ending.length) + ending;
}

function printTable(todos) {
    const head = formatTodo({
        importance: 1,
        user: 'user',
        date: {year: 'date'},
        text: 'comment',
        fileName: 'file',
    });
    const [maxI, maxU, maxD, maxT, maxF] = getMaxLength([head, ...todos]);
    const aggregate = ' ';
    const widthTable = maxI + maxU + maxD + maxT + maxF + 6 + 4 * 5;

    console.log('RESULTS'.padStart(widthTable / 2 + 'RESULTS'.length / 2 - 1, '-').padEnd(widthTable, '-'));
    console.log('-'.repeat(widthTable));
    printRow(
        head.fieldsForPrint.importance.padEnd(maxI, aggregate),
        head.fieldsForPrint.user.padEnd(maxU, aggregate),
        head.fieldsForPrint.date.padEnd(maxD, aggregate),
        head.fieldsForPrint.text.padEnd(maxT, aggregate),
        head.fieldsForPrint.fileName.padEnd(maxF, aggregate)
    )
    console.log('-'.repeat(widthTable));
    if (todos.length > 0)
        todos.forEach(todo => {
            printRow(
                todo.fieldsForPrint.importance.padEnd(maxI, aggregate),
                todo.fieldsForPrint.user.padEnd(maxU, aggregate),
                todo.fieldsForPrint.date.padEnd(maxD, aggregate),
                todo.fieldsForPrint.text.padEnd(maxT, aggregate),
                todo.fieldsForPrint.fileName.padEnd(maxF, aggregate)
            )
        });
    else
        console.log(`|${'NO RESULTS'.padStart(widthTable / 2 + 'NO RESULTS'.length / 2 - 1, ' ').padEnd(widthTable - 2, ' ')}|`);
    console.log('-'.repeat(widthTable));
}

function printRow(importance, user, date, text, fileName) {
    console.log(`|  ${importance}  |  ${user}  |  ${date}  |  ${text}  |  ${fileName}  |`);
}

function getMaxLength(todos, maxImportance = 1, maxUser = 10, maxDate = 10, maxText = 50, maxFileName = 10) {
    let lengthImportance = 0, lengthUser = 0, lengthDate = 0, lengthText = 0, lengthFileName = 0;
    todos.forEach(todo => {
        if (todo.fieldSize.importance > lengthImportance) {
            lengthImportance = todo.fieldSize.importance;
        }
        if (todo.fieldSize.user > lengthUser) {
            lengthUser = todo.fieldSize.user;
        }
        if (todo.fieldSize.date > lengthDate) {
            lengthDate = todo.fieldSize.date;
        }
        if (todo.fieldSize.text > lengthText) {
            lengthText = todo.fieldSize.text;
        }
        if (todo.fieldSize.fileName > lengthFileName) {
            lengthFileName = todo.fieldSize.fileName;
        }
    });
    return [
        lengthImportance <= maxImportance ? lengthImportance : maxImportance,
        lengthUser <= maxUser ? lengthUser : maxUser,
        lengthDate <= maxDate ? lengthDate : maxDate,
        lengthText <= maxText ? lengthText : maxText,
        lengthFileName <= maxFileName ? lengthFileName : maxFileName
    ];
}