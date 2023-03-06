const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTODOs(text){
    const reg = RegExp(/\/\/ TODO .*$/, "gm")
    return text.match(reg)
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            getFiles().forEach((value, index, arr) => {
                for (const v of getTODOs(value)) {
                    console.log(v);
                }
            })
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
