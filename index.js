const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const TODO_REGEX = /\/\/ TODO (.*)/gm

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodoComments() {
    const allComments = [];
    for (const file of files) {
        const matched = [...file.matchAll(TODO_REGEX)];

        allComments.push(...matched.map(match => match[0]));
    }
    return allComments;
}

const commands = {
    exit: () => process.exit(0),
    show: () => console.log(getTodoComments()),
}

function processCommand(command) {
    if (!commands.hasOwnProperty(command))  {
        console.log('wrong command');
        return
    }

    commands[command]();
}

// TODO you can do it!
