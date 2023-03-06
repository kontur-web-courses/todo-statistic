const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    console.log(filePaths);
    return filePaths.map(path => readFile(path));
}

function getAllTodos(fileData) {
    const todos = [];
    const todoRegExp = /\/\/\sTODO\s(.*)/g;
    fileData.split('\n').forEach((line, index) => {
        const match = todoRegExp.exec(line);
        if (match) {
            todos.push(match[1]);
        }
    });
    return todos;
}

function getTodosFromFiles(fileDatas) {
    const todos = [];
    fileDatas.forEach(fileData => {
        todos.push(...getAllTodos(fileData));
    });
    return todos;
}

function extractFormattedTodos(todos) {
    const formattedTodos = [];
    todos.forEach(todo => {
        const [user, date, text] = todo.split(';');
        if (user && date && text) {
            formattedTodos.push({
                user: user.trim().toLowerCase(),
                date: Date.parse(date.trim()),
                text: text.trim()
            });
        } else {
            formattedTodos.push({
                user: undefined,
                date: undefined,
                text: todo
            });
        }
    });
    return formattedTodos;
}

function readFormattedTodos(files) {
    const todos = getTodosFromFiles(files);
    return extractFormattedTodos(todos);
}

function printFormattedTodos(todos) {
    const maxUserLength = todos.reduce((max, todo) => {
        return Math.max(max, todo.user ? todo.user.length : 0);
    }, 0);
    const maxDateLength = todos.reduce((max, todo) => {
        return Math.max(max, todo.date ? todo.date.toString().length : 0);
    }, 0);

    todos.forEach(todo => {
        const user = todo.user || '';
        const date = todo.date || '';
        let text = todo.text;
        const importance = todo.text.includes('!') ? '!' : ' ';
        if (text.length > 50) {
            text = text.slice(0, 50 - 3) + '...';
        }
        console.log(`${importance} | ${user.padEnd(maxUserLength)} | ${date.toString().padEnd(maxDateLength)} | ${text}`);
    });
}

function processCommand(command) {
    const commandName = command.split(' ')[0];
    const args = command.slice(commandName.length + 1);
    switch (commandName) {
        case 'exit':
            process.exit(0);
            break;
        case 'show': {
            const todos = readFormattedTodos(files);
            printFormattedTodos(todos);
            break;
        }
        case 'important': {
            const todos = readFormattedTodos(files);
            const importantTodos = todos.filter(todo => todo.text.includes('!'));
            printFormattedTodos(importantTodos);
            break;
        }
        case 'user': {
            const user = args.toLowerCase();
            const todos = readFormattedTodos(files);
            const usersTodos = todos.filter(todo => todo.user && todo.user === user);
            printFormattedTodos(usersTodos);
            break;
        }
        case 'sort': {
            const sortType = args.toLowerCase();
            const todos = readFormattedTodos(files);
            switch (sortType) {
                case 'importance': {
                    const important = todos.filter(todo => todo.text.includes('!'));
                    const notImportant = todos.filter(todo => !todo.text.includes('!'));
                    printFormattedTodos(important.concat(notImportant));
                    break;
                }
                case 'user': {
                    const unnamed = [];
                    const userGroups = {};
                    todos.forEach(todo => {
                        if (todo.user) {
                            if (!userGroups[todo.user]) {
                                userGroups[todo.user] = [];
                            }
                            userGroups[todo.user].push(todo);
                        } else {
                            unnamed.push(todo);
                        }
                    });

                    const combined = [];
                    Object.keys(userGroups).forEach(user => {
                        combined.concat(userGroups[user]);
                    });
                    combined.concat(unnamed);

                    printFormattedTodos(combined);
                    break;
                }
                case 'date': {
                    const groupByDate = groupBy("date");
                    const groups = groupByDate(formattedTodos);
                    console.log(groups);
                }
            }
            break;
        }
        case 'date': {
            // date format: yyyy[-mm[-dd]]
            const date = Date.parse(args);
            const todos = readFormattedTodos(files);
            const afterDateTodos = todos.filter(todo => todo.date && todo.date >= date);
            printFormattedTodos(afterDateTodos);
            break;
        }
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!