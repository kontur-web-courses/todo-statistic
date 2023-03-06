const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);


function readTextFile(file) {
    let reader = new FileReader();
    reader.readAsText(file);}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
function getAllToDo() {
    const files = getFiles();
    let res = []
    const regular_todo = /\/\/ TODO .+/g;
    for (const file1 of files) {
        let ans = file1.match(regular_todo);
        if (ans === null){
            continue;
        }
        res = res.concat(ans);
    }
    return res;
}

function getDate(str) {
    let a = str.split(';')[0];
    let b = str.split(';')[1];
    if (!isNaN(Date.parse(b))) return b;
         else if (!isNaN(Date.parse(a))) return a;
             else return null;
}


function processCommand(command) {
    const args = command.split(' ');
    switch (args[0]) {
        case 'user':
            getAllToDo().filter((v) =>  v.includes(`// TODO ${args[1]}`))
                .map((value) => console.log(value));
            break;
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const ans of getAllToDo()){
                console.log(ans);
            }
            break;
        case 'importance':
            getAllToDo().filter((v, i, a) => v.includes('!')).map((value) => console.log(value));
            break;
        case 'sort':
            switch (args[1]) {
                case 'date':
                    getAllToDo().sort((a, b) => {
                        if ((getDate(a) != null) && (getDate(b) == null)) return -1;
                        if ((getDate(a) == null) && (getDate(b) != null)) return 1;
                        if (getDate(a) > getDate(b)) return 1;
                        if (getDate(a) < getDate(b)) return -1;
                        if (getDate(a) === getDate(b)) return 0;
                    }).map((value) => console.log(value));
                    break;
                default:
                    console.log('');
                    break;

            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
