const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const toDo = '\/\/ TODO';

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let commands = command.split(' ');
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getShow())
            break
        case 'importance':
            console.log(getImportance())
             break
        case 'user':
            console.log(getUser(commands[1]))
            break
        case 'sort ':
            console.log(getSort(commands[1]));
            break;        
        default:
            console.log('wrong command');
            break;
    }
}

function getShow() {
    let result = []
    for (const file of files) {
        for (const line of file.content.split('\n')) {
            const todoIndex = line.indexOf(toDo);
            if (todoIndex >= 0) {
                const todoString = line.substr(todoIndex + toDo.length);
                const todo = parseTodo(file.name, todoString);
                result.push(todo)
            }      
        }
    }
    return result;
}

function getImportance(comment) {
    if (!comment.incledes('!'))
        return 0;
    let result = 0;
    for(let i=0; i < comment.length; i++) {
        if (comment[i] ==='!') {
            result++;
        }
    }
    return result;
}

function getUser(user) {
    const end = ";";
    let result = getShow();
    let comparer = function(value) {
        let startIndex = '// TODO'.length + 1;
        let nameEndIndex = value.indexOf(end);
        return value.substring(startIndex, nameEndIndex) === user;
    } 
    return result.filter(comparer);
}

function sortImportance(importance){
    let count = 0;
    for(let i = 0; i < importance.length; i++){
        if (importance[i] === '!') count--;
    }
    return count;
}

function sortUser(user1, user2){
    if (user1 > user2) return 1;
    if (user1 === user2) return 0;
    if (user1 < user2) return -1;
}

function sortDate(datedComm1, datedComm2){
    datedComm1 = datedComm1.split(';');
    datedComm2 = datedComm2.split(';');
    if (datedComm1[1] > datedComm2[1]) return -1;
    if (datedComm1[1] === datedComm2[1]) return 0;
    if (datedComm1[1] < datedComm2[1]) return 1;
}

function getSort(argument){
    let comments = getComments();
    if (argument === 'importance'){
        return comments.sort((comment1, comment2) => sortImportance(comment1) - sortImportance(comment2));
    }
    if (argument === 'user'){
        let users = [];
        let string = [];
        for(let comment of comments){
            let userComments = comment.split(';');
            if (userComments.length === 3){
                users.push(comment);
            }
            else{
                string.push(comment);
            }
        }
        users.sort((user1, user2) => sortUser(user1.toLowerCase(), user2.toLowerCase()));
        return users.concat(string);
    }
    if (argument === 'date'){
        let date = [];
        let string = [];
        for (let comment of comments){
            let datedComm = comment.split(';');
            if(datedComm.length === 3){
                date.push(comment);
            }
            else{
                string.push(comment);
            }
        }
        date.sort((comment1, comment2) => sortDate(comment1, comment2));
        return date.concat(string);
    }
}

function formatDate(date){
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

// TODO you can do it!
