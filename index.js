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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            let mas = show();
            for (let todo of mas) {
                console.log(todo);
            }
        case 'important':
            let mass = show();
            showImportant(mass)
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function show() {
    var todoLines = [];
    for (let file of files) {
        for (let line of file.split("\n")) {
            let index = line.indexOf("// TODO ");
            if (index !== -1) {
                todoLines.push(line.slice(index + 8));
            }
        }
    }
    return todoLines;
}


// TODO you can do it!
function showImportant(todoLines) {
    for (let line of todoLines) {
        if (line.includes('!')) {
            console.log(line);
        }
    }
}
