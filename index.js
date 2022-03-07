const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const toDos = getToDO('\/\/ TODO [-?!;,. а-яА-ЯёЁ0-9a-zA-Z\s]+');
const usernames = getToDO('\/\/ TODO [ а-яА-ЯёЁ0-9a-zA-Z\s]+');

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getToDO(pattern) {
    const regexp = new RegExp(pattern, 'g');
    const matches = files.map(str => str.match(regexp).map(str => str.substring(8)));
    return [].concat(...Array.from(matches));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let toDo of toDos){
                console.log(toDo);
            }
            break;
        case 'important':
            for (let toDo of toDos){
                if (toDo.toString().indexOf('!') > -1){
                    console.log(toDo);
                }
            }
            break;
        case `user`:
            console.log(usernames);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
