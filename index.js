const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function findAllTODO(re){
    for (file of files){
        let str = file.matchAll(re);
        for (e of str){
            console.log(e[0])
        }
    }
}

function findOtherTODO(re){
    for (file of files){
        let str = file.matchAll(re);
        let res = []
        for (e of str){
            res.push(e[0])
        }
        res.flat();
        res.sort(function (a, b) {
            return b.split("!").length - 1 - a.split("!").length - 1
        });
        console.log(res)
    }
}

function processCommand(command) {
    let a = command.split(' ')
    if (a.length > 1){
        a = a.slice(1, a.length).join(' ')
    }
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            findAllTODO(/\S*(\/\/ TODO .*)\r\n/g);
            break;
        case 'important':
            findAllTODO(/\S*(\/\/ TODO .*!+)\r\n/g);
            break;
        case `user ${a}`:
            findAllTODO(new RegExp('[\n.]*(\/\/ TODO ' + a + '.*)[\r\n]*', "ig"));
            break;
        case `user`:
            findAllTODO(new RegExp('[\n.]*(\/\/ TODO .+;.*)[\r\n]*', "ig"));
            findAllTODO(new RegExp('[\n.]*(\/\/ TODO (?!.+;).*)[\r\n]*', "ig"));
            break;
        case `sort ${a}`:
            processCommand(a)
            break;
        case 'test':
            findOtherTODO(/\S*(\/\/ TODO .*)\r\n/g);
            break
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
