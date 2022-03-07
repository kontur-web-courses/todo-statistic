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
    let username = '';
    let result = [];
    let importantResult = [];
    let userResult = [];
    if (command.includes('user')){
        username = command.slice(5);
        username.toLowerCase();
    }
    let importance = '';
    let date = '';

    for (let file of files){
        const lines = file.split('\r\n');
        for (let line of lines){
            if (line.includes('// TODO') && !line.includes('))')){
                result.push(line.slice(line.indexOf('// TODO')));
            }
        }
    }

    switch (command) {
        case 'exit':
            process.exit(0);
            break;

        case 'show':
            console.log(result);
            break;

        case 'important':
            for(let item of result){
                if (item.includes('!')){
                    importantResult.push(item);
                }
            }
            console.log(importantResult);
            break;

        case `user ${username}`:
            for(let item of result){
                if (item.includes(`${username}`)){
                    userResult.push(item);
                }
            }
            console.log(userResult);
            break;

        case `sort ${importance} | ${username} | ${date}`:


        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
