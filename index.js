const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function parseToDo(array) {
    let result = []
    for (let toDo of array) {
        let curr = [toDo];
        if(toDo.indexOf(';') !== -1)
        {
            curr.push(toDo.split(';')[0]);
            curr.push(toDo.split(';')[1]);
        }
        result.push(curr);
    }
}

function getToDo(){
    const pattern = new RegExp(/(\/\/ TODO .*)/)
    let files = getFiles();
    let result = [];
    for(let file of files){
        for(let m of file.match(pattern)) {
            result.push(m);
        }
    }
    console.log(result);

}

function processCommand(command) {
    switch (command) {
        case 'exit':
            getToDo();
            process.exit(0);
            break;
        case 'show':
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
