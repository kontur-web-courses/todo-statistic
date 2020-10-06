const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const TODO_REGEXP = new RegExp('^\\/\\/ TODO .*$');
const TODO_FORMATTED_REGEXP = new RegExp('^\\/\\/ TODO (.*);\\s*(.*);\\s*(.*).*$');
const COMMAND_NO_ARGS_REGEXP = new RegExp('^(exit|show|important)$');
const COMMAND_WITH_ARGS_REGEXP = new RegExp('^(user|sort) (\\w+[\\w\\s]*)$');
const SORT_ARGS_REGEXP = new RegExp('^(importance|user|date)$');
// TODO {Имя автора}; {Дата комментария}; {текст комментария}

let TODO = function (fullString, importance, comment = "", user = "", date = 0) {
    this.fullString = fullString;
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
        file.split("\n").filter(line => line.match(TODO_REGEXP))
    );
    return todos.map(str => {
        let importance = (str.match(/!/gi) || "").length;
        let result = new TODO(str, importance);
        let match = str.match(TODO_FORMATTED_REGEXP);
        if (match)
            result = new TODO(str, importance, match[3], match[1].toLowerCase(), Date.parse(match[2]) || 0);
        return result;
    })
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
            console.log(getTodos().map(todo => todo.fullString));
            break;
        case 'important':
            console.log(getTodos().filter(todo => todo.importance > 0).map(todo => todo.fullString));
            break;
        case 'user':
            console.log(getTodos().filter(todo => todo.user === command[2].toLowerCase()).map(todo => todo.fullString));
            break;
        case 'sort':
            let arg = command[2].match(SORT_ARGS_REGEXP);
            if (!arg) {
                console.log('wrong command');
                return;
            }
            let todos = getTodos();
            let result = "";
            switch (arg[1]) {
                case "importance":
                    result = todos.sort((a, b) => b.importance - a.importance).map(todo => todo.fullString);
                    break;
                case "user":
                    todos.sort((a, b) => b.user.localeCompare(a.user));
                    let currentUser = todos[0].user;
                    result = todos.map(todo => {
                        if (todo.user === currentUser)
                            return todo.fullString;
                        else {
                            currentUser = todo.user;
                            return "\n" + todo.fullString;
                        }
                    }).join("\n");
                    break;
                case "date":
                    result = todos.sort((a, b) => b.date - a.date).map(todo => todo.fullString);
                    break;
            }
            console.log(result);
            break;
    }
}
// TODO you can do it!