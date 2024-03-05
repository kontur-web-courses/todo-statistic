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
    func()
    switch (command.split(' ')[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let res of toDo)
                console.log(res);
            break;
        case 'important':
            for (let res of toDo)
                if (res.includes('!'))
                    console.log(res);
            break;
        case 'user':
            let x = String(command.split(' ').slice(1, )).replace(',', ' ');
            for (let res of toDo)
                if (res.toLowerCase().includes(x.toLowerCase()))
                    console.log(res);
            break;
        case 'sort':
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
        case 'date':
            let date = new Date(command.split(' ')[1]);

            console.log(toDo.filter(x => new Date(x.split(';')[1]) >= date))
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

function print(answer, command){
    return 0;
}
// TODO you can do it!