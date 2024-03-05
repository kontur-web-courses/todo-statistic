const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const extract = require('./extract');

const files = getFiles();

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
            let toDoAll = getToDo();
            printToDo(toDoAll)
            break;
        case 'important':
            let toDoImportant = getToDo();
            printToDo(toDoImportant.filter(function (s) {
                return s.includes("!")
              }))
            break;
        case /user ./:
            let toDoWithAuthors = getToDo();
            let user = command.split(' ')[1];
            printToDo(toDoImportant.filter(function (s) {
                return s.split(';')[0] === user && s.split(';').length == 3
              }))
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getToDo() {
    let strings = [];
    
    for (const fileText of files) {
        for (const todo of extract.todos(fileText)) {
            strings.push(todo.text);
        }
    }
    return strings;
}

function printToDo(toDo)
{
    for (let i = 0; i < toDo.length; i++) {
        console.log(toDo[i])
      }
}

// TODO you can do it!
