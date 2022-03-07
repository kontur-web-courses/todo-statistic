const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const COMMENT = '// TODO ';
const comments = [];


console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function findByUser(file, user) {
    const file_data = file.split('\n').filter(x => x.match(COMMENT));
    file_data.forEach(str => {
        let almostRes = str.slice(str.indexOf(COMMENT)).toLowerCase();
        let res = str.slice(str.indexOf(COMMENT));
        if (almostRes.indexOf(`todo ${user}`) !== -1) {
            console.log(res);
        }
    });
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            files.forEach(file => getComment(file));
            readLine(processCommand);
            break;
        case 'important':
            files.forEach(file => getComment(file, true));
            readLine(processCommand);
            break;
        case 'sort importance':
            files.forEach(file => parseComment(file));
            comments.sort(function(a, b){
                let x = a[1];
                let y = b[1];
                return x < y ? -1 : x> y ? 1 : 0;
            });
            comments.forEach(x => console.log(x[0]+x[1]+x[2]+x[3]+'\n'))
            readLine(processCommand);
            break;
        case 'sort user':
            break;
        case 'sort date':
            break;
        default:
            let kek = command.indexOf('user')
            if (kek === 0) {
                files.forEach(file => findByUser(file, command.slice(5).toLowerCase()))
            } else {
                console.log('wrong command');
            }
            break;
    }
}

// array.sort(function(a, b){
//     let x = a[1];
//     let y = b[1];
//     return x < y ? -1 : x> y ? 1 : 0;
// });

function getComment(file, isImportant = false) {
    const file_data = file.split('\n').filter(x => x.match(COMMENT));
    if (isImportant) {
        file_data.forEach(str => {
            let res = str.slice(str.indexOf(COMMENT));
            if (res.indexOf('!') !== -1) {
                console.log(res);
            }
        });
    } else {
        file_data.forEach(str => console.log(str.slice(str.indexOf(COMMENT))));
    }
}

function parseComment(file) {
    const file_data = file.split('\n').filter(x => x.match(COMMENT));
    file_data.forEach(str => {
        let res = str.slice(str.indexOf(COMMENT));
        let splitted = res.split(';');
        if (res.indexOf('!') !== -1) {
            comments.push([splitted[0].slice(8), splitted[1], splitted[2], 0])
        } else {
            comments.push([splitted[0].slice(8), splitted[1], splitted[2], 1])
        }
    });
}

// TODO you can do it!