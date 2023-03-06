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

function groupBy(key) {
    return function group(array) {
        return array.reduce((acc, obj) => {
            const property = obj[key];
            acc[property] = acc[property] || [];
            acc[property].push(obj);
            return acc;
        }, {});
    };
}

function extractFormattedTodos(todos) {
    const formattedTodos = [];
    const regex = /(.+?); (.*?); (.*)/g;
    todos.forEach(todo => {
        const match = regex.exec(todo);
        console.log(todo);
        if (match) {
            formattedTodos.push({
                user: match[1].toLowerCase(),
                date: match[2],
                text: match[3]
            });
        }
    });
    return formattedTodos;
}

function processCommand(command) {
    const [commandName, ...args] = command.split(' ');
    switch (commandName) {
        case 'exit':
            process.exit(0);
            break;
        case 'show': {
            const todos = getTodosFromFiles(files);
            todos.forEach(todo => {
                console.log(todo);
            });
            break;
        }
        case 'important': {
            const todos = getTodosFromFiles(files);
            todos.forEach(todo => {
                if (todo.includes('!')) {
                    console.log(todo);
                }
            });
            break;
        }
        case 'user': {
            const user = args[0].toLowerCase();
            const todos = getTodosFromFiles(files);
            const formattedTodos = extractFormattedTodos(todos);
            formattedTodos.forEach(todo => {
                if (todo.user === user) {
                    console.log(todo.text);
                }
            });
            break;
        }
        case 'sort': {
            const sort_type = args.toLowerCase();
            switch (sort_type) {
                case 'importance': {
                    const todos = getTodosFromFiles(files);
                    const formattedTodos = extractFormattedTodos(todos);
                    formattedTodos.forEach(todo => {
                        if (todo.includes('!')) {
                            console.log(todo.text);
                        }
                    });
                    formattedTodos.forEach(todo => {
                        if (!todo.includes('!')) {
                            console.log(todo.text);
                        }
                    });
                    break;
                }
                case 'user': {
                    const todos = getTodosFromFiles(files);
                    const formattedTodos = extractFormattedTodos(todos);
                    const groupByUser = groupBy("user");
                    const groups = groupByUser(formattedTodos);
                    groups.forEach(group => {
                        group.forEach(todo => {
                            console.log(todo.text);
                        })
                    });
                    break;
                }
                case 'date': {
                    const todos = getTodosFromFiles(files);
                    const formattedTodos = extractFormattedTodos(todos);
                    const groupByDate = groupBy("date");
                    const groups = groupByDate(formattedTodos);
                    formattedTodos.sort().forEach(todo => {
                            console.log(todo.text);
                    });
                    break;
                }

            }
        }
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!