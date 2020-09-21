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
    let arr = getTodoArray();
    let commandStr = command/*.toLowerCase()*/.split(/[\s;]+/);

    switch (commandStr[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            arr.forEach(x => {
                let index = x.indexOf("\/\/ TODO");
                if (index != -1)
                    console.log(x.slice(index));
            });
            break;
        case 'important':
            arr.forEach(x => {
                let index = x.indexOf("\/\/ TODO");
                if (index != -1) {
                    let temp = x.slice(index);
                    let important = temp.indexOf('\!');
                    if(important != -1)
                        console.log(temp);
                }
            });
            break;
        case 'user':
            
            arr.forEach(x => {
                let index = x.indexOf("\/\/ TODO");
                if (index != -1) {
                    let temp = x.toLowerCase().slice(index);
                    let important = temp.indexOf(commandStr[1]);
                    //console.log(important);
                    if(important != -1)
                        console.log(temp);
                }
                    
            });
            break;
        case '':
            
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getTodoArray(callback) {
    return getFiles()
    .join('\n')
    .split('\n');
}

// TODO you can do it!
