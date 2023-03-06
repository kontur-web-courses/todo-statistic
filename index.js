const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function searchTodo(file){
    let regexp = /\/\/ TODO [A-Za-z0-9А-Яа-я?!;: .,-]*/g
    return  file.match(regexp)
}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path))
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let file of getFiles(files)) {
                console.log(searchTodo(file));
            }
            break
        case 'important':
            for (let file of getFiles(files)){
                for (let str of searchTodo(file)){
                    if (str.includes('!')) {
                        console.log(str);
                    }
                }
            }
            break
        case (command.match(/user [\wa-яё]+/i) || {}).input:
            for (let file of getFiles(files)){
                for (let str of searchTodo(file)){
                    if (str.toLowerCase().includes(command.substring(5).toLowerCase())) {
                        console.log(str);
                    }
                }
            }
            break
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
