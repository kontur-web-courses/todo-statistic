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
    switch (command) {
        case 'show':
            showTodoComments();
            break;
        case 'important':
            showTodoComments(true)
       case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function showTodoComments(isImportant) {
    const todoComments = [];

    files.forEach(fileContent => {
        const lines = fileContent.split('\n');
        lines.forEach(line => {
            if (line.includes('// TODO')) {
                if (isImportant && line.includes('!')) {
                    todoComments.push(line.slice(line.indexOf('// TODO')));
                }
                else if (!isImportant){
                    todoComments.push(line.slice(line.indexOf('// TODO')));
                }
            }
        });
    });
    todoComments.forEach(comment => console.log(comment));
}
// TODO you can do it!
