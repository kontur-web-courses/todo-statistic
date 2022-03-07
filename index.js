const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles().map(f => f.split('\r\n'));

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    if (command === 'exit') {
        process.exit(0);
    } else if (command === 'show') {
        showSelection(getTODOs(files));
    } else if (command === 'important') {
        showSelection(getTODOs(files)
            .filter(item => item.indexOf('!') !== -1));
    } else if (command.indexOf("user ") === 0){
        let username = command.split(' ')[1].toLowerCase();
        let todos = getTODOs(files)
            .filter(todo => todo.username.toLowerCase() === username.toLowerCase());

        showSelection(todos);
    } else {
        console.log('wrong command');
    }
}

function showSelection(selection)
{
    for (const item of selection)
        console.log(item.toString());
}

function Todo(username, dateStr, text) {
    this.username = username;
    this.dateStr = dateStr;
    this.text = text;

    this.toString = () => {
        let todoBody = [this.username, this.dateStr, this.text]
            .filter(item => item !== null)
            .join('; ');

        return "// TODO " + todoBody;
    }
}

function getTODOs(files){
    let todos = [];
    let re = /(\/\/ TODO .+?$)/;
    for (let file of files) {
        for (let line of file){
            let match = line.match(re);
            if (match !== null)
                todos.push(match[0])
        }
    }
    return todos;
}
// TODO you can do it!
