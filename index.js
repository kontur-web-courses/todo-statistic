const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const path = require("path");

const TODO_REGEXP = new RegExp('^.*\\/\\/[ ]?TODO[:\\s]?\\s*(.*$)', 'i'); // todo add .* at the start of regexp for more complicated lines
const TODO_FORMATTED_REGEXP = new RegExp('^(.*);\\s*(.*);\\s*(.*).*$');
const COMMAND_NO_ARGS_REGEXP = new RegExp('^(exit|show|important)$');
const COMMAND_WITH_ARGS_REGEXP = new RegExp('^(user|sort|date) ([\\d\\w-]+[\\d\\w\\s-]*)$');
const SORT_ARGS_REGEXP = new RegExp('^(importance|user|date)$');
const DATE_ARGS_REGEXP = new RegExp('^(\\d{4}(-\\d{2}){0,2})$');  //tOdo checks format but not date validity
//ToDO: {Имя автора}; {Дата комментария}; {текст комментария}

let TODO = function (importance, comment, fileName, user = "", date = 0, dateStr = "") {
    this.importance = importance;
    this.comment = comment;
    this.fileName = fileName;
    this.user = user;
    this.date = date;
    this.dateStr = dateStr;
};

console.log('Please, write your command!');
let todos = getTodos();
console.log(todos);
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(p => {
        return {
            fileName: path.basename(p),
            lines: readFile(p)
        }
    });
}

function getTodos() {
    let files = getFiles();
    let todos = files.flatMap(file => file.lines
        .split("\n")
        .filter(line => line.match(TODO_REGEXP))
        .map(line => {
            return {
                str: line.match(TODO_REGEXP)[1],
                fileName: file.fileName
            }
        })
    );

    return todos.map(line => {
        let str = line.str;
        let importance = (str.match(/!/gi) || "").length;
        let result = new TODO(importance, str, line.fileName);
        let match = str.match(TODO_FORMATTED_REGEXP);
        if (match) {
            let date = Date.parse(match[2]) || 0;
            let dateStr = date ? match[2] : "";
            result = new TODO(importance, match[3], line.fileName, match[1].toLowerCase(), date, dateStr);
        }
        return result;
    })
}

function createTableOutput(todos) {
    if (todos.length === 0)
        return "No todos";
    const IMPORTANT = "!";
    const USER = "user";
    const DATE = "date";
    const COMMENT = "comment";
    const FILE = "file";

    let importantLength = IMPORTANT.length;

    let userLength = todos.reduce((a, b) => a.user.length > b.user.length ? a : b).user.length;
    userLength = Math.min(10, userLength);
    userLength = Math.max(userLength, USER.length);

    let dateLength = todos.reduce((a, b) => a.dateStr.length > b.dateStr.length ? a : b).dateStr.length;
    dateLength = Math.min(10, dateLength);
    dateLength = Math.max(dateLength, DATE.length);

    let commentLength = todos.reduce((a, b) => a.comment.length > b.comment.length ? a : b).comment.length;
    commentLength = Math.min(50, commentLength);
    commentLength = Math.max(commentLength, COMMENT.length);

    let fileLength = todos.reduce((a, b) => a.fileName.length > b.fileName.length ? a : b).fileName.length;
    fileLength = Math.min(10, fileLength);
    fileLength = Math.max(fileLength, FILE.length);

    let tableRows = todos.map(todo => {
        let importantCol = todo.importance > 0 ? "!" : " ".repeat(importantLength);
        let userCol = todo.user.length > userLength ? todo.user.slice(0, userLength - 1) + "…" : todo.user + " ".repeat(userLength - todo.user.length);
        let dateCol = todo.date === 0 ? " ".repeat(dateLength) : todo.dateStr + " ".repeat(dateLength - todo.dateStr.length);
        let commentCol = todo.comment.length > commentLength ? todo.comment.slice(0, commentLength - 1) + "…" : todo.comment + " ".repeat(commentLength - todo.comment.length);
        let fileCol = todo.fileName.length > fileLength ? todo.fileName.slice(0, fileLength - 1) + "…" : todo.fileName + " ".repeat(fileLength - todo.fileName.length);
        return ` ${importantCol}  |  ${userCol}  |  ${dateCol}  |  ${commentCol}  |  ${fileCol} `;
    });

    tableRows.unshift(".".repeat(tableRows[0].length));
    tableRows.unshift(` ${IMPORTANT + " ".repeat(importantLength - IMPORTANT.length)}  |  ${USER + " ".repeat(userLength - USER.length)}  |  ${DATE + " ".repeat(dateLength - DATE.length)}  |  ${COMMENT + " ".repeat(commentLength - COMMENT.length)}  |  ${FILE + " ".repeat(fileLength - FILE.length)} `)
    tableRows.push(".".repeat(tableRows[0].length));
    return tableRows.join("\n");
    //tableRows.
}

function processCommand(input) {
    let command = input.match(COMMAND_NO_ARGS_REGEXP);
    if (!command) {
        command = input.match(COMMAND_WITH_ARGS_REGEXP);
        if (!command) {
            console.log('wrong command');
            return;
        }
    }

    switch (command[1]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(createTableOutput(getTodos()));
            break;
        case 'important':
            let todosImportant = getTodos().filter(todo => todo.importance > 0);
            console.log(createTableOutput(todosImportant));
            break;
        case 'user':
            let todosByUser = getTodos().filter(todo => todo.user === command[2].toLowerCase());
            console.log(createTableOutput(todosByUser));
            break;
        case 'sort':
            let arg = command[2].match(SORT_ARGS_REGEXP);
            if (!arg) {
                console.log('wrong command');
                return;
            }
            let todos = getTodos();
            switch (arg[1]) {
                case "importance":
                    todos = todos.sort((a, b) => b.importance - a.importance);
                    break;
                case "user":
                    todos = todos.sort((a, b) => b.user.localeCompare(a.user));
                    break;
                case "date":
                    todos = todos.sort((a, b) => b.date - a.date);
                    break;
            }
            console.log(createTableOutput(todos));
            break;
        case 'date':
            let date = command[2].match(DATE_ARGS_REGEXP);
            if (!date) {
                console.log('wrong command');
                return;
            }
            date = new Date(date[1]);
            if (isNaN(date)) {
                console.log('wrong command');
                return;
            }
            let todosAfterDate = getTodos().filter(todo => todo.date >= date.getTime());
            console.log(createTableOutput(todosAfterDate));
    }
}

// TODO you can do it!