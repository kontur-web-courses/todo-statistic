const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const todoService = require('./TODOcommentsService');

const files = getFiles();
todoService.getAllTodos(files);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            todoService.show(files);
            break;
        case 'important':
            todoService.important(files);
            break;
        case command.match(/^user .+$/g) ? command : null:
            todoService.user(command);
            break;
        case command.match(/^sort importance$/g) ? command : null:
            todoService.importanceSort();
            break;
        case command.match(/^sort user$/g) ? command : null:
            todoService.userSort();
            break;
        case command.match(/^sort date$/g) ? command : null:
            console.log(todoService.dateSort());
            break;
        case command.match(/^date .*$/g) ? command : null:
            todoService.filterByDate(command.split(/\s/)[1]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
