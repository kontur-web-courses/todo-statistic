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
    switch (command.split(' ')[0]) {
        case 'show':
            showTodoComments();
            break;
        case 'important':
            showTodoComments(true)
        case `user`:
            showUserComments(username);
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function showUserComments(username) {
    const todoComments = [];

    files.forEach(fileContent => {
        const lines = fileContent.split('\n');
        lines.forEach(line => {
            if (line.includes('// TODO')) {
                const splittedLine = line.split(' ');
                if (splittedLine[1][-1] === ';' && splittedLine[2][-1] === ';' && splittedLine[1].includes(username)) {
                    todoComments.push(line);
                }
            }
        });
    });
    todoComments.forEach(comment => console.log(comment));
}

function showTodoComments(isImportant) {
    const todoComments = [];

    files.forEach(fileContent => {
        const lines = fileContent.split('\n');
        lines.forEach(line => {
            if (line.includes('// TODO')) {
                if (isImportant && line.includes('!')) {
                    todoComments.push(line.slice(line.indexOf('// TODO')));
                } else if (!isImportant) {
                    todoComments.push(line.slice(line.indexOf('// TODO')));
                }
            }
        });
    });
    todoComments.forEach(comment => console.log(comment));
}

// TODO you can do it!
