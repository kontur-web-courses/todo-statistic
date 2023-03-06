const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    const [action, ...parametrs] = command.split(" ");
    const argument = parametrs.join(" ").toLowerCase();
    switch (action) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            const showArr = getAllTodo(files);
            for (str of showArr) {
                console.log(str);
            }
            break;
        case 'important':
            const myArr = getAllTodo(files);
            for (let strWithCount of getLinesWithExclamation(myArr)) {
                if (strWithCount[1] > 0) {
                    console.log(strWithCount[0]);
                }
            }
            break;
        case 'sort':
            if (argument === "importnace") {
                let sortedArr = getLinesWithExclamation(getAllTodo(files));
                sortedArr.sort(compareSecondElement);
                for (let strWithCount of sortedArr) {
                    console.log(strWithCount[0]);
                }
            }
            break;
        case 'important':
            const importantArr = getLinesWithExclamation(getAllTodo(files));
            for (str of importantArr) {
                console.log(str);
            }
            break;
        case 'name':
            const nameArr = getNameTodo(getAllTodo(files), argument);
            for (str of nameArr) {
                console.log(str);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllTodo(files) {
    const todo = [];
    for (const file of files) {
        for (const str of file.split('\n')) {
            if (/^\/\/ TODO /.test(str.trim())) {
                todo.push(str.trim());
            }
        }
    }
    return todo;
}

function getLinesWithExclamation(arr) {
    filteredArr = [];
    for (let line of arr) {
        let exclamationCount = 0;
        for (let c of line) {
            if (c === '!') {
                exclamationCount += 1;
            }
        }
        filteredArr.push([line, exclamationCount]);
    }
    return filteredArr;
}


function compareSecondElement(a, b) {
    const secondElementA = a[1];
    const secondElementB = b[1];
    if (secondElementA < secondElementB) {
        return -1;
    }
    if (secondElementA > secondElementB) {
        return 1;
    }
    return 0;
}
function getNameTodo(arr, name) {
    const todoName = [];
    for (el of arr) {
        if ("// todo " + name === el.split(";")[0].toLowerCase()) {
            todoName.push(el);
        }
    }
    return todoName;
}
