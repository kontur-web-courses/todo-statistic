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
    let command_split = command.split(' ')
    switch (command_split[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(showCommand());
            break;
        case 'important':
            let importants = getImportants();
            let str = importants.join('\n');
            console.log(str);
            break;
        case 'user':
            let userName = command.split(' ')[1];
            let res = showCommandsFromUser(userName).join('\n');
            console.log(res);
            break;
        case 'sort':
            switch(command_split[1]) {
                case 'importance':
                    console.log(sortImportants());
                    break;
                case 'user':
                    let args = sortUser();
                    let str1 = args.join('\n');
                    console.log(str1);
                    break;
                case 'date':
                    sortDate();
                    break;
            }
            break;
        case 'date':
            let cur_date = command_split[1];
            console.log(getDate(cur_date));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function sortDate(){
    let all_args = showCommand();
    for (let item of all_args){
        let cur_date = get_date(item);
        if (cur_date === -1)
            continue;
        sort_data(all_args);
    }
    console.log(all_args);
}

function get_date(item){
    let dateReg = /\d{4}-\d{2}-\d{2}/;
    let find_date = item.match(dateReg)
    return find_date ? find_date[0]: -1;
}

function sort_data(array) {
    array.sort(function(a,b){
        return new Date(get_date(b)) - new Date(get_date(a));
    });
    return array;
}

function sortImportants(){
    let importants_args = getImportants();
    let all_args = showCommand();
    let res = importants_args;
    for (let item of all_args) {
        if (importants_args.includes(item))
            continue;
        res.push(item);
    }
    return res;
}

function showCommand() {
    let res = [];
    let filesArr = files.toString().split('\n');
    for (let file of filesArr) {
        if (file.includes('// TODO')){
            let i = file.indexOf('// TODO');
            if (file.includes('file.includes(') || file.includes('file.indexOf'))
                continue;
            res.push(file.substr(i, file.length));
        }
    }
    return res;
}

function getImportants() {
    let res = [];
    let todos = showCommand(files);
    for (const todo of todos) {
        if (todo.includes('!')) {
            res.push(todo);
        }
    }
    return res;
}

function sortUser() {
    let named = [];
    let unnamed = []
    let todos = showCommand();
    for (const todo of todos) {
        let i = todo.indexOf(';');
        if (i !== -1) {
            named.push(todo.toLowerCase())
        } else {
            unnamed.push(todo.toLowerCase())
        }
    }
    named.sort()
    return named.concat(unnamed);
}


function showCommandsFromUser(user) {
    let res = []
    let todos = showCommand();
    for (const todo of todos) {
        let i = todo.indexOf(';');
        let username = i === -1 ? '' : todo.slice(8, i);
        if (user.toLowerCase() === username.toLowerCase())
            res.push(todo);
    }
    return res;
}

function getDate(curDate){
    let res = [];
    let all_commands = showCommand();
    for (let item of all_commands){
        let thisDate = get_date(item);
        if (get_date(item) !== -1)
            if (new Date(get_date(thisDate)) - new Date(curDate) >= 0)
                res.push(item);
    }
    return res;
}
// TODO you can do it!
