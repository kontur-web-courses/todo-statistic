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
    command = command.split(' ');
    switch (command[0]) {
        case 'sort':
            showSortTodo(command[1]);
            break;
        case 'user':
            showUserTODO(command[1]);
            break;
        case 'important':
            showImportantTODO();
            break;
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showTODO();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function findTODO() {
    const allTODO = [];
    for(const file of files){
        const lines = file.split('\n');
        for(const line of lines){
            const index = line.indexOf('// ' +
                'TODO');
            if(index === -1) continue;
            allTODO.push(line.slice(index + 8, line.length));
        }
    }
    return allTODO;
}

function showTODO() {
    for(const el of findTODO()){
        console.log(el);
    }
}

function showImportantTODO() {
    for(let el of findTODO()){
        if(el.indexOf('!') + 1)
            console.log(el);
    }
}

function showUserTODO(name){
    for(let el of findTODO()){
        const TODOParts = el.split(';');
        if(TODOParts[0].trim().toLowerCase() === name.toLowerCase())
            console.log(el);
    }
}

function showSortTodo(param) {
    const printer = (arr) => {
        for(const el of arr)
            console.log(el);
    }
    switch (param){
        case 'user':
            printer(sortUser());
            break;
        case 'importance':
            printer(sortImportance());
            break;
        case 'date':
            printer(sortDate());
            break;
        default:
            console.log('incorrect sort param');
            break;
    }
}

function sortImportance() {
    const allTODO = findTODO();
    let comparer = (a, b) => {
        a = a.split('!');
        b = b.split('!');
        if(a.length > b.length) return -1;
        else return 1;
    }
    return allTODO.sort(comparer);
}

function sortUser() {
    const allTODO = findTODO();
    let comparer = (a, b) => {
        a = a.split(';');
        b = b.split(';');
        if(a.length < b.length) return 1;
        else if (a.length === b.length) return a[0].toLowerCase() > b[0].toLowerCase() ? 1 : -1;
        else return -1;
    }
    return allTODO.sort(comparer);
}

function sortDate() {
    const allTODO = findTODO();
    let comparer = (a, b) => {
        a = a.split(';');
        b = b.split(';');
        if(a.length < b.length) return 1;
        else if (a.length === b.length) return a[1] > b[1] ? -1 : 1;
        else return -1;
    }
    return allTODO.sort(comparer);
}

// TODO you can do it!
