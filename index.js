const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);
// TODO Переделать это!
function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let arguments = command.split(" ");
    let com = arguments[0];
    let data = arguments[1];
    switch (com) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            let coments1 = getToDo();
            console.log(coments1);
            break;
        case 'data':
            let coments2 = getToDo();
            let result = [];
            for(const comment of coments2){
                let index = comment.indexOf(data);
                if (index !== -1) {
                    result.push(comment);
                }
            }
            console.log(result);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function findAllOccurrences(text) {
    const pattern = /\/\/\s*TODO\s.*/g;
    const regex = new RegExp(pattern, 'g');
    let matches = text.match(regex)
    return matches;
}

// TODO you can do it!
function getToDo(){

    let comentsFiles = [];
    for (const fileText of getFiles()) {
        let col = findAllOccurrences(fileText)
        for (let i = 0; i < col.length; i++) { // выведет 0, затем 1, затем 2
            comentsFiles.push(col[i]);
        }
    }
    return comentsFiles;
}