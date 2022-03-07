const {readLine} = require('./console');
const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const files = getFiles();
const todos = [];
const important = [];

console.log('Please, write your command!');

for (file of files) {
    let strings = file.split('\n');
    for (str of strings) {
        if (str.substring(0, 7) == '// TODO') {
            todos.push(str);
                for (j of str.split("")){
                if (j === '!'){
                    important.push(str);
                    break;
                }   
            }
        }
    }
}
readLine(processCommand);
readLine(processCommand('show'));
readLine(processCommand('important'));
readLine(processCommand('exit'));

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (element of todos) console.log(element);
            break;
        case 'important':
            for (element of important) console.log(element);
            break;
        default:
            let sCommand = command.split(' ');
            if (sCommand[0] == 'user'){
                let name = sCommand[1];
                for (element of todos) {
                    if (element.substring(0, 9 + name.length) === `// TODO ${name};`) console.log(element)
                }
            }
            else console.log('wrong command');
            break;
    }
}

// TODO you can do it!
// TODO Semyon; 11.11.11; {текст комментария}lcxmbvcb