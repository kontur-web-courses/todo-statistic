const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let currentData = command.split(' ')[0];
    switch (currentData) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            logToDo();
            break;
        case 'important':
            logToDoWithImportant();
            break;
        case 'user':
            const requestedUser = command.split(' ')[1];
            let todos = getTodos(getFiles())
                .filter(function(x) { return hasUserName(x, requestedUser); });
            for(const todo of todos) {
                console.log(todo);
            }
            break;
        case 'sort':
            let dataSort = command.split(' ');
            let currentSortParam = dataSort[1];
            switch (currentSortParam){
                case 'important':
                    logToDoWithSortImportant();
                    break;
                case 'user':
                    break;
                case 'date':
                    let todos = getTodos(getFiles());
                    todos.sort(function(a,b) { return compareDates(getData(a), getData(b)); });
                    for(const todo of todos) {
                        console.log(todo);
                    }
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function hasUserName(todoStr, requestedName) {
    const name = todoStr.split(';')[0].slice(8);
    return name.toLowerCase() === requestedName.toLowerCase();
}

function logToDo(){
    const allToDo = getTodos(getFiles());
    for (const currentTodDo of allToDo){
        console.log(currentTodDo);
    }
}

function logToDoWithImportant(){
    const allToDo = getTodos(getFiles());
    for (let currentTodDo of allToDo){
        if (currentTodDo.indexOf('!') !== -1) {
            console.log(currentTodDo);
        }
    }
}

function getData(str){
    let result = null;
    if (str.indexOf('-') !== -1) {
        let currentIndex = str.indexOf('-') - 4;
        let currentData = str.slice(currentIndex, currentIndex + 10);
        result = currentData;
    }
    return result;
}
function compareDates(a, b) {
    if(a === null)
        return 1;
    if(a > b)
        return -1;
    if(a < b)
        return 1;
    return 0;
}

function logToDoWithSortImportant(){
    let data = {};
    const allToDo = getTodos(getFiles());
    for (let currentTodDo of allToDo){
        if (currentTodDo.indexOf('!') !== -1) {
            if (!data[currentTodDo]){
                data[currentTodDo] = currentTodDo.split('!').length - 1;
            }
        }
        if (!data[currentTodDo]){
            data[currentTodDo] = 0;
        }
    }
    let sortable = [];
    for (let prior in data) {
        sortable.push([prior, data[prior]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    for (const res of sortable){
        console.log(res[0]);
    }
}



function getTodos(files) {
    let res = [];
    for(const file of files) {
        for(const line of file.split(/\r?\n|\r|\n/g)) {
            if(line.trim().startsWith('// TODO')) {
                res.push(line);
            }
        }
    }
    return res;
}

// TODO you can do it!
