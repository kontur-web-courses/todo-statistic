const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

const commands = {
    exit: () => process.exit(0),
    show: () => console.log(),
}

function processCommand(command) {
    commands[command] | console.log('wrong command');
}

// TODO you can do it!
