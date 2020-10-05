const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function logElements(arr) {
    for (const e of arr)
        console.log(e);
}

function getUserName(todo) {
    try {

    } catch(TypeError) {
        
    }
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
        case 'show':
            logElements(getTodos());
            break;
        case 'important':
            logElements(getTodos(filterFunc = x => countItem(x, '!')));
            break;
        default:
            if (/^(user )/.test(command)) {
                let username = command.substring(5);
                logElements(getTodos(filterFunc = x => x.split(';')[0]));
            } else 
                console.log('wrong command');
            break;
    }
}

function getTodos(filterFunc = x => x, sortFunc = (a, b) => countItem(b, '!') - countItem(a, '!')) {
    return files
        .map(file => file.match(/\/\/.*todo.*/gi))
        .flat(Infinity)
        .filter(filterFunc)
        .sort(sortFunc);
}

function countItem(string, item) {
    return string.split('').reduce((p, i) => i === item ? p + 1 : p, 0);
}
// TODO you can do it!
// todo burn in Hell !
