const {getComments} = require('./getComments');
const {important} = require('./important');
const {user} = require('./user');
const {sort} = require('./sort');
const {date} = require('./date');
const {show} = require('./show');
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
    let name = command.replace(command.split(' ')[0] + ' ', '');
    command = command.split(' ')[0];
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
            
        case 'show':
            show(getComments(files));
            break;
        
        case 'important':
            show(important(files));
            break;

        case 'user':
            show(user(files, name));
            break;

        case 'sort':
            show(sort(files, name));
            break;

        case 'date':
            show(date(files, name))
            break;

        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
