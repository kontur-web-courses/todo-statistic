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
    let result =[];
    switch (command.split(' ')[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let res of toDo) {
                result.push(res);
            }
            print(result);
            break;
        case 'important':
            for (let res of toDo)
                if (res.includes('!')) {
                    result.push(res);
                }
            print(result);
            break;
        case 'user':
            let x = String(command.split(' ').slice(1, )).replace(',', ' ');
            for (let res of toDo)
                if (res.toLowerCase().includes(x.toLowerCase())) {
                    result.push(res);
                }
            print(result);
            break;
        case 'sort':
            switch (command.split(' ')[1]){
                case 'important':
                    for (let s of toDo.filter(x => x.includes('!'))){
                        result.push(s)
                    }
                    for (let s of toDo.filter(x => !x.includes('!'))){
                        result.push(s)
                    }
                    print(result);
                    break;
                case 'user':
                    for (let s of toDo.filter(x => x.split(';').length === 3)){
                        result.push(s);
                    }
                    for (let s of toDo.filter(x => x.split(';').length !== 3)){
                        result.push(s);
                    }
                    print(result);
                    break;
                case 'date':
                    for (let s of toDo.sort((x, y) => new Date(y.split(';')[1]) - new Date(x.split(';')[1]))){
                        result.push(s);
                    }
                    print(result);
                    break;
            }
            break;
        case 'date':
            let date = new Date(command.split(' ')[1]);
            for (let s of toDo.filter(x => new Date(x.split(';')[1]) >= date))
                result.push(s);
            print(result);
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

function print(list){
    for (let el of list){
        if (el.includes(';')) {
            let s = el.split(';');
            console.log(`${el.includes('!') ? '!' : ' '}` +`| `
                + `${s[0].slice(8, ).length > 10 ? s[0].slice(8, ).slice(0, 7) + '...': s[0].slice(8, )}`.padEnd(10)
                + `| ${s[1]}`.padEnd(10) + `| ${s[2].length > 50 ? s[2].slice(0, 47) + '...' : 
                    s[2].slice(0, 50)}`.padEnd(50))
        } else {
            console.log(`${el.includes('!') ? '!' : ' '}` +`| `
                + `-`.padEnd(10)
                + `|  ` + `-`.padEnd(10) + `|  ${el.slice(8, ).length > 50 ? el.slice(8, ).slice(0, 47) + '...' :
                    el.slice(8, ).slice(0, 50)}`.padEnd(50))
        }

    }

    return 0;
}
// TODO you can do it!