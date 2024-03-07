const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTODO(strFiles) {
    const todos = []
    const todoRegex = /\/\/ TODO .*/g;
    for(let i = 0; i < strFiles.length; i++) {
        if (strFiles[i].match(todoRegex)) {
            todos.push(...strFiles[i].match(todoRegex));
        }
    }
    return todos;
}

function processCommand(command) {
    const todos = getAllTODO(getFiles());
    switch (command.split(' ')[0]) {
        case 'show':
            for (let comment of todos) {
                console.log(comment);
            }
            break;
        case 'important':
            todos.forEach(todo => {
                if(todo.includes('!')){
                    console.log(todo);
                }
            });
            break;
        case 'user':
            const user = command.split(' ')[1].toLowerCase();
            todos.forEach(todo => {
                if (todo.includes(';') && todo.split(';')[0].split(' ')[2].toLowerCase() === user) {
                    console.log(todo);
                }
            });
            break;
        case 'sort':
            sortComments(todos, command.split(' ')[1])
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function sortComments(comments, mode) {
    switch (mode){
        case 'importance':
            comments.sort((a, b) => {
                let countA = (a.match(/!/g) || []).length;
                let countB = (b.match(/!/g) || []).length;
                return countB - countA;
            });
            logComments(comments);
            break;
        case 'user':
            comments = sortByUsers(comments);
            logComments(comments);
            break;
        case 'date':
            comments.sort((a, b) => {
                if (a.includes(';') && b.includes(';')) {
                    return new Date(b.split('; ')[1]) - new Date(a.split('; ')[1]);
                }
                else if (a.includes(';')) {
                    return -1;
                }
                else if (b.includes(';')) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            logComments(comments);
            break;
        default:
            console.log('wrong mode for sort')
            break;
    }
}

function logComments(comments) {
    for (let comment of comments) {
        console.log(comment);
    }
}

function sortByUsers(comments) {
    let usersMap = {};
    let noUsers = [];
    let sortedArray = comments.sort((a, b) => {
        let userA = a.includes(';');
        let userB = b.includes(';');
        let user1 = userA ? a.split('; ')[0].split(' ')[2].toLowerCase() : '';
        let user2 = userB ? b.split('; ')[0].split(' ')[2].toLowerCase() : '';
        usersMap[user1] = usersMap[user1] || [];
        usersMap[user2] = usersMap[user2] || [];
        if (user1 && user2 && user1 !== user2) {
            usersMap[user1].push(a);
            usersMap[user2].push(b);
            return 0;
        }
        else if (user1 && user2 && user1 === user2) {
            return 0;
        }
        else if (!user1 && !user2) {
            noUsers.push(a);
            noUsers.push(b);
            return 0;
        }
        else if (user1) {
            usersMap[user1].push(a);
            noUsers.push(b);
            return -1;
        }
        else {
            usersMap[user2].push(b);
            noUsers.push(a);
            return 1;
        }
    });
    sortedArray = Object.values(usersMap).reduce((result, value) => result.concat(value), []);
    let finalSortedArray = sortedArray.concat(noUsers);
    return finalSortedArray.filter((item, index) => finalSortedArray.indexOf(item) === index);
}

// TODO you can do it!
