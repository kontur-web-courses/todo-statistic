const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const toDo = [];
const important = [];
const user = [];
const dates = [];

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {

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
        case 'sort':
            func();
            switch (command.split(' ')[1]){
                case 'important':
                    console.log(toDo.filter(x => x.includes('!')));
                    console.log(toDo.filter(x => !x.includes('!')));
                    break;
                case 'user':
                    console.log(toDo.filter(x => x.split(';').length === 3));
                    console.log(toDo.filter(x => x.split(';').length !== 3));
                    break;
                case 'date':
                    console.log(toDo.sort((x, y) => new Date(y.split(';')[1]) - new Date(x.split(';')[1])));
                    break;
            }
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