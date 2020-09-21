const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const { get } = require('http');

const files = getFiles();

const toDoList = new Array();
const importantComments = new Array();
const specialComments = new Array();

function exclamationPointCounter(comment) {
    let idx = comment.indexOf('!');
    if (idx > 0)
        return comment.length - idx;
    return 0;
}

function getComments() {
    if(toDoList.length != 0) return;
    for(let i = 0; i < files.length; i++) {    
        let strings = files[i].split('\n');
        for (let j = 0; j < strings.length; j++) {
            let comment = strings[j].indexOf("// TODO");
            if(comment >= 0) {
                let com = "";
                let parts = strings[j].substring(comment, strings[j].length - 1).split(';');
                if(parts.length == 3) {
                    let userComment = {
                        userName : parts[0].toLowerCase().substring(8),
                        date : new Date(parts[1].substring(1)),
                        comment : parts[2].substring(1),
                        importance : exclamationPointCounter(strings[j].substring(comment, strings[j].length - 1))
                    };
                    specialComments.push(userComment);
                }
                else {
                    let userComment = {
                        userName : "",
                        date : "",
                        comment : strings[j].substring(comment, strings[j].length - 1),
                        importance : exclamationPointCounter(strings[j].substring(comment, strings[j].length - 1))
                    };
                    specialComments.push(userComment);
                }

                if(exclamationPointCounter(strings[j].substring(comment, strings[j].length - 1)) > 0) {
                    com = strings[j].substring(comment, strings[j].length - 1);
                    importantComments.push(com);                    
                }
                else
                    com = strings[j].substring(comment, strings[j].length - 1);  

                toDoList.push(com);           
            }
        }
    }
}

function showComments(commentList) {
    for (let comment of commentList)
        console.log(comment);
}

function getUserComments(username) {
    for (let comment of specialComments)
        if(comment.userName === username)
            console.log(`user ${username} :  ${comment.comment}`);
}

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let cmd = command.split(" ");
    switch (cmd[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            getComments();
            showComments(toDoList);
            break;
        case 'important':
            getComments();
            showComments(importantComments);
            break;
        case 'user':
            getComments();      
            getUserComments(cmd[1]);    
            break;
        case 'sort':
            getComments();      
            if(cmd[1] === "importance")
                specialComments.sort((a, b) =>  b.importance - a.importance);
            if (cmd[1] === "user")
                specialComments.sort(function(a, b){
                    if(a.userName < b.userName) { return 1; }
                    if(a.userName > b.userName) { return -1; }
                    return 0;});
            if (cmd[1] === "date")
                specialComments.sort((a,b) => b.date - a.date);
            showComments(specialComments);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
