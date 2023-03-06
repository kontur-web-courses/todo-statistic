const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTodos() {
    let files = getFiles();
    let todos = []
    files.forEach((file) => {
        let strings = file.split('\n');
        strings.filter(s => s.startsWith(`// TODO `)).forEach(str => {
            todos.push(str);
        })
    })

    return todos;
}

function getParam(str, index) {
    if (str.indexOf(';') === -1) {
        return 'empty';
    }

    return str.split(';')[index]?.split(' ').at(-1);
}

function hasParams(str, param) {
    return str.split(' ')[0] === param ? str : false;
}


function sort(todos, sortParam) {
    switch (sortParam) {
        case 'importance':
            return todos.sort((a, b) => (b.match(/!/g) || []).length - (a.match(/!/g) || []).length);
        case 'user':
            let todoByUsers = {};
            todos.forEach(s => {
                const userName = getParam(s, 0).toLowerCase();
                if (todoByUsers[userName]) {
                    todoByUsers = {
                        ...todoByUsers,
                        [userName]: [...todoByUsers[userName], s]
                    }
                } else {
                    todoByUsers = {
                        ...todoByUsers,
                        [userName]: [s]
                    }
                }
            });
            return [todoByUsers];
        case 'date':
            return todos.sort((a, b) => {
                const aDate = getParam(a, 1);
                const bDate = getParam(b, 1);
                if (aDate === 'empty' && bDate === 'empty') {
                    return 0;
                } else if (aDate === 'empty') {
                    return 1;
                } else if (bDate === 'empty') {
                    return -1;
                }
                return new Date(bDate) - new Date(aDate);
            });
        default:
            console.log('wrong command');
            break;
    }
}

function processCommand(command) {
    switch (command) {
        case 'show':
            getAllTodos().forEach(s => {
                console.log(s);
            });
            break;
        case 'important':
            getAllTodos().filter(s => s.indexOf('!') > -1).forEach(s => {
                console.log(s);
            });
            break;
        case hasParams(command, 'user'):
            getAllTodos().filter(x => getParam(x, 0)?.toLowerCase() === command.split(' ')[1].toLowerCase()).forEach(s => {
                console.log(s);
            });
            break;
        case hasParams(command, 'sort'):
            sort(getAllTodos(), command.split(' ')[1]).forEach(s => {
                console.log(s);
            })
            break;
        case hasParams(command, 'date'):
            const controlDate = new Date(command.split(' ')[1]);
            getAllTodos().filter(s => {
                const parsed = Date.parse(getParam(s, 1));
                return !isNaN(parsed) && parsed > controlDate;
            }).forEach(s => {
                console.log(s);
            });
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
