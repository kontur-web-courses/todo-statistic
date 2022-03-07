const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

let arr = [];
for (let i=0; i<files.length; i++) {
    let file = files[i].split(/\r\n/);
    for (let j = 0; j < file.length; j++) {
        let index = file[j].indexOf('// TODO ');
        if (index>-1) {
            arr.push(file[j].substring(index));
        }
    }
}

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let s of arr)
                console.log(s);
            break;
        case 'important':
            for (let s of arr) {
                if(s.indexOf('!') > -1)
                    console.log(s);
            }
            break;
        case /user \w+/:
            username = command.split()[1];
            for (let s of arr) {
                let indexUserName = s.indexOf(username)
                if((username + /;( )?\d{4}-\d{2}-\d{2}\;(.)+/).test(s))
                    console.log(s);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
