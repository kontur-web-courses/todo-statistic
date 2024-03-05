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
            if (line.includes('// TODO' + ' ') && (includedText == null || line.includes(includedText))){
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

function getTodosWithDate(verbose=false) {
    let todos = getTodos();
    let todosWithDate = [];
    let todosWithoutDate = [];
    for (let todo of todos) {
        let todoData = todo.split('; ');
        if (todoData.length === 3) {
            if (verbose) {
                let todo1 = todoData[0] + ';' + todoData[2];
                let date = todoData[1];
                todosWithDate.push([date, todo1])
            } else {
                todosWithDate.push(todo1);
            }
        } else {
            if (verbose) {
                todosWithoutDate.push([null, todoData[0] + ';' + todoData[2]])
            } else {
                todosWithoutDate.push(todo);
            }
        }
    }
    return todosWithDate.concat(todosWithoutDate);
}

function getSortedTodos(param){
    if (param === 'date'){
        return getTodosWithDate();
    }
    if (param === 'importance'){
        let importanceTodos = getTodos();
        importanceTodos.sort(countExclamationMarks);
        return importanceTodos;
    }
    if (param === 'user'){
        // TODO {Имя автора}; {Дата комментария}; {текст комментария}
        let todos = getTodos();
        let todosWithUser = [];
        let todosWithoutUser = [];
        for (let todo of todos){
            let todoData = todo.split(';');
            if (todoData.length > 1){
                let splitted = todoData[0].split(' ');
                if (splitted.length >= 3){
                    todosWithUser.push(todo);
                }
                else{
                    todosWithoutUser.push(todo);
                }
            }
            else{
                todosWithoutUser.push(todo);
            }
        }
        return todosWithUser.concat(todosWithoutUser);
    }

}

function processCommand(command) {
    const command_split = command.split(" ")
    switch (command_split[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            let todos = getTodos();
            console.log(todos);
            break;
        case 'important':
            let importantTodos = getTodos('!');
            console.log(importantTodos);
            break;
        case 'user':
            console.log(searchByUser(command_split[1]));
            break
        case 'sort':
            let param = command_split[1];
            let sortedTodos = getSortedTodos(param);
            console.log(sortedTodos);
            break;
        case 'date':
            let date = command_split[1];
            let todosWithDate = getTodosWithDate(verbose = true);
            console.log(todosWithDate);
            break;
        default:
            console.log('wrong command');
    }
}

function searchByUser(user){

    let getAllToDo = getTodos()
    let result = [];
    for (let toDo of getAllToDo ) {
        let reg = new RegExp(`\/\/ TODO ${user};`, "i");
        if(toDo.search(reg) !== -1){
            result.push(toDo)
        }
    }
    return result
}


function countExclamationMarks(str) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '!') {
            count++;
        }
    }
    return -count;
}