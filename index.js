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
        case command.startsWith('date'):
            console.log(getSince(command.split(' ')[1]))
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
        case 'user':
            const names = {};
            const defaultUserComments = [];
            todoArray.forEach(str => {
                const name = getUser(str);
                if (name) {
                    if (!names[name]) {
                        names[name] = [];
                    }
                    names[name].push(str);
                }
                else {
                    defaultUserComments.push(str);
                }
            });
            for (const name in names) {
                names[name].forEach(str => console.log(str));
            }
            defaultUserComments.map(c => console.log(c))
            break;
        case 'date':
            const sortByDate = (arr) => {
                arr.sort(str => getDate(str));
                return arr.reverse();
            }
            sortByDate(todoArray).map(t => console.log(t))
            break;
        default:
            console.log('wrong key');
            break;
    }
}

function getSince(date)
{
    date = Date.parse(date);
    return todoArray.filter(s => getDate(s) >= date);
}

function getUser(todoStr)
{
    if (todoStr.split(';').length !== 3)
    {
        return null;
    }
    todoStr = todoStr.slice(8);
    return todoStr.split(';')[0].trim();
}

function getDate(todoStr)
{
    if (todoStr.split(';').length !== 3)
    {
        return new Date(1000, 0, 1);
    }
    todoStr = todoStr.slice(8);
    return new Date(todoStr.split(';')[1].trim());
}