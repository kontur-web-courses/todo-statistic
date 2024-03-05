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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const fileText of files) {
                for (const todo of extract.todos(fileText)) {
                    console.log(`TODO: ${todo.text}`)
                }
            }
            break
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
