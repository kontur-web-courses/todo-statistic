const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const {show} = require('./show');
const {important} = require('./important');
const {userTODO} = require('./userTODO');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let argument;
    command = command.split(' ');
    if (command.length > 1)
        argument = command[1];
    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show(getFiles());
            break;
        case 'important':
            important(getFiles());
            break;
        case 'user':
            userTODO(getFiles(), argument);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
