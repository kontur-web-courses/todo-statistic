const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
console.log(files.map(file => file.split('\r\n')).map(file));

process.exit(0)

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
        showSelection(getTodos());
    } else if (command === 'important') {
        showSelection(getTodos()
            .filter(item => item.indexOf('!') !== -1));
    } else if (command.indexOf("user ") === 0){
        let username = command.split(' ')[1].toLowerCase();
        console.log("No more!");
    } else {
        console.log('wrong command');
    }
}

function showSelection(selection)
{
    for (const item of selection)
        console.log(item);
}


function getTodos()
{

}

// TODO you can do it!
