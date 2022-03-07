const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const TODO_REGEX = /\/\/ TODO (.*)/gm;
const IMPORTANT_MARK = "!";

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

function filterImportantTodos(sourceComments) {
    return sourceComments.filter(todo => todo.includes(IMPORTANT_MARK))
}

const commands = {
    exit: (c) => process.exit(0),
    show: (c) => getTodoComments().forEach(t => console.log(t)),
    important: (c) => filterImportantTodos(getTodoComments()).forEach(todo => console.log(todo)),
}

function processCommand(command) {
    if (!commands.hasOwnProperty(command))  {
        console.log('wrong command');
        return
    }

    commands[command](command);
}

// TODO you can do it!
