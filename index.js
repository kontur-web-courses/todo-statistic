const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');


console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
let allTODORegex = new RegExp("\/\/ TODO [^\\n\\r]+", "gi");

function getTodo(path='./', regexp = allTODORegex){
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
                console.log("Enter user name for this command");
                break;
            }
            let userTODORegex = new RegExp(`\/\/ TODO ${command[1]}; ?(.)+; ?[^\\n\\r]+`, 'gi')
            for (let todo of getTodo('./', userTODORegex)) {
                console.log(todo);
            }
            break;
        case 'sort':
            if (!command[1]) {
                console.log("Enter type for this command");
                break;
            }
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
                        let userDateSelectTODORegex = new RegExp("\/\/ TODO (.+); ?(.+); ?.+", 'gi');
                        let groups = userDateSelectTODORegex.exec(todoForUse);
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
                    let todoDates = [];
                    let notDate = [];
                    for (let todo of todos) {
                        let userDateTODORegex = new RegExp("\/\/ TODO (.+); ?(.+); ?.+", 'gi');
                        let groups = userDateTODORegex.exec(todo);
                        if (groups) {
                            todoDates.push({todo, date: new Date(groups[2])})
                        }
                        else {
                            notDate.push(todo);
                        }
                    }
                    todoDates.sort((a, b) => a.date - b.date)
                    for (let todoDate of todoDates) {
                        console.log(todoDate.todo)
                    }
                    for (let todo of notDate) {
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
