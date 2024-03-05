const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todoRegex = /\/\/ TODO (.*)\n?/g;
console.log('Please, write your command!');
readLine(processCommand);

function getTODOs(){
    return files.map(p => [...p.matchAll(todoRegex)].map(p => p[1])).flat()
}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function findImportantComments(comments) {
    let result = [];
    for (let comment of comments) {
        if (comment.indexOf('!') >= 0) {
            result.push(comment);
        }
    }
    return result;
}

function parseAutorsComments(comments) {
    let result = [];
    for (let comment of comments) {
        const data = comment.split(';');
        if (data.length >= 3) {
            const parseDate = {
                name: data[0].slice(data[0].indexOf('TODO ') + 5),
                commentDate: new Date(data[1].trim()),
                comment: data[2].slice(1)
            };
            result.push(parseDate);
        }
    }
    return result;
}

// TODO you can do it!