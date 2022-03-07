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
    switch (command) {

        case 'exit':
            process.exit(0);
            break;
        case 'show':
           printTodos(findTODO());
            break;
        case 'important':
            printTodos(getImportant(findTODO()));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function* getImportant(todos) {
    for (const todo of todos) {
        if (todo.indexOf("!") !== -1) {
            yield todo;
        }
    }
}

function* findTODO() {
    for (const file of files) {
        for (const line of file.split('\n')) {
            let index = line.indexOf('// TODO');
            if (index !== -1) {
                yield line.substring(index);
            }
        }
    }
}

// TODO you can do it!
