const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const regex = /(\/\/ *TODO *.*$)/mg;
const nameDataRegex = /(?:\/\/ *TODO (.+); (.+); (?:.*$))/mg;


console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let cmd = command.split(' ');
    switch (cmd[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            getComments().forEach(comment => console.log(comment));
            break;
        case 'important':
            getComments().forEach(comment => {
                if (comment.indexOf('!') !== -1){
                    console.log(comment);
                }
            })
            break;
        case 'user':
            if (cmd.length > 1){
                getUsers(cmd[1]);
            }
            break;
        case 'sort':
                switch (cmd[1]){
                    case 'importance':
                        sortByImportance();
                        break;
                    case 'user':
                        sortByUsers();
                        break;
                    case 'date':
                        sortByDate();
                        break;
                    default:
                        console.log('wrong sort option');
                        break;
                }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getComments(){
    const comments = [];
    files.forEach(text => {
        let match;
        while ((match = regex.exec(text)) !== null) {
                comments.push(match[1]);
        }
    });
    return comments;
}

function sortByCharCount(arr, char) {
    let charCountMap = {};
    arr.forEach(str => {
        charCountMap[str] = str.split(char).length - 1;
    });
    arr.sort((a, b) => charCountMap[b] - charCountMap[a]);
    return arr;
}

function dateSorting(arr) {
    let dateMap = {};
    for (const comment of arr) {
        let match;
        if ((match = nameDataRegex.exec(comment)) !== null){
            dateMap[comment] = match[2];
        }
    }
    console.log(dateMap);
    arr.sort((a, b) => +(new Date(dateMap[b]) - new Date(dateMap[a])));
    return arr;
}

function getUsers(user){
    getComments().forEach(comment => {
        if ((match = nameDataRegex.exec(comment)) !== null){
            if (match[1].toLowerCase() === user.toLowerCase()){
                console.log(comment);
            }
        }
    })
}

function sortByImportance() {
    let important = [];
    let notImportant = [];
    getComments().forEach(comment => {
        if (comment.indexOf('!') !== -1){
            important.push(comment);
        } else {
            notImportant.push(comment);
        }
    })
    important = sortByCharCount(important, '!');
    important.forEach(comment => console.log(comment));
    notImportant.forEach(comment => console.log(comment));
}

function sortByUsers(){
    let withUser = [];
    let withoutUser = [];
    getComments().forEach(comment => {
        if ((match = nameDataRegex.exec(comment)) !== null){
            withUser.push(comment);
        } else {
            withoutUser.push(comment);
        }
    })
    withUser.forEach(comment => console.log(comment));
    withoutUser.forEach(comment => console.log(comment));
}

function sortByDate() {
    let withDate = [];
    let withoutDate = [];
        for (const file of getComments()) {
            let res = file.match(nameDataRegex)
            if (res !== null){
                withDate.push(file);
            } else {
                withoutDate.push(file);
            }
        }
    withDate = dateSorting(withDate);
    withDate.forEach(comment => console.log(comment));
    withoutDate.forEach(comment => console.log(comment));
}
// TODO you can do it!
