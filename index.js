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
            let todos = getToDo();
            let fullTodos = todos.filter(t => t.type === 'full');

            switch (args[0]) {
                case 'importance':
                    todos = todos.toSorted((a, b) => b.priority - a.priority);
                    printToDo(todos);
                    break;
                case 'user':
                    fullTodos = fullTodos.toSorted((a, b) => a.user.localeCompare(b.user));
                    printToDo(fullTodos);
                    break;
                case 'date':
                    fullTodos = fullTodos.toSorted((a, b) => a.date - b.date);
                    printToDo(fullTodos);
                    break;
                default:
                    console.log('Unknown argument for sorting');
                    return;
            }
            break;
        case 'date':
            let d = Date.parse(args[0]);
            if (d == null) {
                console.log('Wrong date, use format YYYY-MM-DD');
                return;
            }

            printToDo(getToDo().filter(t => t.type === 'full' && t.date >= d));
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
    for (t of toDo) {
        switch (t.type) {
            case 'full':
                console.log(`TODO: ${t.user}\t | ${t.date.toLocaleString()}\t | ${t.text}`);
                break;
            case 'truncated':
                console.log(`TODO: ${t.text}`);
        }
    }
}

// TODO you can do it!
