const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const TODOIdentity = /\/\/.*todo/gi;

let headers = {
    importance: 1,
    fileName: 'file_name',
    userName: 'user',
    date: 'date',
    comment: 'comment'
};

let longestFileName = headers.fileName.length;
let longestName = headers.userName.length;
let longestDate = headers.date.length;
let longestComment = headers.comment.length;

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    return getAllFilePathsWithExtension(process.cwd(), 'js');
}

function processCommand(userCommand) {
    let [command, ...args] = userCommand.split(' ');
    args = args.toString();
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            findAllTODOs()
                .map(TODO => show(TODO));
            split();
            break;
        case 'important':
            findAllTODOs(true)
                .map(TODO => show(TODO));
            split();
            break;
        case 'user':
            findAllTODOs(false, args.toLowerCase())
                .map(TODO => show(TODO));
            split();
            break;
        case 'sort':
            filterTODOS(args)
                .map(TODO => show(TODO));
            split();
            break;
        case 'date':
            filterTODOS('date')
                .reverse()
                .map(TODO => {
                    if (+(new Date(TODO.date)) > +(new Date(args)))
                        show(TODO);
                });
            split();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function split() {
    console.log('-'.repeat(longestComment + longestDate + longestName + longestFileName + 21))
}

function show(todo) {
    console.log((todo.importance ? '!' : '').padEnd(3, ' ') + '|'.padEnd(3, ' ') +
            todo.fileName.padEnd(longestFileName + 2, ' ') + '|'.padEnd(3, ' ') +
            todo.userName.padEnd(longestName + 2, ' ') + '|'.padEnd(3, ' ') +
            todo.date.padEnd(longestDate + 2, ' ') + '|'.padEnd(3, ' ') +
            todo.comment.padEnd(longestComment + 2, ' '))
}

function filterTODOS(filter) {
    let TODOS = findAllTODOs();

    switch (filter) {
        case 'importance':
            return TODOS
                    .sort((a, b) => b.importance - a.importance)
                    .map(x => x.full)
        case 'user':
            return TODOS
                    .sort((a, b) => {
                        if (b.userName > a.userName) return 1;
                        if (a.userName > b.userName) return -1;
                        return 0;
                    })
                    .map(x => x.full)
        case 'date':
            return TODOS
                    .sort((a, b) => +(new Date(b.date) - +(new Date(a.date))))
        default:
            console.log('wrong filter')
            break;
    }
}

function ParsedTODO(string, fileName) {
    function countImportance(string) {
        let importance = 0;
        while ((string).includes('!')){
            importance++;
            string = string.slice(string.indexOf('!') + 1);
        }
        return importance;
    }

    this.fileName = fileName;
    this.full = string;
    this.importance = countImportance(string);

    string = string.slice(8).split(';').map(x => x.trim());
    if (string.length < 2) {
        this.userName = '';
        this.date = '';
        this.comment = string[0];
        if (this.comment.length > longestComment)
            longestComment = this.comment.length
        return;
    }

    this.userName = string[0].toLowerCase();
    this.date = string[1];
    this.comment = string[2];

    if (this.fileName.length > longestFileName)
        longestFileName = this.fileName.length
    if (this.userName.length > longestName)
        longestName = this.userName.length
    if (this.date.length > longestDate)
        longestDate = this.date.length
    if (this.comment.length > longestComment)
        longestComment = this.comment.length
}

function findAllTODOs(important = false, userName = null) {
    let fileNumber = 0;
    let TODOs = [];
    for (let file of files.map(path => readFile(path))) {
        let fileName = files[fileNumber].split('/')[1];
        for (let string of file.split('\r\n' )) {
            // смотрим, содержит ли строка // ТODO
            if (string.match(TODOIdentity) && string.indexOf('const TODOIdentity') < 0) {
                string = string.slice(string.search(TODOIdentity))
                //если не дано имя, то смотрим дальше
                if (userName !== null) {
                    //если данного имени нет в строке, смотрим дальше
                    if (!string.toLowerCase().includes(' ' + userName + ';')) continue;
                }
                //если нужны важные и в комментарии нет !, то смотрим дальше
                else if (important && string.indexOf('!') < 0) {
                    continue;
                }
                TODOs.push(new ParsedTODO(string, fileName));
            }
        }
        fileNumber++;
    }
    show(headers);
    split();
    return TODOs;
}

// TODO you can do it!
// todo it1
