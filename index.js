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
    const arg = command.split(' ');
    switch (arg[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            let mas = show();
            for (let todo of mas) {
                console.log(todo);
            }
            break;
        case 'important':
            let mass = show();
            showImportant(mass)
            break;
        case 'user':
            let name = arg[1].toLowerCase();
            let users =findUsers();
            if (name in users){
            for (let comment of users[name]){
                console.log(comment);
            }}
            else{
                console.log("User not find")
            }
            break;

        default:
            console.log('wrong command');
            break;
    }
}
function findUsers(){
    let data=show();
    let users={};
    for(comment of data){
        let parseData=comment.split(";")
        if (parseData.length>2){
            let user=parseData[0].trim();
            if (!(user in users)){
                users[user]=[]
            }
            users[user].push(parseData[2].trim())
        }
    }
    return users;
}
function show() {
    let todoLines = [];
    for (let file of files) {
        for (let line of file.split("\n")) {
            let index = line.indexOf("// TODO ");
            if (index !== -1) {
                todoLines.push(line.slice(index + 8));
            }
        }
    }
    return todoLines;
}


// TODO you can do it!
function showImportant(todoLines) {
    for (let line of todoLines) {
        if (line.includes('!')) {
            console.log(line);
        }
    }
}
