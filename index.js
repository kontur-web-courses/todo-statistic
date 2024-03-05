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
            break;
        case `user`:
            showUserTodoComments(command.split(' ')[1]);
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function showUserTodoComments(username) {
    const userTodoComments = [];
    files.forEach(fileContent => {
        const lines = fileContent.split('\n');
        lines.forEach(line => {
            if (line.includes('// TODO')) {
                const todoComment = line.slice(line.indexOf('// TODO') + 8);
                const todoParts = todoComment.split(';');
                if (todoParts.length >= 2) {
                    const todoAuthor = todoParts[0].trim();
                    if (todoAuthor.toLowerCase() === username.trim()) {
                        userTodoComments.push(line);
                    }
                }
            }
        });
    });
    userTodoComments.forEach(comment => console.log(comment));
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
