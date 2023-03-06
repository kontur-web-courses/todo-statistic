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
            for (let str of getToDo(files))
                console.log(str);
            break;
        case 'important':
            for (let str of getToDo(files)){
                if (str.includes('!')){
                    console.log(str);
                }
            }
            break;
        case 'sort importance':
            let stack = [];
            for (let str of getToDo(files)){
                if (str.includes('!')){
                    console.log(str);
                } else {
                    stack.push(str);
                }
            }
            for (let str of stack){
                console.log(str);
            }
            break;

        case 'sort user':
            let map = {};
            for (let str of getToDo(files)) {
                let user = str.split('// TODO ').pop().split(';').shift();
                map[user] = str;
            }
            for (let key in map){
                console.log(map[key]);
            }
            break;
        case 'sort date':
            let map2 = {};
            let noDate = [];
            let arr =[];
            for (let str of getToDo(files)) {
                let date = str.split('// TODO').pop().split('; ')[1];
                if (date === undefined){
                    noDate.push(str);
                    continue;
                }
                map2[new Date(date)] = (str);
                arr.push(new Date(date));
            }
            arr.sort((date1, date2) => date1 - date2);
            for (let i = arr.length - 1; i >= 0; i--){
                let key = arr[i];
                console.log(map2[key]);
            }
            for (let i of noDate){
                console.log(i);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
