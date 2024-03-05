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
            for (const fileText of files) {
                for (const todo of extract.todos(fileText)) {
                    console.log(todo);
                }
            }
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
                    fullTodos = fullTodos.toSorted((a, b) => a.priority - b.priority);
                    break;
                case 'user':
                    fullTodos = fullTodos.toSorted((a, b) => a.user.localeCompare(b.user));
                    break;
                case 'date':
                    fullTodos = fullTodos.toSorted((a, b) => a.date - b.date);
                    break;
                default:
                    console.log("Unknown argument for sorting");
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
    let strings = [];

    for (const fileText of files) {
        for (const todo of extract.todos(fileText)) {
            strings.push(todo.text);
        }
    }
    return strings;
}

function printToDo(toDo)
{
    for (let i = 0; i < toDo.length; i++) {
        console.log(toDo[i])
      }
}

// TODO you can do it!
