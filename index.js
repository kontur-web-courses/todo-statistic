const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function* getAllLines(){
    for (let fileLines of getFiles()){
        for (let line of fileLines.split('\n')) {
            yield line;
        }
    }
}

function* getTODOLines(){
    let result = [];
    for(line of getAllLines()){
        if(line.includes('// TODO')){
            let res = line.slice(line.indexOf('// TODO')+7);
        }
    }
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'todo':
            console.log(Array.from(getTODOLines()));
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
