const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const comments = getComments()

function getComments() {
    let res = [];
    const regular_todo = /\/\/ TODO .+/g
    for (let file of files) {
        let answ = file.match(regular_todo);
        res = res.concat(answ);
    }
    return res;
}

function getImportant() {
    const res = [];
    const important = comments.filter(x => x.indexOf('!') !== -1);
    res.push(important.join('\n'));
    return res.join('\n');
}

function getUser(user) {
    const result = [];
    for (let line of comments) {
        let answ = line.split(';');
        if (answ.length !== 3) {
            continue;
        }
        const name = answ[0].split(" ");
        if (name[2] === user) {
            result.push(answ[2]);
        }
    }
    return result.join('\n');
}

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    const commands = command.split(' ');
    switch (commands[0]) {
        case 'user':
            console.log(getUser(commands[1]));
            break;
        case 'important':
            console.log(getImportant());
            break;
        case 'show':
            console.log(comments);
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}
