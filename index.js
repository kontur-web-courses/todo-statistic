const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const extract = require('./extract');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let commandParts = command.split(' ', 2);
    let cmd = commandParts[0];
    let args = [];
    if (commandParts.length > 1)
        args = commandParts[1].split(' ');

    switch (cmd) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            printToDo(getToDo());
            break;
        case 'important':
            printToDo(getToDo().filter((todo) => todo.priority > 0));
            break;
        case 'user':
            printToDo(getToDo().filter((todo) => todo.type === 'full' && todo.user.toLowerCase() === args[0].toLowerCase()));
            break;
        case 'sort':
            let fullTodos = [];
            for (const fileText of files) {
                for (const todo of extract.todos(fileText)) {
                    if (todo.type === 'full')
                        fullTodos.push(todo);
                }
            }

            switch (args[0]) {
                case 'importance':
                    fullTodos = fullTodos.toSorted((a, b) => b.priority - a.priority);
                    break;
                case 'user':
                    fullTodos = fullTodos.toSorted((a, b) => a.user.localeCompare(b.user));
                    break;
                case 'date':
                    fullTodos = fullTodos.toSorted((a, b) => a.date - b.date);
                    break;
                default:
                    console.log('Unknown argument for sorting');
                    return;
            }

            for (const todo of fullTodos) {
                console.log(todo);
            }


            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getToDo() {
    let todos = [];

    for (const fileText of files) {
        for (const todo of extract.todos(fileText)) {
            todos.push(todo);
        }
    }
    return todos;
}

function printToDo(toDo) {
    toDoText = toDo.map((todo) => todo.text);
    for (let i = 0; i < toDoText.length; i++) {
        console.log(toDoText[i]);
    }
}

// TODO you can do it!
