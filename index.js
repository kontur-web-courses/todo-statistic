const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllToDos() {
    const files = getFiles();
    return files.flatMap(file => file.split('\n').filter(line => line.includes('\/\/ TODO')).map(line => line.substr(line.indexOf('\/\/ TODO'))));
}

function getImportantToDos() {
    const files = getAllToDos();
    return files.filter(line => line.includes('!'));
}

function getUserToDos(user) {
    const files = getAllToDos();
    return files.filter(line => line.toLowerCase().startsWith(`\/\/ todo ${user};`));
}

function sortedToDosWithCmp(cmp) {
    let files = getAllToDos();
    files.sort(cmp);
    return files;
}

function importanceCmp(a, b) {
    return (b.match('!') || []).length - (a.match(/!/g) || []).length;
}

function dateCmp(a, b) {
    if (!/^\/\/ TODO .+;\s?(.+);/.test(b)) {
        return 0;
    }
    if (!/^\/\/ TODO .+;\s?(.+);/.test(a)) {
        return 1;
    }
    const aDate = new Date(a.match(/^\/\/ TODO .+;\s?(.+);/.test(a)));
    const bDate = new Date(b.match(/^\/\/ TODO .+;\s?(.+);/.test(b)));
    return bDate.getTime() - aDate.getTime();
}

function userCmp(a, b) {
    if (!/^\/\/ TODO (.+);\s?.+;/.test(b)) {
        return 0;
    }
    if (!/^\/\/ TODO (.+);\s?.+;/.test(a)) {
        return 1;
    }
    const aUser = a.match(/^\/\/ TODO (.+);\s?.+;/)[1].toLowerCase();
    const bUser = b.match(/^\/\/ TODO (.+);\s?.+;/)[1].toLowerCase();
    return aUser.localeCompare(bUser);
}

function processCommand(command) {
    switch (true) {
        case command === 'exit':
            process.exit(0);
            break;
        case command === 'show':
            console.log(getAllToDos());
            break;
        case command === 'important':
            console.log(getImportantToDos());
            break;
        case /^user (.+)$/.test(command):
            const name = command.match(/^user (.+)$/)[1].toLowerCase();
            console.log(getUserToDos(name));
            break;
        case /^sort (.+)$/.test(command):
            const arg = command.match(/^sort (.+)$/)[1];
            switch (arg) {
                case 'importance':
                    console.log(sortedToDosWithCmp(importanceCmp));
                    break;
                case 'date':
                    console.log(sortedToDosWithCmp(dateCmp));
                    break;
                case 'user':
                    console.log(sortedToDosWithCmp(userCmp));
                    break;
                default:
                    console.log('wrong command');
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
