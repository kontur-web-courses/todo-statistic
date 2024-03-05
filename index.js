const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todoRegex = /\/\/ TODO (.*)\n?/g;
const todos = getTODOs()
console.log('Please, write your command!');
readLine(processCommand);

function getTODOs(){
    return files.map(p => [...(p.matchAll(todoRegex) ?? [])].map(p => {
        if (1 in p)
            return p[1]
    })).flat()
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
        case 'show':
            console.log(todos)
            break
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

function parseAuthorsComment(comment) {
    const data = comment.split(';');
    if (data.length >= 3) {
        const parseDate = {
            author: data[0],
            commentDate: new Date(data[1].trim()),
            comment: data[2].slice(1)
        };
        return parseDate;
    }
    return false;
}

function findAuthorComments(comments, author) {
    let result = [];
    for (let comment of comments) {
        const parseComment = parseAuthorsComment(comment);
        if (parseComment !== false && parseComment['author'].toLowerCase() == author.toLowerCase()) {
            result.push(parseComment['comment']);
        }
    }
    return result;
}

function findDateComments(date) {
    let result = [];
    for (let comment of todos) {
        const parseComment = parseAuthorsComment(comment);
        if (parseComment !== false && parseComment['commentDate'] > date) {
            result.push(parseComment['comment']);
        }
    }
    return result;
}

// TODO you can do it!