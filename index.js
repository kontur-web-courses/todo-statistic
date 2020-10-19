const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const TODO_REGEXP = new RegExp('^\\/\\/ TODO (.*$)'); //add .* at the start of regexp for more complicated lines
const TODO_FORMATTED_REGEXP = new RegExp('^(.*);\\s*(.*);\\s*(.*).*$');
const COMMAND_NO_ARGS_REGEXP = new RegExp('^(exit|show|important)$');
const COMMAND_WITH_ARGS_REGEXP = new RegExp('^(user|sort|date) ([\\d\\w-]+[\\d\\w\\s-]*)$');
const SORT_ARGS_REGEXP = new RegExp('^(importance|user|date)$');
const DATE_ARGS_REGEXP = new RegExp('^(\\d{4}(-\\d{2}){0,2})$');  // checks format but not date validity
// TODO {Имя автора}; {Дата комментария}; {текст комментария}

let TODO = function (importance, comment, user = "", date = 0) {
    this.comment = comment;
    this.importance = importance;
    this.user = user;
    this.date = date;
};

console.log('Please, write your command!');
let todos = getTodos();
console.log(todos);
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos() {
    let files = getFiles();
    let todos = files.flatMap(file =>
        file.split("\n").filter(line => line.match(TODO_REGEXP)).map(line => line.match(TODO_REGEXP)[1])
    );
    return todos.map(str => {
        let importance = (str.match(/!/gi) || "").length;
        let result = new TODO(importance, str);
        let match = str.match(TODO_FORMATTED_REGEXP);
        if (match)
            result = new TODO(importance, match[3], match[1].toLowerCase(), Date.parse(match[2]) || 0);
        return result;
    })
}

function createTableOutput(todos) {
    let importantLength = todos.some(todo => todo.importance > 0) ? 1 : 0;
    let userLength = todos.reduce((a,b) => a.user.length>b.user.length? a:b).user.length;
    userLength = Math.min(10,userLength);
    let dateLength = todos.some(todo => todo.date > 0) ? 10 : 0;
    let commentLength = todos.reduce((a,b) => a.comment.length>b.comment.length? a:b).comment.length;
    commentLength = Math.min(50,commentLength);

    return todos.map(todo => {
        let importantCol = todo.importance > 0 ? "!" : " ".repeat(importantLength);
        let userCol = todo.user.length > userLength ? todo.user.slice(0, userLength-1) + "…" : todo.user + " ".repeat(userLength - todo.user.length);
        let dateCol = todo.date === 0 ? " ".repeat(dateLength) : new Date(todo.date).toISOString().slice(0, dateLength);
        let commentCol = todo.comment.length > commentLength ? todo.comment.slice(0, commentLength-1) + "…" : todo.comment + " ".repeat(commentLength - todo.comment.length);
        return `${importantCol}  |  ${userCol}  |  ${dateCol}  |  ${commentCol}  |  `;
    }).join("\n");
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