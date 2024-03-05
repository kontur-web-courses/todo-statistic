const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
String.prototype.count=function(c) {
    var result = 0, i = 0;
    for(i;i<this.length;i++)if(this[i]==c)result++;
    return result;
};

console.log('Please, write your command!');
readLine(processCommand);

// TODO Переделать это!
function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let arguments = command.split(" ");
    let com = arguments[0];
    let data = arguments[1];
    switch (com) {
        case 'user':
            showUserTodos(data);
            break;
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            printTodos(getToDo());
            break;
        case 'important':
            important()
            break;
        case 'sort':
            sortTodos(data)
            break;
        case 'data':
            let coments2 = getToDo();
            let result = [];
            for(const comment of coments2){
                let index = comment.indexOf(data);
                if (index !== -1) {
                    result.push(comment);
                }
            }
            printTodos(result);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function important() {
    const todos = getToDo().filter(function (n) {
        return n.includes('!');
    });

    printTodos(todos);
}

function showUserTodos(user) {
    const todos = getToDo().filter(function (todo) {
        const parts = todo.split(';');
        if (parts.length !== 3) {
            return false;
        }

        const todoUser = parts[0].split(' ')[2];

        return user.toLowerCase() === todoUser.toLowerCase();
    });
    printTodos(todos);
}

function sortTodos(param) {
    if (param === 'importance') {
        const other = [];
        for(const todo of getToDo()){
            if (todo.includes("!")) {
                console.log(todo);
            } else {
                other.push(todo);
            }
        }
        printTodos(other);
    } else if (param === 'user') {
        sortUsers();
    } else if (param === 'date') {
        const datesWithTodos = getDatesWithTodos(getToDo());

        const sorted = Array.from(datesWithTodos).sort((a, b) => b[0] - a[0]);

        sorted.forEach(todo => {
            console.log(todo.flat(Infinity)[1]);
        })

    }
}

function sortUsers() {
    const allUserTodos = getToDo();
    const users = {};
    users["missing"] = [];

    allUserTodos.forEach(todo => {
        const index = todo.indexOf(";");
        if (index === -1) {
            users["missing"].push(todo);
        } else {
            const curUserName = todo.substring(8, index).toLowerCase();
            if (users[curUserName] !== undefined) {
                users[curUserName].push(todo);
            } else {
                users[curUserName] = [todo];
            }
        }
    });

    for (const user in users) {
        if (user === "missing") {
            continue;
        }
        for (const todo of users[user]) {
            console.log(todo);
        }
    }

    for (const todo of users["missing"]) {
        console.log(todo);
    }
}




function printTodos(todos) {
    for (let todo of todos) {

        console.log(todo);
    }
}

function formatTodo(todo) {
    const important = todo.includes('!');
    const parts = [];

    return parts.join('  |  ');
}

function findAllOccurrences(text) {
    const pattern = /\/\/\s*TODO\s.*/g;
    const regex = new RegExp(pattern, 'g');
    let matches = text.match(regex);
    return matches;
}

function getDatesWithTodos(todos) {
    const dateRegex = /\d{4}-\d\d-\d\d/

    const datesWithTodos = new Map();

    todos.forEach(todo => {
        const match = dateRegex.exec(todo)

        if (match) {
            const dateStr = todo.slice(match.index, match.index + 10);

            const date = new Date(dateStr);

            if (datesWithTodos.has(date)) {
                const dateTodos = datesWithTodos.get(date);
                datesWithTodos.set(date, dateTodos + todo);
            } else {
                datesWithTodos.set(date, [todo]);
            }
        } else {
            const nullDate = new Date('1977-01-01');

            if (datesWithTodos.has(nullDate)) {
                const todosWithoutDate = datesWithTodos.get(nullDate)
                datesWithTodos.set(nullDate, todosWithoutDate + todo)
            } else {
                datesWithTodos.set(nullDate, [todo])
            }
        }
    });

    return datesWithTodos;
}

// TODO you can do it!
function getToDo() {

    let comentsFiles = [];
    for (const fileText of getFiles()) {
        let col = findAllOccurrences(fileText);
        for (let i = 0; i < col.length; i++) { // выведет 0, затем 1, затем 2
            comentsFiles.push(col[i]);
        }
    }
    return comentsFiles;
}