const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const { files, names } = getFiles();
const TODO_REGEXP = /\/\/ TODO\s(.+)\n/gmi;
const USER_TODO_REGEXP = /(.+);\s(\d{4}-\d{2}-\d{2});\s(.*)/mi

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    const fileNames = filePaths.map(function (str) { return str.split('/').pop() });
    return { files: filePaths.map(path => readFile(path)), names: fileNames};
}

function getTodos() {
    const allText = files.join('\n');

    const allTodos = Array.from(allText.matchAll(TODO_REGEXP))
        .map(group => group[1]);

    const todosWithoutUser = allTodos
        .filter(todo => !USER_TODO_REGEXP.test(todo));

    const todosWithUser = allTodos
        .filter(todo => USER_TODO_REGEXP.test(todo))
        .map(todo => Array.from(todo.match(USER_TODO_REGEXP)));

    return todosWithoutUser
            .map(todo => {return {
                isImportant: todo.includes('!'),
                priority: (todo.match(/!/g) || []).length,
                user: null,
                date: null,
                comment: todo,
            }}).concat(
        todosWithUser
            .map(group => {
                return {
                    isImportant: group[3].includes('!'),
                    priority: (group[3].match(/!/g) || []).length,
                    user: group[1],
                    date: group[2],
                    comment: group[3],
                }
            }));
}

function getImportantTodos() {
    const todos = getTodos(file);
    return todos.filter(e => e.isImportant);
}

function getUserTodos(user) {
    const todos = getTodos(file);
    return todos
        .filter(obj => obj.user === user);
}

function getSortedTodos(key) {
    var todos = getTodos();

    switch(key) {
        case 'importance':
            return todos.sort((x, y) => y.priority - x.priority);
        case 'user':
            return todos.sort((x, y) => {
                if (x.user === null) {
                    return 1;
                }

                if (y.user === null) {
                    return -1;
                }

                return x.user.localeCompare(y.user);
            })
        case 'date':
            return todos.sort((x, y) => {
                if (x.date === null) {
                    return 1;
                }

                if (y.date === null) {
                    return -1;
                }

                return Date.parse(y.date) - Date.parse(x.date);
            });
    }
}

function processCommand(command) {
    let processedCommand = command.split(' ');
    switch (processedCommand.at(0)) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getTodos());
            break;
        case 'important':
            console.log(getImportantTodos());
            break;
        case 'user':
            let user = processedCommand.at(1);
            console.log(getUserTodos(user));
            break;
        case 'sort':
            let sort_by = processedCommand.at(1);
            console.log(getSortedTodos(sort_by));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getTable(array)
{
    const labels = ['!', 'user', 'date', 'comment']
    let table = `  ${labels.join("\t|  ")}\n`
    for (const TODO of array) {
        let cur_infos = [];
        for (const info in TODO) {
            cur_infos.push(`${TODO[info]}`);
        }
        table += `  ${cur_infos.join("\t|  ")}\n`;
    }

    return table;
}

function getCoolTable(array)
{
    const labels = ['!', 'user', 'date', 'comment'];
    let infos = {};
    let line_lengths = [];
    for (const TODO of array) {
        for (const info in TODO) {
            if (!infos.hasOwnProperty(info)) {
                infos[info] = [];
            }
            infos[info].push(TODO[info]);
        }
    }

    for (const info in infos){
        let arr = infos[info];
        let max_length = arr.map(function (obj) { return String(obj).length }).max();
        line_lengths.push(max_length);
    }

    console.log(infos)

    return table;
}

console.log(getTable([{isImportant: "AAA", name: 300, date: 45, comment: 24}, {isImportant: "TTT", name: 40, date: 10, comment: 90}]))
// TODO you can do it!
