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
            curr.push(toDo.split(';')[0].trim().split(' ').at(-1).toLowerCase());
            curr.push(toDo.split(';')[1].trim());
        }
        else
        {
            curr.push(null);
            curr.push(null);
        }
        if(toDo.indexOf('!')!==-1)
        {
            curr.push(true);
        }
        else
        {
            curr.push(false);
        }
        result.push(curr);
    }
    return result;
}

function getToDo(){
    const pattern = new RegExp(/\/\/ TODO .*/)
    let files = getFiles();
    let result = [];
    for(let file of files){
        for(let line of file.split("\n")){
            let matching = line.match(pattern);
            if(matching !== null)
                result.push(matching[0]);
        }
    }
    return result;
}

function processCommand(command) {
    switch (command.split(' ').at(0)) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getToDo());
            break;
        case 'important':
            console.log(parseToDo(getToDo()).filter(x=>x.at(-1)).map(x=>x.at(0)));
            break;
        case 'user':
            console.log(parseToDo(getToDo()).filter(x=>x.at(1) === command.split(' ').at(1).toLowerCase()).map(x=>x.at(0)))
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
