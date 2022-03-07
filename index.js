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
    const matched = [...todo.matchAll(USER_DATE_COMMENT_REGEX)][0] ?? ["", null, ""];
    return {
        original: todo,
        user: matched[1],
        date: new Date(matched[2]),
        comment: matched[3],
        important_count: todo.split("!").length - 1,
    }
}

function getTodoComments() {
    const allComments = [];
    for (const file of files) {
        const matched = [...file.matchAll(TODO_REGEX)].map(match => convertToTodoObject(match[0]));
        allComments.push(...matched);
    }
    return allComments;
}

function filterImportantTodos(sourceComments) {
    return sourceComments.filter(todo => todo.includes(IMPORTANT_MARK))
}


function sortByUser(aTodo, bTodo) {
    if (!aTodo.user) {
        return -1;
    }

    if (!bTodo.user) {
        return 1;
    }

    return aTodo.user.localeCompare(bTodo.user);
}

function processSortByUser() {
    const allTodos = getTodoComments();

    allTodos.sort(sortByUser).reverse().forEach(f => console.log(f.original));
}

function processSort(command) {
    const splitCommand = command.split(" ");
    if (splitCommand.length !== 2) {
        console.log("wrong command");
        return;
    }

    const argument = splitCommand[1];

    switch (argument) {
        case "user":
            processSortByUser();
            break;
        case "importance":
            break;
        case "date":
            break;
        default:
            console.log("wrong command");
    }
}

const commands = {
    exit: (c) => process.exit(0),
    show: (c) => getTodoComments().forEach(t => console.log(t)),
    important: (c) => filterImportantTodos(getTodoComments()).forEach(todo => console.log(todo)),
    sort: processSort,
}

function processCommand(command) {
    const splitCommand = command.split(" ");


    if (!commands.hasOwnProperty(splitCommand[0]))  {
        console.log('wrong command');
        return
    }

    commands[splitCommand[0]](command);
}

// TODO you can do it!
