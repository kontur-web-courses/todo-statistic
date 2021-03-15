const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'sort':
            break
        case 'user':
            break;
        case 'important':
            break;
        case 'show':
            let todos = getAllTodo();
            for (let todo of todos)
                console.log(todo)
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

function getAllTodo(){
    let keyword = 'TODO';
    const regex = new RegExp(
        // exclude TODO in string value with matching quotes:
        '^(?!.*([\'"]).*\\b' + keyword + '\\b.*\\1)' +
        // exclude TODO.property access:
        '(?!.*\\b' + keyword + '\\.\\w)' +
        // exclude TODO = assignment
        '(?!.*\\b' + keyword + '\\s*=)' +
        // final TODO match
        '.*\\b' + keyword + '\\b'
    );

    let files = getFiles();
    let todos = [];
    for(let file of files) {
        file.split('\n').forEach((file) => {
            let m = regex.test(file);
            if (m) {
                let rightString = file.substr(file.indexOf('// TODO'));
                if (rightString.length > 6)
                    todos.push(rightString);
            }
        });
    }
    return todos;
}