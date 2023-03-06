const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let todoArray = [];
files.forEach((file, number) => {
    const lines = file.split('\n');
    lines.forEach((line, index) => {
        let f = line.search(/(\/\/ TODO)[^'"]/g)
        if (f != -1) {
            todoArray.push(line.slice(f, ));
        }
    });
})

console.log(todoArray);
console.log('Please, write your command!');
readLine(processCommand);


function processCommand(command) {
    switch (true) {
        case command === 'exit':
            process.exit(0);
            break;
        case command === 'show':
            todoArray.map(t => console.log(t))
            break;
        case command === 'important':
            console.log(getImportant())
            break;
        case command.startsWith('sort'):
            console.log(sortBy(command.split(' ')[1]))
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
    return todoArray.filter(s => s.includes('!'));
}

function getNotImportant()
{
    return todoArray.filter(s => !s.includes('!'));
}

function sortBy(key)
{
    switch (key)
    {
        case 'importance':
            return getImportant().concat(getNotImportant());
        default:
            console.log('wrong key');
            break;
    }
}
