const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const toDo = [];

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    console.log(command.split(':')[0].split(' ')[0] === 'user');
    switch (command.split(' ')[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            func();
            for (let res of toDo)
                console.log(res);
            break;
        case 'important':
            func();
            for (let res of toDo)
                if (res.includes('!'))
                    console.log(res);
            break;
        case 'user':
            func();
            let x = String(command.split(' ').slice(1, )).replace(',', ' ');
            for (let res of toDo)
                if (res.toLowerCase().includes(x.toLowerCase()))
                    console.log(res);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function func() {
    for (let file of files) {
        let lines = file.split('\n');

        for (let line of lines) {
            if (line.trim().startsWith('// TODO')) {
                let todoSubstring = line.substring(line.indexOf('// TODO') + 8);
                toDo.push('// TODO ' + todoSubstring.trim())
            }
        }
    }
}


// TODO you can do it!