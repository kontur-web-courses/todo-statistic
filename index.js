const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const TODO_REGEX = /\/\/ TODO (.*)/gm;
const IMPORTANT_MARK = "!";
const USER_DATE_COMMENT_REGEX = /(?:\s)*\/\/\sTODO\s(.+);\s(.+);\s(.+)/gm;

const TODO_OBJECT = {
    original: "",
    comment: "",
    date: "", // dateObject
    user: "",
    important_count: 0,
}

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function convertToTodoObject(todo){
    let matched = todo.matchAll(USER_DATE_COMMENT_REGEX);
    return {
        original: todo,
        user: matched[1],
        date: matched[2],
        comment: matched[3],
        important_count: todo.split("!").length - 1,
    }
}

function getTodoComments() {
    const allComments = [];
    for (const file of files) {
        const matched = file.matchAll(TODO_REGEX).map(match => convertToTodoObject(match[0]));
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
