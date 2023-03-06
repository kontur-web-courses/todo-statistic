const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTODOs(text){
    const reg = RegExp(/\/\/ TODO .*$/, "gm")
    return text.match(reg)
}

function* iterTodos() {
    for (let fileContent of getFiles()){
        for (const v of getTODOs(fileContent)) {
            yield v;
        }
    }
}

function parseTODO(todo){

    let reg = /\/\/ TODO (?<user>.*); ?(?<date>.*); ?(?<text>.*)/
    if(!reg.test(todo))
        return {};
    return todo.match(reg).groups;
}

function processCommand(command) {
    switch (true) {
        case 'exit' === command:
            process.exit(0);
            break;
        case 'show' === command:
            for (let todo of iterTodos()) {
                console.log(todo);
            }
            break;
        case 'important' === command:
            for (let todo of iterTodos()) {
                if (todo.includes('!')) {
                    console.log(todo);
                }
            }
            break;
        case /user (\w+)/.test(command):
            const findUser = command.match(/user (\w+)/)[1]
            for (let todo of iterTodos()) {
                let {user, date, text} = parseTODO(todo);
                if (user?.toLowerCase() === findUser.toLowerCase()) {
                    console.log(todo);
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
