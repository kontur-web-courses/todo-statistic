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
    const todoComments = getTodoComments();
    switch (command.split(' ')[0]) {
        case 'show':
            showTodoComments(todoComments);
            break;
        case 'important':
            showTodoComments(showImportantTodoComments(todoComments));
            break;
        case `user`:
            showTodoComments(showUserTodoComments(command.split(' ')[1], todoComments));
            break;
        case 'sort':
            switch (command.split(' ')[1]) {
                case 'importance':
                    const importantComments =sortByImportance(showImportantTodoComments(todoComments));
                    const remaining = todoComments.filter(item => !importantComments.includes(item));
                    showTodoComments(importantComments.concat(remaining))
                    break
                case 'user':
                    break
                case 'date':
                    break
            }
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}
function showUserTodoComments(username, todoComments) {
    const userTodoComments = [];
    todoComments.forEach(comment => {
        const todoParts = comment.split(';');

        if (todoParts.length >= 2) {
            const todoAuthor = todoParts[0].trim();
            if (todoAuthor.toLowerCase() === username.trim()) {
                userTodoComments.push(comment);
            }
        }
    })
    return userTodoComments;
}

function sortByDate(todoComments) {}
function sortByUserName(todoComments) {}
function sortByImportance(importantComments) {
    importantComments.sort((a, b) => {
        const countA = (a.match(/!/g) || []).length; // Считаем количество восклицательных знаков в строке a
        const countB = (b.match(/!/g) || []).length; // Считаем количество восклицательных знаков в строке b

        return countB - countA; // Сортируем строки в порядке убывания количества восклицательных знаков
    });

    return importantComments;
}

function showImportantTodoComments(todoComments) {
    const importantComments = [];
    todoComments.forEach(comment => {
        if (comment.includes('!')){
            importantComments.push(comment);
        }
    });
    return importantComments;
}
function getTodoComments(){
    const todoComments = [];

    files.forEach(fileContent => {
        const lines = fileContent.split('\n');
        lines.forEach(line => {
            if (line.includes('// TODO')) {
                todoComments.push(line.slice(line.indexOf('// TODO') + 8));
            }
        });
    });
   return todoComments;
}

function showTodoComments(todoComments) {
    todoComments.forEach(comment => console.log(comment));
}

// TODO you can do it!
