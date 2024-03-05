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
            printArray(getTODOLines());
            break;
        case 'important' :
            printArray(getImportantLines(getTODOLines()));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getTODOLines()
{
    const todoLine = 'TODO';
    chosenLines = new Array();
    for(let file of files){
        let lines = file.split('\n');
        for(let line of lines){
            const index = line.indexOf(`// ${todoLine}`)
            if(index !== -1){
                chosenLines.push(line.substring(index));
            }
        }
    }
    return chosenLines;
}

function getImportantLines(lines){
    const res = new Array();
    for(const line of lines){
        if(line.indexOf('!') !== -1){
            res.push(line);
        }
    }
    return res;
}

function printArray(arr){
    for(const item of arr){
        console.log(item);
    }
}
// TODO you can do it!
