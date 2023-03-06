// magic from stackoverflow
function measureImportance(str) {
    return (str.match(/!/g) || []).length
}

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
    const reg = RegExp(/\/\/ ?TODO ?:? ?.*$/, "gmi")
    return text.match(reg)
}

function* iterTodos() {
    for (let fileContent of getFiles()){
        for (const v of getTODOs(fileContent)) {
            yield v;
        }
    }
}

function isImportant(todo) {
    return todo.includes('!');
}

function parseTODO(todo){

    let reg = /\/\/ ?TODO ?:? ?(?<user>.*); ?(?<date>.*); ?(?<text>.*)/i
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
                if (isImportant(todo)) {
                    console.log(todo);
                }
            }
            break;
        case /user (\w+)/.test(command):
            const inputUser = command.match(/user (\w+)/)[1]
            for (let todo of iterTodos()) {
                let {user} = parseTODO(todo);
                if (user?.toLowerCase() === inputUser.toLowerCase()) {
                    console.log(todo);
                }
            }
            break;
        case /date (.*)/.test(command):
            const inputDate = new Date(command.match(/date (.*)/)[1])
            for (let todo of iterTodos()) {
                let {date} = parseTODO(todo);
                if (new Date(date) >= inputDate) {
                    console.log(todo);
                }
            }
            break;
        case /sort (\w+)/.test(command):
            const sortArgument = command.match(/sort (\w+)/)[1];
            for (let todo of Array.from(iterTodos())
                .sort((text1, text2) => measureImportance(text2) - measureImportance(text1))) {
                console.log(todo)
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
// TODO abc; 2018-03-02; asd
// TODO abc; 2018-03-01; asd
//toDO: abc; 2018-03-01; asd
