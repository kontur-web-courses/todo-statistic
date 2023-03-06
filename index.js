const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todoRegex = RegExp(".*(//.*?TODO.+) ?", "gi");
const groupRegex = RegExp("//.*?TODO ?(.+); ?(.+); ?(.+)?", "gi");
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    return getAllFilePathsWithExtension(process.cwd(), "js");
}

let todos = getTodos();

function processCommand(command) {
    let cmd =  command.split(" ");
    switch (cmd[0]) {
        case 'exit':
            process.exit(0);
            break;
        case "show":
            todos.forEach(
                function (todo) {
                    console.log(todo);
                }
            );
            break;
        case "important":
            todos.forEach(
                function (todo) {
                    if (todo.important > 0) {
                        console.log(todo);
                    }
                }
            );
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
function getTodos() {
    let todos = [];
    files.forEach(
        function (filePath) {
            [...readFile(filePath).matchAll(todoRegex)].forEach(function (match) {
                let todo = {
                    important: 0,
                    user: "",
                    date: new Date(1, 1, 1, 1, 1, 1),
                    dateString: "",
                    comment: match[1],
                    value: "",
                    path: filePath.split('/')[1]
                };
                todo.important = match[0].split("!").length - 1;
                let data = [...match[1].matchAll(groupRegex)] || [];
                if (data.length > 0) {
                    todo.user = data[0][1];
                    todo.date = new Date(data[0][2]);
                    if (todo.date > new Date(1, 1, 1, 1, 1, 1)) {
                        todo.dateString = todo.date.toDateString();
                    }
                    todo.value = data[0][3];
                }
                todos.push(todo);
            });
        }
    );
    return todos;
}


// toDo art3x; 2023-06-03; add sort