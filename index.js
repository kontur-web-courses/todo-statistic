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
    let command_name = command.split(' ')[0];
    let args = command.split(' ').slice(1);
    switch (command_name) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show();
            break;
        case 'important':
            important();
            break;
        case 'user':
            user(args[0]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function show() {
    let list = getFiles();
    list.map(x => x.match(/\/\/ TODO.*/g)).reduce(function (a, b) {
        return a.concat(b);
    }, []).forEach(x => console.log(x));
}

function important() {
    let list = getFiles();
    list.map(x => x.match(/\/\/ TODO.*!.*/g)).reduce(function (a, b) {
        return b === null ? a : a.concat(b);
    }, []).forEach(x => console.log(x));
}

function user(username) {
    files.map(x => x.match(new RegExp(`\/\/ TODO ${username};.*;.*`, 'gi')))
        .reduce((a, b) => b === null ? a : a.concat(b), [])
        .forEach(x => console.log(x));
}


// TODO you can do it!
