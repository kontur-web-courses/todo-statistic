const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getToDoFromFile(file) {
    return file
        .split('\r\n')
        .filter(x => x.includes('// TODO'))
        .map(x => x.substring(x.indexOf('// TODO') + 8))
        .map(x => x.split('; '))
        .filter(x => x.length === 3)
        .map(x => { return {user: x[0], date: x[1], comment: x[2], priority: x[2].includes('!')} });
}

function getAllToDo(){
    let result = [];
    for (let file of files)
        result = result.concat(getToDoFromFile(file));

    return result;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break
        case 'show':
            let todos = getAllToDo();
            for (let todo of todos){
                console.log(`${todo.user} ${todo.date} ${todo.comment}`)
            }

            break
        case 'important':
            let important = getAllToDo().filter(x => x.priority);
            for (let e of important){
                console.log(`${e.user} ${e.date} ${e.comment}`)
            }
            break;
        default:
            let args = command.split(' ');
            if (args[0] === 'sort') {
                let sortArg = args[1];
                let sortPredicate;
                let all = getAllToDo();

                switch (sortArg) {
                    case 'importance':
                        sortPredicate = function (x, y) {return y.priority - x.priority};
                        break;
                    case 'user':
                        sortPredicate = function (x, y) {return x.user.localeCompare(y.user)};
                        break;
                    case 'date':
                        sortPredicate = function (x, y) {return new Date(x.date) - new Date(y.date)};
                        break;
                }

                all = getAllToDo().sort(sortPredicate);
                for (let e of all){
                    console.log(`${e.user} ${e.date} ${e.comment}`)
                }
                break;
            }
            if (args[0] === 'date') {
                let all = getAllToDo();
                let date = args[1];
                let after = all.filter(x => new Date(x.date) > new Date(date));
                for (let e of after){
                    console.log(`${e.user} ${e.date} ${e.comment}`)
                }
                break;
            }

            console.log('wrong command');
            break;
    }
}