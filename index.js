const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getToDO(){
    let res = []
    let lines = getFiles();
    
    for (let q = 0; q < lines.length; q++){
        let txt = lines[q].split('\r\n');
        //console.log(txt);
        for (let i = 0; i < txt.length; i++) {
            let ind = txt[i].indexOf("// TODO"); 
            if (ind != -1) {
                //console.log(txt[i]);
                res.push(txt[i].slice(ind+8));
            }
        }
    }
    return res
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getToDO());
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
