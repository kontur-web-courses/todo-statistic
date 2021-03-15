const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}


function getTODOs(){
    const SEARCH_STR = "// TODO ";
    let result = [];
    let files = getFiles();
    for (const file of files){
        let rows = file.split("\r\n");
        for (const row of rows){
            if (row.indexOf("SEARCH_STR") >= 0)
                continue;
            if (row.indexOf(SEARCH_STR) >= 0){
                let tmp = row.split(SEARCH_STR);
                result.push(tmp[1]);
            }
        }
    }

    return result;
}

function processShowCommand(){
    console.log(getTODOs());
}

function processImportantCommand(){
    let res = getTODOs().filter(function (x) {
        return x.indexOf('!') >= 0;
    });
    console.log(res);
}

function isUserTODO(todo){
    return todo.split(';').length >= 3;
}

function getTODOInfo(todo){
    let parts = todo.split(';');
    let user_name = parts[0].toLowerCase().trim();
    let todo_date = parts[1].trim();
    let todo_comment = parts[2].trim();

    return [user_name, todo_date, todo_comment];
}

function processUserCommand(name){
    let todos = getTODOs();
    let result = [];

    for (const todo of todos){
        if (!isUserTODO(todo))
            continue;
        
        let [user_name, todo_date, todo_comment] = getTODOInfo(todo);
        if (user_name != name)
            continue;

        result.push([todo_date, todo_comment].join(';'));
    }

    console.log(result);
}


function getSortedImportance(todos){
    return todos.sort(function(x, y) {
        sign_count_x = x.split('!').length - 1;
        sign_count_y = y.split('!').length - 1;

        return sign_count_x < sign_count_y ? 1 : sign_count_x > sign_count_y ? -1 : 0;
    });
}

function getSortedUser(todos){
    let users = {};
    let withoutUser = [];
    let result = [];

    for (const todo of todos){
        if (isUserTODO(todo)){
            let [user_name, todo_date, todo_comment] = getTODOInfo(todo);
            if (user_name in users)
                users[user_name].push([user_name, todo_date, todo_comment].join(';'));
            else
                users[user_name] = [`${user_name};${todo_date};${todo_comment}`];
        }
        else
            withoutUser.push(todo);
    }

    let keys = Object.keys(users).sort();
    for (const key of keys){
        for (const todo of users[key]){
            result.push(todo);
        }
    }

    return result.concat(withoutUser);
}


function getSortedByDate(todos){
    let withDate = [];
    let withoutDate = [];
    for (const todo of todos){
        if (isUserTODO(todo))
            withDate.push(todo);
        else
            withoutDate.push(todo);
    }

    withDate.sort(function(x, y) {
        x_date = getTODOInfo(x)[1];
        y_date = getTODOInfo(y)[1];

        return (new Date(y_date) - new Date(x_date));
    });

    return withDate.concat(withoutDate);
}


function processSortCommand(command){
    let todos = getTODOs();

    switch (command){
        case 'importance':
            console.log(getSortedImportance(todos));
            break;
        case 'user':
            console.log(getSortedUser(todos));
            break;
        case 'date':
            console.log(getSortedByDate(todos));
            break;
    }
}

function processCommand(command) {
    command_parts = command.split(" ");

    switch (command_parts[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            processShowCommand();
            break;
        case 'important':
            processImportantCommand();
            break;
        case 'user':
            let name_parts = [];
            for (let i = 1; i < command_parts.length; i++)
                name_parts.push(command_parts[i]);
            let name = name_parts.join(' ').toLowerCase();
            processUserCommand(name);
            break;
        case 'sort':
            processSortCommand(command_parts[1]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
