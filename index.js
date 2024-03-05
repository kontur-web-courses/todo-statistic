const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let splitted = command.split(' ');
    switch (splitted[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            onShow();
            break;
        case 'important':
            onImportant();
            break;
        case 'user':
            onUsername(splitted[1].toLowerCase());
            break;
        case 'sort':
            onSort(splitted[1].toLowerCase());
            break;
        case 'date':
            onDate(splitted.slice(1));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllStrings() {
    let allInfo = [];
    for (let fileData of getFiles()) {
        allInfo.push(fileData.split('\r\n'));
    }
    return allInfo;
}

function getAllComments() {
    let filesStrings = getAllStrings();
    let comments = [];
    let commentStart = "// TODO ";
    for (let fileString of filesStrings) {
        for (let str of fileString) {
            if (str.startsWith(commentStart)) {
                comments.push(str);
            }
        }
    }
    return comments;
} 

function onShow() {
    let allComments = getAllComments();
    print(allComments);
}

function getImportant() {
    let important = [];
    let comments = getAllComments();
    for (let comment of comments) {
        if (comment.includes('!')) {
            important.push(comment)
        }
    }

    return important;
}

function onImportant() {
    let allImportant = getImportant();
    print(allImportant);
}

function getUsersToComments() {
    let dict = {};
    let allComments = getAllComments();

    for (comment of allComments){
        if (comment.match('\/\/ TODO.+;.+;.+')) {
            let splitted = comment.split(";");
            let username = splitted[0].slice(8).toLowerCase();

            if (dict[username] === undefined){
                dict[username] = [comment];
            }
            else{
                dict[username].push(comment);
            }
        }
    }

    return dict;
}


function onUsername(username) {
    let allUser = getUsersToComments();
    let userComments = allUser[username];

    if (userComments === undefined){
        console.log("No comments from this user");
        return;
    }

    print(userComments);
}

function getSortedByUser() {
    let allComments = getAllComments();
    let unpacked = unpack(getUsersToComments());
    let rem = without(allComments, unpacked);

    return[...unpacked, ...rem];
}

function getSortedByDate() {
    let allComments = getSortedByUser();
    let unpacked = unpack(getUsersToComments());
    let rem = without(allComments, unpacked);
    
    let sorted = unpacked.sort((a, b) => new Date(b.split(";")[1].trim()).getTime() - new Date(a.split(";")[1].trim()).getTime());
    
    return [...sorted, ...rem];
}

function getSortedByImportance() {
    let important = getImportant();
    let allComments = getAllComments();

    let sorted = important.sort((a, b) => b.split("!").length - 1 - (a.split("!").length - 1));
    let rem = without(allComments, important);

    return [...sorted, ...rem]
}

function onSort(parameter) {
    let res = []
    switch(parameter){
        case "importance":
            res = getSortedByImportance();
            break;
        case "date":
            res = getSortedByDate();
            break;
        case "user":
            res = getSortedByUser();
            break;
        default:
            console.log("Unknown parameter");
            return;
    }

    print(res);
}

function without(a, b) {
    return  [...a].filter( element => !(new Set(b).has(element)) );
}


function unpack(dict) {
    return Object.values(dict).reduce((r, e) => (r.push(...e), r), []);
}

function onDate(date) {
    let dateObj = new Date(date);

    let unpacked = unpack(getUsersToComments());

    let filtered = unpacked.filter(element => new Date(element.split(";")[1].trim()).getTime() > dateObj.getTime());

    print(filtered);
}

function print(arr) {
    for (let element of arr) {
        console.log(element);
    }
}
// TODO you can do it!
