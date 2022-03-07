const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = [];

console.log('Please, write your command!');

for (file of files) {
    let strings = file.split('\n');
    for (str of strings) {
        if (str.substring(0, 7) == '// TODO') todos.push(str);
    }
}
readLine(processCommand);
readLine(processCommand('show'));
readLine(processCommand('exit'));

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
            for (element of todos) console.log(element);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
