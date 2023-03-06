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

function isDate(dateStr) {
    return !isNaN(new Date(dateStr).getDate());
}

function processCommand(command) {
    let cmd =  command.split(" ");
    switch (cmd[0]) {
        case 'exit':
            process.exit(0);
            break;
        case "show":
            todos.forEach(
                function (todo) {
                    console.log(`${todo.comment} | ${todo.path}`);
                }
            );
            break;
        case "important":
            todos.forEach(
                function (todo) {
                    if (todo.important > 0) {
                        console.log(`${todo.comment} | ${todo.path}`);
                    }
                }
            );
            break;
        case "user":
            todos.forEach(
                function (todo) {
                    if (todo.user === cmd[1]) {
                        console.log(`${todo.value} | ${todo.path}`);
                    }
                }
            );
            break;
        case "sort":
            todos.sort(sortComps.get(cmd[1]))
            todos.forEach(
                function (todo){
                    console.log(`${todo.comment} | ${todo.path}`)
                }
            )
            break;
        case "date":
            todos.forEach(
                function (todo){
                    if (new Date(cmd[1]) < todo.date) {
                        console.log(`${todo.comment} | ${todo.path}`);
                    }
                }
            )
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
                    date: "",
                    dateString: "",
                    comment: match[1],
                    value: "",
                    path: filePath.split('/')[1]
                };
                todo.important = match[0].split("!").length - 1;
                let data = [...match[1].matchAll(groupRegex)] || [];
                if (data.length > 0) {
                    todo.user = data[0][1];
                    if (isDate(data[0][2])) {
                        todo.date = new Date(data[0][2]);
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

let sortComps = new Map([
    ["user", (a, b) => {
        if (a.user.includes("?") || a.user.includes(".") || a.user === "") {
            return 2;
        }
        if (a.user.toLowerCase() > b.user.toLowerCase()) {
            return 1;
        }
        else if (a.user.toLowerCase() < b.user.toLowerCase()) {
            return -1;
        }
        return 0;
    }],
    ["importance", (a, b) => Math.sign(b.important - a.important)],
    ["date", (a, b) => Math.sign(b.date.getTime() - a.date.getTime())]
]);

//toDO senya; 2023-03-06; add name of file

