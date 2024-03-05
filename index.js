const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getToDO(){
    let res = []
    let lines = getFiles();
    
    for (let q = 0; q < lines.length; q++){
        let txt = lines[q].split(/$/m);
        //console.log(txt);
        for (let i = 0; i < txt.length; i++) {
            let ind = txt[i].indexOf("// " + "TODO");
            if (ind != -1) {
                //console.log(txt[i]);
                res.push(txt[i].slice(ind+8));
            }
        }
    }
    return res
}

function getImportant(comments){
    let res = [];
    for (let i = 0; i < comments.length; i++){
        if (comments[i].indexOf('!') != -1){
            res.push(comments[i])
        }
    }
    return res;
}

function compareImportant(a, b){
    return b.split('!').length - a.split('!').length;
}

function sortByImportance(comments){
    comments.sort(compareImportant);
    return comments;
}


function sortByDate(comments){
    let res = []
    return res;
}

function getName(x){
    if (x.split(';') < 2) {
        return ""
    }
    else{
        let name = x.split(';')[0];
        return name;
    }
}

function sortByName(comments){
    comments.sort((a, b) => getName(a).localeCompare(getName(b)));
    return comments;
}


function getTodoByUser(username) {
    const usernameLower = username.toLowerCase();
    const regex = /\s*(.*)\s*;\s*(.*)\s*;\s*(.*)/;
    let todos = getToDO();
    todos = todos.map(v => v.match(regex));
    todos = todos.filter(match => match !== null && match[1].toLowerCase() === usernameLower);
    todos = todos.map(g => g[0]);
    return todos;
}

function processCommand(command) {
    const stringCommand = String(command);
    switch (command) {
        case 'important':
            console.log(getImportant(getToDO()));
            break;
        case 'user':
            const username = stringCommand.slice(5).toLowerCase();
            console.log(getTodoByUser(username));
            break;
        case 'sort importance':
            console.log(sortByImportance(getImportant(getToDO())));
            break
        case 'sort date':
            console.log(sortByDate(getToDO()));
            break
        case 'sort user':
            console.log(sortByName(getToDO()));
            break;
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getToDO());
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
