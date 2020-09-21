const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getComments() {
    let files = getFiles();
    let comments = [];
    for (let file of files){
       let lines = file.split('\r\n');
       for(let line of lines){
           let i = 0;
           while(i + 7 < line.length){
               if (line[i] === '/' && line.slice(i + 1, i + 8) === '/ TODO '){ 
                   comments.push(line.slice(i));
                   break;
               }
               i++;
           }
        }
    }
    return comments;
}

function getImportant(){
    let comments = getComments();
    let important =[];
    for (let comment of comments){
        if (comment[comment.length-1] === '!') important.push(comment);
    }
    return important;
}

function getUserComments(user){
    let userComments = [];
    for(let comment of getComments()){
        let userComment = comment.split(';');
        for (let str of userComment){
            if (str.slice(8).toLowerCase() === user.toLowerCase()) userComments.push(comment);
        }
    }
    return userComments;
}

function sortImportant(impotant){
    let count = 0;
    for(let i = 0; i < impotant.length; i++){
        if (impotant[i] === '!') count--;
    }
    return count;
}

function sortUserName(user1, user2){
    if (user1 > user2) return 1;
    if (user1 === user2) return 0;
    if (user1 < user2) return -1;
}

function sortDated(datedComm1, datedComm2){
    datedComm1 = datedComm1.split(';');
    datedComm2 = datedComm2.split(';');
    if (datedComm1[1] > datedComm2[1]) return -1;
    if (datedComm1[1] === datedComm2[1]) return 0;
    if (datedComm1[1] < datedComm2[1]) return 1;
}

function getSortComments(rule){
    let comments = getComments();
    if (rule === 'importance'){
        return comments.sort((comment1, comment2) => sortImportant(comment1) - sortImportant(comment2));
    }
    if (rule === 'user'){
        let users = [];
        let str = [];
        for(let comment of comments){
            let userComments = comment.split(';');
            if (userComments.length === 3){
                users.push(comment);
            }
            else{
                str.push(comment);
            }
        }
        users.sort((user1, user2) => sortUserName(user1.toLowerCase(), user2.toLowerCase()));
        return users.concat(str);
    }
    if (rule === 'date'){
        let date = [];
        let str = [];
        for (let comment of comments){
            let datedComm = comment.split(';');
            if(datedComm.length === 3){
                date.push(comment);
            }
            else{
                str.push(comment);
            }
        }
        date.sort((comment1, comment2) => sortDated(comment1, comment2));
        return date.concat(str);
    }
}

function processCommand(command) {
    let user;
    let rule;
    if(command[0] === 'u') user = command.slice(5);
    if(command[0] === 's') rule = command.slice(5);
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getComments());
            break;
        case 'important':
            console.log(getImportant());
            break;
        case 'user ' + user:
            console.log(getUserComments(user));
            break;
        case 'sort ' + rule:
            console.log(getSortComments(rule));
            break;        
        default:
            console.log('wrong command');
            break;
            
    }
}

// TODO you can do it!
