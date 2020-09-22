const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const { get } = require('http');
const { connected } = require('process');

const files = getFiles();
const toDoList = new Array();
const lines = new Array();; 

function exclamationPointCounter(comment) {
    let idx = comment.indexOf('!');
    if (idx > 0)
        return comment.length - idx;
    return 0;
}

function createCommentObj(parseComment) {
    let commentObj;
    if (parseComment.length == 3) {
        commentObj = {
            userName : parseComment[0].substring(8).toLowerCase(),
            date : new Date(parseComment[1]),
            comment : parseComment[2],
            importance : exclamationPointCounter(parseComment[2]),
            commentString : parseComment.join(" : ")
        }
    }
    else {
         commentObj = {
            userName : "",
            date : "",
            comment : parseComment[0],
            importance : exclamationPointCounter(parseComment[0]),
            commentString : parseComment[0]
        }
    }
    toDoList.push(commentObj);
}

function getComments() {
    for (let doc of lines) {
        for(let line of doc) {
            let isComment = line.indexOf("// TODO");
            if (isComment >= 0) {
                let comment = line.substring(isComment);
                let commentParts = comment.split(";");
                createCommentObj(commentParts);
            }  
         }
    }   
}

function showComments(commentList) {
    for (let comment of commentList)
            console.log(comment.commentString);
}

function showUserComments(username) {
    for (let com of toDoList.filter((c) => c.userName === username))
            console.log(`user ${username} :  ${com.comment}`);
}

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    for (let doc of files)
         lines.push(doc.split('\n'));
    let cmd = command.split(" ");
    getComments();
    switch (cmd[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showComments(toDoList);
            break;
        case 'important':
            showComments(toDoList.filter(comment => comment.importance > 0));
            break;
        case 'user':
            showUserComments(cmd[1]);    
            break;
        case 'sort':
            if(cmd[1] === "importance")
                 toDoList.sort((a, b) =>  b.importance - a.importance);
            if (cmd[1] === "user")
                toDoList.sort(function(a, b){
                    if(a.userName < b.userName) { return 1; }
                    if(a.userName > b.userName) { return -1; }
                    return 0;
                });
            if (cmd[1] === "date")
                toDoList.sort((a,b) => b.date - a.date);
            showComments(toDoList);
            break;
        default:
            console.log('wrong command');
            break;
    }
}
// TODO you can do it!