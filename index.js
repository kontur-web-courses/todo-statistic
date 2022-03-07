const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();
const todos = [];

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function makeTODO() {
    if (todos.length == 0) {
        for (let file of files) {
            file = file.split("\n");
            for (const line of file) {
                let idx = line.indexOf("// TODO ");
                if (idx > -1) {
                    let todo = line.substring(idx);
                    todos.push(todo);
                }
            }
        }
    }
}

function showTODO() {
    for (const todo of todos) {
        console.log(todo);
    }
}

function importantTODO() {
    for (const todo of todos) {
        if (todo.indexOf("!") > -1) {
            console.log(todo);
        }
    }
}

function sortImportantTODO(){
    let mapTODO= new Map();
    
    for (const todo of todos) {
        mapTODO.set(todo, todo.filter(x => x === '!').length);
    }
    
    const mapTODOSort = new Map([...mapTODO.entries()].sort((a, b) => b[1] - a[1]));
    console.log(mapTODOSort);
}

function userTODO(username) {
    for (const todo of todos) {
        const splitStr = todo.split(";");
        if (splitStr.length == 3 & splitStr[0].toLowerCase() === "// todo " + username.toLowerCase()) {
            console.log(todo);
        }

    }
}

function processCommand(command) {
    makeTODO();

    switch (command.split(" ")[0]) {
        case 'user':
            let userName = command.split(" ")[1];
            if (userName != undefined) {
                userTODO(userName.toLowerCase());
            }
            break;
        case 'sort': 
            break;
        case 'show':
            showTODO();
            break;
        case 'important':
            importantTODO();
            breal;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}
