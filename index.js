const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos(){
    const re = new RegExp('\\/\\/\\sTODO\\s(?<command>.+)')
    const todoComments = [];
    for (const file of getFiles()) {
        for (const line of file.split('\n')) {
            if (!re.test(line)){
                continue;
            }

            const { groups: { command } } = re.exec(line);
            todoComments.push(command);
        }
    }

    return todoComments;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
