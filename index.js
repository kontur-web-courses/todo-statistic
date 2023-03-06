const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTodos(){
    let allTodos = []
    for (let code of files){
        for (let s of code.split('\n')) {
            if (s.includes("// TODO")) {
                let start = s.indexOf("/");
                allTodos.push(s.substring(start));
            }
        }
    }
    return allTodos;
}

function getImportant(){
    let allTodos = getAllTodos();
    let importantTodos = []
    for (let line of allTodos){
        if (line.includes("!"))
            importantTodos.push(line);
    }
    return importantTodos;
}

function getUserTodos(user){
    let allTodos = getAllTodos();
    let userTodos = []
    for (let line of allTodos){
        if (line.toLowerCase().includes(`// todo ${user};`))
            userTodos.push(line);
    }
    return userTodos;
}

function getSort(arg){
    switch (arg){
        case 'importance':
            return sortByImportance();
        case 'user':
            return sortByUser();
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

function sortByUser(){
    let allTodos = getAllTodos();
}

function sortByDate(){

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
            console.log(getUserTodos(user))
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
