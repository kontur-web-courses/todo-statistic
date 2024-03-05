const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const { files, names } = getFiles();
const priority = Symbol('priority');
const TODO_REGEXP = /\/\/ TODO\s(.+)/gmi;
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
                '!': todo.includes('!'),
                [priority]: (todo.match(/!/g) || []).length,
                user: null,
                date: null,
                comment: todo,
            }}).concat(
        todosWithUser
            .map(group => {
                return {
                    '!': group[3].includes('!'),
                    [priority]: (group[3].match(/!/g) || []).length,
                    user: group[1],
                    date: group[2],
                    comment: group[3],
                }
            }));
}

function getImportantTodos() {
    const todos = getTodos();
    return todos.filter(e => e['!']);
}

function getUserTodos(user) {
    const todos = getTodos();
    return todos
        .filter(obj => obj.user !== null && obj.user.toLowerCase() === user.toLowerCase());
}

function getSortedTodos(key) {
    var todos = getTodos();

    switch(key) {
        case 'importance':
            return todos.sort((x, y) => y[priority] - x[priority]);
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
            console.log(getCoolTable(getTodos()));
            break;
        case 'important':
            console.log(getCoolTable(getImportantTodos()));
            break;
        case 'user':
            let user = processedCommand.at(1);
            console.log(getCoolTable(getUserTodos(user)));
            break;
        case 'sort':
            let sort_by = processedCommand.at(1);
            console.log(getCoolTable(getSortedTodos(sort_by)));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getCoolTable(array)
{
    const labelsObj = {
        '!': '!',
        user: 'user',
        data: 'date',
        comment: 'comment'
    }

    let infos = {};
    let line_lengths = {};
    for (const TODO of array) {
        for (const info in TODO) {
            if (!infos.hasOwnProperty(info)) {
                if (info === "isImportant")
                    infos[info] = ["!"]
                else
                    infos[info] = [info];
            }
            infos[info].push(TODO[info]);
        }
    }

    for (const info in infos){
        let arr = infos[info];
        line_lengths[info] = Math.max(...arr.map(function (obj) {return String(obj).length}));
    }

    let table = "";
    let cur_infos = [];
    for (const label in labelsObj) {
        let spaces_to_add = line_lengths[label] - String(labelsObj[label]).length;
        cur_infos.push(`  ${labelsObj[label] + ' '.repeat(spaces_to_add)}  `);
    }
    table += `${cur_infos.join("|")}\n`;

    const totalSum = Object.values(line_lengths).reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0) + 3 + 4*4;
    table += `${"-".repeat(totalSum)}\n`;

    for (const TODO of array) {
        let cur_infos = [];
        for (const info in TODO) {
            let spaces_to_add = line_lengths[info] - String(TODO[info]).length;
            cur_infos.push(`  ${TODO[info] + ' '.repeat(spaces_to_add)}  `);
        }
        table += `${cur_infos.join("|")}\n`;
    }

    return table;
}

console.log(getCoolTable([{'!': 10, name: "ffeef", date: 132, comment: "fwfwef"},
    {'!': 242, name: "ffeef", date: 242424, comment: "fwfwef"}]))

// TODO you can do it!