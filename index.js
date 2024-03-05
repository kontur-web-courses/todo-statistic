const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    command = command.split(' ');
    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let comment of getTODOcomments(getFiles()).map(TODO => TODO.comment)){
                console.log('');
                console.log(comment);
                
            }
            break;
        case 'important':
            for (let comment of getTODOcomments(getFiles()).filter(TODO => TODO.importance > 0).map(TODO => TODO.comment)){
                console.log('');
                console.log(comment);
            }
            break;
        case 'user':
            for (let comment of getTODOcomments(getFiles())
            .filter(TODO => TODO.user !== undefined && TODO.user.toLowerCase() === command[1].toLowerCase())
            .map(TODO => TODO.comment)){
                console.log('');
                console.log(comment);
            }
            break;
        case 'sort':
            let array = getTODOcomments(getFiles());
            if (command[1] === 'importance'){
                array.sort((a, b) => b.importance - a.importance);
                array = array.map(TODO => TODO.comment);
            } else if (command[1] === 'date') {
                let withoutDate = array.filter(TODO => TODO.date === undefined).map(TODO => TODO.comment);
                let withDate = array.filter(TODO => TODO.date !== undefined).sort((a, b) => b.date - a.date).map(TODO => TODO.comment);
                array = withDate.concat(withoutDate);
            } else if (command[1] === 'user'){
                let dict = {};
                let undef = [];
                for (let TODO of array){
                    if (TODO.user !== undefined) {
                        if (!(TODO.user.toLowerCase() in dict)) {
                            dict[TODO.user.toLowerCase()] = [];
                        }
                        dict[TODO.user.toLowerCase()].push(TODO.comment.replace(TODO.user + ';', '').trim());
                    } else {
                        undef.push(TODO.comment);
                    }
                }
                array = [];
                for (let key in dict){
                    array.push(key+':');
                    for (let e of dict[key]){
                        array.push(e);
                    }
                }
                for (let e of undef){
                    array.push(e);
                }
            } else{
                console.log('Такая сортировка не поддерживается');
            }
            for (let elem of array){
                console.log();
                console.log(elem);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getTODOcomments(files){
    let TODO = [];
    for (let file of files){
        let tempFile = file;
        while (true){
            
            let index = tempFile.indexOf('// TODO ');
            if (index === -1){
                break;
            }
            tempFile = tempFile.slice(index);
            let nIndex = tempFile.indexOf('\n');
            if (nIndex === -1){
                TODO.push(createTODOObject(tempFile.trim()))
                break;
            }
            else{
                TODO.push(createTODOObject(tempFile.slice(8, nIndex).trim()))
                tempFile = tempFile.slice(nIndex);
            }
        }
    }
    return TODO;
}

function createTODOObject(TODOComment) {
    let TODOobject = { user: undefined,
                        date: undefined,
                        importance: 0,
                        comment: undefined
    };
    let ops =  TODOComment.split(';').map(
        function (tag) {
         return tag.trim()});
    TODOobject.comment = TODOComment;
    for (let e of ops.slice(0, -1)){
        let probableDate = Date.parse(e)
        if (Number.isNaN(probableDate)){
            TODOobject.user = e;
        }
        else{
            TODOobject.date = probableDate;
        }
    }
    let impTemp = TODOobject.comment.match(new RegExp('!', 'g'));
    TODOobject.importance = impTemp === null ? 0 : impTemp.length;
    return TODOobject;
}


// TODO you can do it!
