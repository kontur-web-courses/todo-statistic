const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTodos() {
    let allTodos = []
    for (let code of files) {
        for (let s of code.split('\n')) {
            if (s.includes("// TODO")) {
                let start = s.indexOf("/");
                allTodos.push(s.substring(start));
            }
        }
    }
    return allTodos;
}

function getImportant() {
    let allTodos = getAllTodos();
    let importantTodos = []
    for (let line of allTodos) {
        if (line.includes("!"))
            importantTodos.push(line);
    }
    return importantTodos;
}

function getUserTodos() {
    let allTodos = getAllTodos();
    let usersTodos = {};
    for (let todo of allTodos) {
        if (todo.includes(";")) {
            const user = todo.split(';')[0].split('TODO ')[1].toLowerCase();
            if (usersTodos[user] !== undefined)
                usersTodos[user].push(todo);
            else usersTodos[user] = [todo];
        }
    }
    return usersTodos;
}

function sortByDate() {
    let userTodos = sortByValue(getUserTodos);
    return userTodos.sort((a, b) => new Date(a.split(';')[1]) - new Date(b.split(';')[1]))
}

function getSort(arg) {
    switch (arg) {
        case 'importance':
            return sortByImportance();
        case 'user':
            return sortByValue(getUserTodos);
        case 'date':
            return sortByDate();
    }
}

function sortByImportance() {
    let allTodos = getAllTodos();
    let todosByImportance = getImportant();
    for (let line of allTodos) {
        if (!todosByImportance.includes(line))
            todosByImportance.push(line);
    }
    return todosByImportance;
}

function sortByValue(func) {
    let byValueTodos = func();
    let todosByValue = [];
    for (let todo of Object.values(byValueTodos))
        todosByValue = todosByValue.concat(todo);
    return todosByValue;
}


function processCommand(command) {
    let splitedCommand = command.split(' ');
    switch (splitedCommand[0]) {
        case 'sort':
            let arg = splitedCommand[1];
            console.log(getSort(arg));
            break;
        case 'user':
            let user = splitedCommand[1].toLowerCase();
            console.log(getUserTodos()[user])
            break;
        case 'important':
            console.log(getImportant());
            break;
        case 'show':
            console.log(getAllTodos());
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}
