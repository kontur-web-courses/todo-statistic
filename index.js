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
            let todoToReturn = todo;
            let date = todoData[1];
            if (verbose) {
                // let todo1 = todoData[0] + ';' + todoData[2];
                todosWithDate.push([date, todoToReturn])
            } else {
                todosWithDate.push(todoToReturn);
            }
        } else {
            if (verbose) {
                todosWithoutDate.push([null, todo1])
            } else {
                todosWithoutDate.push(todo1);
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

function getTodosWithDateGreaterThan(date) {
    let formattedDate = date.split('-');
    let todosWithDate = getTodosWithDate(verbose = true);
    let result = [];
    for (let todoData of todosWithDate) {
        let ok = true;
        let curDate = todoData[0];
        let slicedDate = curDate.split('-').slice(0, formattedDate.length);
        for (let ind in slicedDate) {
            let number1 = Number(slicedDate[ind]);
            let number2 = Number(formattedDate[ind]);
            if (isNaN(number1) || number1 < number2) {
                ok = false;
            }
        }
        if (ok) {
            result.push(todoData[1]);
        }

    }
    return result;
}

function processCommand(command) {
    const command_split = command.split(" ")

    switch (command_split[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            let todos = getTodos();
            makeTable(todos)
            break;
        case 'important':
            let importantTodos = getTodos('!');
            makeTable(importantTodos);
            break;
        case 'user':
            makeTable(searchByUser(command_split[1]));
            break
        case 'sort':
            let param = command_split[1];
            let sortedTodos = getSortedTodos(param);
            makeTable(sortedTodos);
            console.log(sortedTodos);
            break;
        case 'date':
            let date = command_split[1];
            makeTable(getTodosWithDateGreaterThan(date));
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
function makeTable(arrayOfResult){
    for (let row of arrayOfResult){
        let countImportant = countExclamationMarks(row)
        let important = '!'.repeat(-countImportant >= 1 ? 1 : 0);
        let user = ""
        let todoData = row.split('; ');

        if (todoData.length > 1){
            let splitted = todoData[0].split(' ');
            if (splitted.length >= 3){
                user = splitted[2]
            }
        }
        let date = ""
        let comment = ""
        if (todoData.length === 3) {
            date = todoData[1];
            comment = todoData.length > 2 ? todoData[2]: "";
            if (comment.length > 50){
                comment = comment.slice(0, 50)+'...'
            }
        }
        else{
            comment = todoData[todoData.length-1];
        }
        // console.log(comment)
        console.log('  '+ important.padEnd(1, " ") + '  |  ' + `${user}`.padEnd(10, " ") + '  |  ' + date.padEnd(10, " ") + '  |  ' + comment)
    }
}