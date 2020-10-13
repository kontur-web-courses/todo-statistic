const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const path = require('path');

const files = getFiles();
const allTodos = findTodos(files);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(filePath => {
        return {
            fileName: path.win32.basename(filePath),
            data: readFile(filePath),
        }
    });
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(allTodos);
            break;
        case 'important':
            console.log(
                allTodos
                .filter(todo => todo.importance > 0)
            );
            break;
        case command.match(/^user [a-zа-я0-9_\s]+$/g) ? command : null:
            let user = command.replace('user ', '').trim().toLowerCase();
            console.log(
                allTodos
                .filter(todo => todo.user && todo.user.toLowerCase() === user)
            );
            break;
        case command.match(/^sort importance$/g) ? command : null:
            console.log(
                allTodos
                .sort((a, b) => b.importance - a.importance)
            );
            break;
        case command.match(/^sort user$/g) ? command : null:
            console.log(
                allTodos
                .sort((a, b) => (a.user && b.user) ? (a.user).localeCompare(b.user, 'ru', {caseFirst: 'upper'}) :
                    a.user ? -1 : b.user ? 1 : 0)
            );
            break;
        case command.match(/^sort date$/g) ? command : null:
            console.log(
                allTodos
                .sort((a, b) => {
                    return (a.date && b.date) ? b.date.date - a.date.date :
                        a.date ? -1 : b.date ? 1 : 0;
                })
            );
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
// TOdO:Переделать это

function findTodos(files) {
    let todos = [];

    files.forEach(file => {
        let newTodo = file.data.match(/\/\/\s?todo(\s|:).+/gi)
        .map(element => {
            return {
                fileName: file.fileName,
                comment: element,
            }
        });
        todos.push(...newTodo);
    });

    todos = todos.map(todo => {
        let todoArr = todo.comment.replace(/\/\/\s?todo(\s|:)/gi, '')
        .split(';')
        .map(element => element.trim());

        let newTodo = {};
        newTodo.fileName = todo.fileName;
        let importance = todo.comment.match(/!/g) || [];
        newTodo.importance = importance.length;

        if (todoArr.length === 1) {
            newTodo.message = todoArr[0].trim();
        } else if (todoArr.length === 3) {
            let user = todoArr[0].trim();
            newTodo.user = user && user.length > 0 ? user : null;
            let dateArray = todoArr[1].trim().split('-');
            let date = new Date(todoArr[1].trim());
            newTodo.date = {
                date: date,
                year: dateArray[0] ? Number(dateArray[0]) : null,
                month: dateArray[1] ? Number(dateArray[1]) : null,
                day: dateArray[2] ? Number(dateArray[2]) : null,
            };
            newTodo.message = todoArr[2].trim();
        }
        
       return newTodo
    });

    return todos;
}
