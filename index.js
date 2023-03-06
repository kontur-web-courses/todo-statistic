const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function GetAllCommentsFromFiles(files) {
    let comments = [];
    for (let file of files) {
        let comment = file.match(/\/\/ TODO .*/g);
        if (comment != null) {
            for (const com of comment){
                comments.push(com);
            }
        }
    }
    return comments;
}

function GetCountSimbol(str) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '!') {
            count++;
        }
    }
    return count;
}

function GetName(str){
    let name = str.match(/\/\/ TODO .*/g);
    return name;
}

function GetDate(str){
    let reg = str.match(/\d{4}([\/.-])\d{2}\1\d{2}/g);
    if (reg == null) return Date(null);
    let date = new Date(reg[0]);
    return date;    

}


function CompareString(str1, str2){
    if (str1 > str2) return 1;
    if (str1 === str2) return 0;
    if (str1 < str2) return -1;
}



function processCommand(command) {
    let commands = command.split(' ');
    let comments = GetAllCommentsFromFiles(getFiles());
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            comments = GetAllCommentsFromFiles(getFiles());
            for (let comment of comments) {
                console.log(comment);
            }
            break;
        case 'important':
            comments = GetAllCommentsFromFiles(getFiles());
            for (let comment of comments) {
                if (comment.includes('!')) {
                    console.log(comment);
                }
            }
            break;
        case 'user':
            let username = commands[1].toLowerCase();
            comments = GetAllCommentsFromFiles(getFiles());
            for (let comment of comments) {
                if (comment.toLowerCase().includes(`${username};`)) {
                    console.log(comment);
                }
            }
            break;
        case 'sort':
            let sort = commands[1];
            comments = GetAllCommentsFromFiles(getFiles());
            switch (sort) {
                case 'importance':
                    comments.sort((a, b) => GetCountSimbol(b) - GetCountSimbol(a));
                    for (let comment of comments) {
                        console.log(comment);
                    }
                    break;
                case 'user':
                    comments.sort((a, b) => a.localeCompare(b));
                    for (let comment of comments) {
                        console.log(comment);
                    }
                    break;
                case 'date':
                    comments.sort((a, b) => GetDate(b) - GetDate(a));
                    for (let comment of comments) {
                        console.log(comment);
                    }
                break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
