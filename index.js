const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTodo() {
    let result = []
    for (let f of files){
        const regex = '\/\/ TODO (.*)'
        const r =
        let found = [...f.matchAll(regex)].map(x => x[1])
        result.push(...found)
    }
    return result;
}

function processCommand(command) {
    let [exactCommand, argument] = command.split(' ')
    switch (exactCommand) {
        case 'user':
            getAllTodo().filter( x =>
            {
                const reg = x.match('(.*?);(.*?);(.*)')
                if (reg != null){
                    let [username, date, text] = [reg[1], reg[2], reg[3]]
                    if (username === argument) return true
                }
                return false;
            }).map(function(x) {console.log(x.replaceAll('!', ""))});
            break;

        case 'important':
            printImportant();
            readLine(processCommand);
            break;
        case 'show':
            getAllTodo().map(function(x) {console.log(x.replaceAll('!', ""))});
            readLine(processCommand);
            break;
        case 'exit':
            process.exit(0);
            break;
        case 'sort':
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function printImportant(){
    getAllTodo()
        .filter(x => x.indexOf('!') !== -1)
        .map(function(x) {console.log(x.replaceAll('!', ""))});
}

function printNotImportant(){
    getAllTodo()
        .filter(x => x.indexOf('!') === -1)
        .map(function(x) {console.log(x.replaceAll('!', ""))});
}

// TODO you can do it!
