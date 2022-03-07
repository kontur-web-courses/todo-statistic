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
    let arr = command.split(' ')
    let username = '';
    let date = '';
    if (arr.length === 2){
        username = arr[1]
        command = arr[0]
    }
    if (arr.length === 3) {
        date = arr[2]
        username = arr[1]
        command = arr[0]
    }
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            const allTODO = files.toString().match(/\/\/.*TODO.*/g);
            console.log(allTODO);
            break;
        case 'important':
            let exclameTODO = files.toString().match(/\/\/.*TODO.*/g);
            let result = '';
            for (str of exclameTODO){
                str = str.toString().match(/.*!.*/)
                if (str !== null){
                    result += str + '\n'
                }
            }
            console.log(result);
            break;
        case 'user':
            const userReTODO = files.toString().match(new RegExp(`\/\/.*TODO.*${username}.*`, 'g'));
            console.log(userReTODO);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
