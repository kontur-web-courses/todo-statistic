const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');


console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
let all_todo_re = new RegExp("\/\/ TODO [^\\n\\r]+", "gi");

function getTodo(path='./', regexp = all_todo_re){
    let todos = [];
    for (let str of getFiles(path)) {
        for (let strElement of str.split('\n')) {
            let todo = strElement.match(regexp) || [];
            for (let todoElement of todo) {
                todos.push(todoElement);
            }
        }
    }
    return todos;
}


function processCommand(command) {
    command = command.split(' ');
    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let todoElement of getTodo()) {
                console.log(todoElement);
            }
            break;
        case 'important':
            let re1 = /!/
            for (let str of getTodo()) {
                if (re1.test(str)) {
                    console.log(str);
                }
            }
            break;
        case 'user':
            if (!command[1]) {
                console.log("Enter user name on this command");
                break;
            }
            let user_todo_re = new RegExp(`\/\/ TODO ${command[1]}; ?(.)+; ?[^\\n\\r]+`, 'gi')
            for (let todo of getTodo('./', user_todo_re)) {
                console.log(todo);
            }
            break;
        case 'sort':
            let todos = getTodo();
            switch (command[1]) {
                case 'importance':
                    todos.sort((a, b) => (a.match(/!/g) || []).length - (b.match(/!/g) || []).length);
                    for (let todo of todos) {
                        console.log(todo);
                    }
                    break;
                case 'user':
                    let users = {};
                    let another = [];
                    for (let todoForUse of todos) {
                        let user_data_todo_re = new RegExp("\/\/ TODO (.+); ?(.+); ?.+", 'gi');
                        let groups = user_data_todo_re.exec(todoForUse);
                        if (groups){
                            let user = groups[1].toLowerCase();
                            if (!(user in users))
                                users[user] = []
                            users[user].push(todoForUse);
                        }
                        else{
                            another.push(todoForUse);
                        }
                    }
                    for (let usersKey in users) {
                        for (let userTodoElement of users[usersKey]) {
                            console.log(userTodoElement);
                        }
                    }
                    for (let anotherElement of another) {
                        console.log(anotherElement);
                    }
                    break;
                case 'date':
                    let todo_dates = [];
                    let not_date = [];
                    for (let todo of todos) {
                        let user_data_todo_re = new RegExp("\/\/ TODO (.+); ?(.+); ?.+", 'gi');
                        let groups = user_data_todo_re.exec(todo);
                        if (groups) {
                            todo_dates.push({todo, date: new Date(groups[2])})
                        }
                        else {
                            not_date.push(todo);
                        }
                    }
                    todo_dates.sort((a, b) => a.date - b.date)
                    for (let todo_date of todo_dates) {
                        console.log(todo_date.todo)
                    }
                    for (let todo of not_date) {
                        console.log(todo);
                    }
                    break;
                default:
                    console.log('wrong param');
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
