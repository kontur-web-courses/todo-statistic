const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
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
                date: new Date(date.trim()),
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
    const withFormattedDate = todos.map(todo => {
        if (todo.date) {
            return {
                ...todo,
                date: new Date(todo.date).toISOString().slice(0, 10)
            };
        }
        else {
            return {
                ...todo,
                date: ''
            };
        }
    })
    const maxUserLength = withFormattedDate.reduce((max, todo) => {
        return Math.max(max, todo.user ? todo.user.length : 0);
    }, 4);
    const maxDateLength = withFormattedDate.reduce((max, todo) => {
        return Math.max(max, todo.date.length);
    }, 4);
    let maxTextLength = withFormattedDate.reduce((max, todo) => {
        return Math.max(max, todo.text.length);
    }, 6);
    if (maxTextLength > 50) {
        maxTextLength = 50;
    }

    const header = ` ! | user${' '.repeat(maxUserLength - 4)} | date${' '.repeat(maxDateLength - 4)} | comment`;
    console.log(header);
    console.log('-'.repeat(header.length + maxTextLength - 'comment'.length + 1));

    withFormattedDate.forEach(todo => {
        const user = todo.user || '';
        let text = todo.text;
        const importance = todo.text.includes('!') ? '!' : ' ';
        if (text.length > 50) {
            text = text.slice(0, 50 - 3) + '...';
        }

        console.log(` ${importance} | ${user.padEnd(maxUserLength)} | ${todo.date.padEnd(maxDateLength)} | ${text}`);
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

                    let combined = [];
                    Object.keys(userGroups).forEach(user => {
                        combined = combined.concat(userGroups[user]);
                    });
                    printFormattedTodos(combined.concat(unnamed));
                    break;
                }
                case 'date': {
                    const todos = readFormattedTodos(files);
                    // Sort todos by date
                    const sorted = todos.sort((a, b) => {
                        if (!a.date && !b.date) {
                            return 0;
                        }
                        if (!a.date) {
                            return 1;
                        }
                        if (!b.date) {
                            return -1;
                        }
                        return b.date - a.date;
                    });

                    printFormattedTodos(sorted);
                    break;
                }
            }
            break;
        }
        case 'date': {
            const date = new Date(args);
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