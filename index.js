const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let todoArray = [];
files.forEach((file, number) => {
    const lines = file.split('\n');
    lines.forEach((line, index) => {
        if (line.startsWith('// TODO')) {
            todoArray.push(line);
        }
    });
})

console.log('Please, write your command!');
readLine(processCommand);


function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'important':
            console.log(getImportant())
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getImportant()
{
    return todoArray.filter(s => s.includes('!'))
}
