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
    let c = command.split(' ')[0];
    switch (c) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log();
            let d = ToDoFind();
            if (d.length !== 0) {
                console.log(d.join('\n\n'));
            }
            break;
        case 'user':
            let name = command.replace("user ", "");
            let comments = UserName(name);
            if (comments.length !== 0) {
                console.log(comments.join('\n\n'));
            }
            break;
        case 'important':
            DoImportant(ToDoFind());
            break;
        case 'sort':
            Sort(ToDoFind(), command);
        default:
            console.log('wrong command');
            break;
    }
}

function TakeName(str){
    if (str.indexOf(';')!==-1)
        return str.replace("// TODO ", "").split(';')[0];
    return "";
}

function TakeDate(str){
    if (str.indexOf(';')!==-1)
        return str.split(';')[1].trim();
    return "";
}

function ToDoFind() {
    let list = [];
    for (let f of files) {
        for (let line of f.split('\n')) {
            let index = line.indexOf('// TODO ')
            if (index !== -1) {
                let todo = line.substring(index).replaceAll(';', '; ').replaceAll('  ', ' ');
                list.push(todo);
            }
        }
    }
    return list;
}

function UserName(name) {
    let data = ToDoFind();
    let list = [];
    for (let f of data) {
        let takedName = TakeName(f);
        if (takedName === name)
            list.push(f);
    }

    return list;
}

function DoImportant(todos) {
    for (const todo of todos) {
        if (todo.indexOf('!') !== -1)
            console.log(todo + '\n\n');
    }
}

function Sort(todos, command) {
    let typeSort = command.split(' ')[1];
    let sortArray = [];
    let otherArray = [];
    if (typeSort === 'importance') {
        for (const todo of todos) {
            let count = (todo.match(/!/g) || []).length;
            sortArray.push({param: count, str: todo});
        }
    }
    else if (typeSort === 'user') {
        for (const todo of todos) {
            let name = TakeName(todo);
            if (name !== "") {
                sortArray.push({param: name.toLowerCase(), str: todo});
            }
            else {
                otherArray.push(todo);
            }
        }
    }
    else if (typeSort === 'date') {
        for (const todo of todos) {
            let date = TakeDate(todo);
            if (date !== "") {
                sortArray.push({param: new Date(date), str: todo});
            }
            else {
                otherArray.push(todo);
            }
        }
    }

    sortArray.sort((a, b) => b.param - a.param);
    sortArray = sortArray.concat(otherArray);
    for (const a of sortArray) {
        console.log(a.str)
    }
}


// TODO you can do it!
