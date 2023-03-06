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
            console.log(parseToDo());
            break
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