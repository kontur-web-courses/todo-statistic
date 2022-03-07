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
    for(line of getAllLines()){
        if(line.includes('// TODO')){
            yield line.slice(line.indexOf('// TODO')+7);
        }
    }
}

function show(){
    for(let line of getTODOLines()){
        console.log(line.trim());
    }
}

function important(){
    for(let line of getTODOLines()){
        if(line.includes('!'))
            console.log(line.trim());
    }
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show();
            break;
        case 'important':
            important();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
