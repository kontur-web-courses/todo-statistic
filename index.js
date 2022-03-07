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
        case 'show':
            let files = getFiles();
            let comments = []
            for (file of files){
                let current = [];
                let toDoIndex = file.indexOf('// TODO ');
                let newLineIndex = file.indexOf('\r', toDoIndex);
                while (toDoIndex != -1) {
                    //console.log(toDoIndex, newLineIndex);
                    current.push(file.slice(toDoIndex, newLineIndex));
                    
                    toDoIndex = file.indexOf('// TODO ', newLineIndex);
                    newLineIndex = file.indexOf('\r', toDoIndex); 
                    //console.log(current);
                }
                
                comments.push(current);
            }
            console.log(comments);
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
