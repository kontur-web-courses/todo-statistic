const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let commandSplit = command.split(' ');
    let name = ''
    command = commandSplit[0];
    if (commandSplit.length > 0) {
        name = commandSplit[1]
    }
    switch (command) {
        case 'user':
            for (const todo of parseToDo()) {
                let todoSplit = todo.split(';', 3);

                if (todoSplit.length !== 3)
                    continue;

                let user = todoSplit[0].split(' ')[2];
                let date = todoSplit[1].trim();
                let comment = todoSplit[2];

                if (user.toLowerCase() === name.toLowerCase()) {
                    console.log(todo);
                }
            }
            break;
        case 'show':
            console.log(parseToDo());
            break;
        case 'important':
            for (const todo of parseToDo()) {
                if (todo.indexOf('!') !== -1)
                    console.log(todo);
            }
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
function parseToDo() {
    const regexp = /\/\/ TODO [\w\W]*/;
    const todoComments = [];

    for (const file of files) {
        for (const line of file.split('\r\n')) {
            if (regexp.test(line)) {
                todoComments.push('//' + line.split('//')[1]);
            }
        }
    }
    return todoComments;
}