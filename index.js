const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const comments = getComments()
console.log(comments);

function getComments() {
    let res = [];
    for (let file of files) {
        const regular_todo = /\/\/ TODO .+/g
        let answ = file.match(regular_todo);
        res = res.concat(answ);
    }
    return res;
}


function getImportant() {
    const res = [];
    let important = comments.filter(x => x.indexOf('!') !== -1);
    res.push(important.join('\n'));
    return res.join('\n');
}


console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
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

// TODO you can do it!
