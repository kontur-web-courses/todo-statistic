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
            showTODO();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function findTODO() {
    const allTODO = [];
    for(const file of files){
        const lines = file.split('\n');
        for(const line of lines){
            const index = line.indexOf('// ' +
                'TODO', 0);
            if(index === -1) continue;
            allTODO.push(line.slice(index + 8, line.length));
        }
    }
    return allTODO;
}

function showTODO() {
    for(const el of findTODO()){
        console.log(el);
    }
}
// TODO you can do it!
