const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const allToDO = getAllTodo();

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
        let found = [...f.matchAll(regex)].map(x => x[1])
        result.push(...found)
    }
    return result;
}

function processCommand(command) {
    const reg = command.match('user (.*)')
    if (reg != null){
        const username = reg[1];
        command = 'name'
    }

    switch (command) {
        case 'name':
            const reg = command.match('(.*?);(.*?);(.*)')
            if (reg != null){
                let [username, date, text] = [reg[1], reg[2], reg[3]]
                console.log(reg[1], reg[2], reg[3])
            }
            break;
        case 'important':
            getAllTodo()
                .filter(x => x.indexOf('!') != -1)
                .map(function(x) {console.log(x.replaceAll('!', ""))});
            readLine(processCommand);
            break;
        case 'show':
            getAllTodo().map(function(x) {console.log(x.replaceAll('!', ""))});
            readLine(processCommand);
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}



// TODO you can do it!
