const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getToDo(file) {
    let toDoes = [];

    let splitFile = [];
    for (let row of file){
        let split = row.split('\n');
        for (let element of split) {
            splitFile.push(element);
        }
    }

    for (let row of splitFile){
        if (row.includes("// TODO "))
            toDoes.push(row);
    }

    return toDoes;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let str of getToDo(getFiles()))
                console.log(str);
            break;
        case 'important':
            for (let str of getToDo(getFiles())){
                if (str.includes('!')){
                    console.log(str);
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
