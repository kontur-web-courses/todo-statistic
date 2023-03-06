const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function printTodos(todos) {
    for (const todo of todos) {
        console.log(todo);
    }
}

function processCommand(command) {
    const commands = command.split(' ');
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            printTodos(getTodos());
            break;
        case 'important':
            printTodos(getImportantTodos());
            break;
        case 'user':
            printTodos(getUserTodos(commands[1].toLowerCase()));
            break;
        case 'sort':
            printTodos(getSortedTodos(commands[1]));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getImportantTodos() {
    const todos = getTodos();
    return todos.filter(todo => todo.includes('!'));
}

function getUserTodos(userName) {
    const todos = getTodos();
    return todos.filter(todo => todo.toLowerCase().includes(`// todo ${userName};`));
}

function parseDate(date) {
    const parts = date.split('-');
    return new Date(parts[0], parts[2] - 1, parts[1]);
}

function getSortedTodos(command) {
    const todos = getTodos();
    switch (command) {
        case 'user':
            const result = [];
            const userToTodo = getTodosWithUsers();
            for (const [key, value] of userToTodo) {
                if (key === 'undefined') {
                    continue;
                }
                for (const todo of value) {
                    result.push(todo);
                }
            }
            if (userToTodo.has('undefined')) {
                for (const todo of userToTodo.get('undefined')) {
                    result.push(todo);
                }
            }
            return result;
        case 'date':
            const resultDate = [];
            const dateToTodo = getTodosWithDates();
            const dateAndTodo = [];
            for (const [key, value] of dateToTodo) {
                if (key === 'undefined') {
                    continue;
                }

                dateAndTodo.push({date : parseDate(key), todos : value});
            }
            dateAndTodo.sort((a, b) => b.date - a.date);
            for (const {todos} of dateAndTodo) {
                for (const todo of todos) {
                    resultDate.push(todo);
                }
            }
            if (dateToTodo.has('undefined')) {
                for (const todo of dateToTodo.get('undefined')) {
                    resultDate.push(todo);
                }
            }
            return resultDate;
        case 'importance':
            const importantTodos = getImportantTodosMap();
            const resultImportance = [];
            for (const todo of importantTodos[true]) {
                resultImportance.push(todo);
            }
            for (const todo of importantTodos[false]) {
                resultImportance.push(todo);
            }
            return resultImportance;
        default:
            return todos;
    }
}

function getTodosWithUsers() {
    const todos = getTodos();
    const userToTodo = new Map();
    const und = 'undefined';
    for (const todo of todos) {
        const todoInfo = getNameDateTextFromTodo(todo);
        if (todoInfo) {
            let {name, date, text} = todoInfo;
            name = name.toLowerCase();
            if (userToTodo.has(name)) {
                userToTodo.get(name).push(todo);
            } else {
                userToTodo.set(name, [todo]);
            }
        }
        else {
            if (userToTodo.has(und)) {
                userToTodo.get(und).push(todo);
            } else {
                userToTodo.set(und, [todo]);
            }
        }
    }

    return userToTodo;
}

function getImportantTodosMap() {
    const todos = getTodos();
    const importantTodos = new Map();
    importantTodos[true] = [];
    importantTodos[false] = [];
    for (const todo of todos) {
        importantTodos[todo.includes('!')].push(todo);
    }

    return importantTodos;
}

function getTodosWithDates() {
const todos = getTodos();
    const dateToTodo = new Map();
    const und = 'undefined';
    for (const todo of todos) {
        const todoInfo = getNameDateTextFromTodo(todo);
        if (todoInfo) {
            let {name, date, text} = todoInfo;
            if (dateToTodo.has(date)) {
                dateToTodo.get(date).push(todo);
            } else {
                dateToTodo.set(date, [todo]);
            }
        }
        else {
            if (dateToTodo.has(und)) {
                dateToTodo.get(und).push(todo);
            } else {
                dateToTodo.set(und, [todo]);
            }
        }
    }

    return dateToTodo;
}

function getNameDateTextFromTodo(todo) {
    const parts = todo.substring(7).split(';');
    if (parts.length < 2) {
        return null;
    }
    return {name : parts[0], date : parts[1], text : parts[2]};
}

function getTodos() {
    const todos = [];
    for (const file of files) {
        for (const line of file.split('\n')) {
            if (line.includes('// TODO ')) {
                const todo = line.substring(line.indexOf('// TODO '));
                todos.push(todo);
            }
        }
    }

    return todos;
}

// TODO you can do it!