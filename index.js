const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos(includedText=null){
    let paths = getAllFilePathsWithExtension(process.cwd(), 'js');
    let todos = [];
    for (let path of paths){
        let file = readFile(path);
        for (let line of file.split('\n')){
            if (line.includes('// TODO') && (includedText == null || line.includes(includedText))){
                let splittedLine = line.split('//');
                // console.log(splittedLine);
                let todo = '//' + splittedLine[splittedLine.length - 1];
                // console.log(todo);
                todos.push(todo)
            }
        }
    }
    return todos;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            let todos = getTodos();
            console.log(todos);
            break;
        case "important":
            let importantTodos = getTodos('!');
            console.log(importantTodos);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
