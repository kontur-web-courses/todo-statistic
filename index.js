const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let allTodos = [];
getAllTodos(files);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show(files);
            break;
        case 'important':
            important(files);
            break;
        case command.match(/^user .+$/g) ? command : null:
            user(command);
            break;
        case command.match(/^sort importance$/g) ? command : null:
            importanceSort();
            break;
        case command.match(/^sort user$/g) ? command : null:
            userSort();
            break;
        case command.match(/^sort date$/g) ? command : null:
            console.log(dateSort());
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllTodos(files){
    const todoArray = files.map(file =>  file.split('\n'))
    let regEx = /\/\/\s?todo(\s|:).+/gi
    for (let item of todoArray){
        for (let str of item){
            if (str.match(regEx)){
                allTodos.push(str.slice(str.indexOf('//')))
            }
        }
    }
}

function show () {
    console.log(allTodos);
}

function important () {
    let important = allTodos.filter(str => str.match(/!/gi));
    console.log(important);
    return important;
}

function user(command){
    const userName = command.replace('user ', '').trim().toLowerCase();
    const regEx = new RegExp(`.*${userName};.*`, 'i');
    console.log(allTodos.filter(str => str.match(regEx)));
}

function userSort(){
    let userTodo = [];
    let anonTodo = [];
    let localTodos = [...allTodos];
    for (let todo of localTodos) {
        let paramArr = todo.split("; ");
        if (paramArr.length >= 3)
            userTodo.push(todo);
        else
            anonTodo.push(todo);
    }
    anonTodo.map(element => userTodo.push(element));
    localTodos = userTodo;
    console.log(localTodos);
}

function importanceSort(){
    let localTodos = [...allTodos];
    localTodos.sort((a, b) => {
        let firstElement = a.match(/!/gi) || [];
        let secondElement = b.match(/!/gi) || [];
        return secondElement.length - firstElement.length;
    })
    console.log(localTodos);
}

function dateSort(){
    const regEx = /\d{4}-\d{2}-\d{2}/gi;
    let localTodos = [...allTodos];
    localTodos.concat(allTodos);
    localTodos.sort((a, b) => {
        let firstElement = new Date(a.match(regEx));
        let secondElement = new Date(b.match(regEx));
        return secondElement - firstElement;
    })
    return localTodos;
}

// TODO you can do it!
