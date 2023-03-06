const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const strings = getFiles().map(f => f.split('\n')).reduce((a, b) => a.concat(b));
const regex = /\/\/ TODO (.*)/;

function todo(strings){
    let result = []
    for(let str of strings){
        let todo = str.match(regex);
        if(todo)
            result.push(todo[0]);
    }
    return result;
}
let t = todo(strings);

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
            for(let i of t){
                console.log(i);
            }
            break;
        case 'important':
            for (let i of t) {
                if (i.at(-1) === '!') {
                    console.log(i);
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
