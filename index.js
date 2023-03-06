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
            show();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function show(){
    let list = getFiles();
    list.map(x => x.match(/\/\/ TODO.*/g)).reduce(function(a, b){ return a.concat(b); }, []).forEach(x => console.log(x));
}

// TODO you can do it!
