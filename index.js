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
    const stringCommand = String(command);
    switch (command) {
        case 'show':
            console.log('not supported yet');
            break;
        case 'important':
            console.log('not supported yet');
            break;
        case command.startsWith('user '):
            username = stringCommand.split(' ')[1].toLowerCase();
            // do something
            console.log('not supported yet');
            break;
        case stringCommand.startsWith('sort '):
            flag = stringCommand.split(' ')[1].toLowerCase();
            // process it
            console.log('not supported yet');
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
