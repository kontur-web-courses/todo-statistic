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
    })).flat().map(p => {
        const parsed = parseAuthorsComment(p)
        return {
            comment: p,
            isImportant: p.includes('!'),
            Author: parsed.author,
            Date: parsed.commentDate
        }
    })
}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(comm) {
    const command = comm.split(' ')
    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(todos)
            break;
        case 'important':
            console.log(findImportantComments())
            break;
        case 'user':
            console.log(findAuthorComments(command.slice(1).join(' ')))
            break;
        case 'date':
            console.log(findDateComments(new Date(command.slice(1).join(' '))))
            break;
        case 'sort':
            let a;
            switch (command.slice(1).join(' ')){
                case 'importance':
                    a = "isImportant"
                    break;
                case 'user':
                    a = "Author"
                    break;
                case 'date':
                    a = "Date"
                    break;
            }


            console.log(Sort(a))
        default:
            console.log('wrong command');
            break;
    }
}

function findImportantComments() {
    let result = [];
    for (let comment of todos) {
        if (comment['isImportant']) {
            result.push(comment['comment']);
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
    return  {
        author: null,
        commentDate: null,
        comment: comment
    };
}

function findAuthorComments(author) {
    let result = [];
    for (let commentData of todos) {
        const comment = commentData['comment'];
        const parseComment = parseAuthorsComment(comment);
        if (parseComment !== false && parseComment['author'].toLowerCase() === author.toLowerCase()) {
            result.push(parseComment['comment']);
        }
    }
    return result;
}

function findDateComments(date) {
    let result = [];
    for (let commentData of todos) {
        const comment = commentData['comment'];
        const parseComment = parseAuthorsComment(comment);
        if (parseComment !== false && parseComment['commentDate'] > date) {
            result.push(parseComment['comment']);
        }
    }
    return result;
}

function Sort(by){
    return todos.slice().sort((a,b) => {
        if (a?.constructor === String)
            return a.localeCompare(b);
        else
            return b[by] - a[by]
    })
}

// TODO you can do it!