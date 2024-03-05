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
            getTODOLines();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getTODOLines()
{
    for(let file of files){
        let lines = file.split('\n');
        for(let line of lines){
            const index = line.indexOf("// TODO")
            if(index !== -1){
                console.log(line.slice(index));
            }
        }
    }
}
// TODO you can do it!
