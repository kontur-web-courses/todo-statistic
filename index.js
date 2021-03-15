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
    if (command === 'exit') {
        process.exit(0);
    } else if (command === 'show') {
        console.log(getComments().join('\n'));
    } else if (command === 'important') {
        console.log(getImportantComments().join('\n'));
    } else if (command.startsWith('user')) {
        let name = command.slice(5);
        console.log(getUserComments()[name].join('\n'));
    } else if (command.startsWith('sort')) {
        let sortType = command.slice(5);
        switch (sortType) {
            case 'importance':
                console.log(sortByImportance());
                break;
            case 'user':
                console.log(sortByNames());
                break;
            case 'date':
                console.log(sortByDate());
                break;
            default:
                console.log(sortByDate())
                break;
        }
    } else {
        console.log('wrong command');
    }
}

// TODO you can do it!
const TODO = '// TODO'


function getComments() {
    let lines = getFiles().join().split('\r\n');
    let result = lines.map(function (line) {
        return line.slice(line.indexOf(TODO))
    });
    return result.filter(line => line.length > 8);
}

function getImportantComments() {
    let comments = getComments();
    return comments.filter(line => line.indexOf('!') !== -1);
}

function initComments() {
    return getComments().map(line => line.split(';'));
}

function getUserComments() {
    let comments = initComments();
    let userComment = {};
    comments.map(line => {
            let name = line[0].slice(8).toLowerCase();
            if (userComment[name] === undefined) {
                userComment[name] = [];
            }
            if (line.length > 1) {
                userComment[name].push(line[2].slice(1));
            }
        }
    );
    return userComment;
}


function sortByNames() {
    let comments = initComments();
    let userComment = {};
    let unnamedComment = {}
    comments.map(line => {
            let name = line[0].slice(8).toLowerCase();
            unnamedComment['unnamed'] = []
            if (line.length === 1) {
                unnamedComment['unnamed'].push(line[0].slice(8))
            }
            if (line.length > 1) {
                if (userComment[name] === undefined) {
                    userComment[name] = [];
                }
                userComment[name].push(line[2].slice(1));
            }
        }
    );
    return (Object.entries(userComment).sort().concat(Object.entries(unnamedComment).sort()));
}


function sortByImportance () {
    let comments = getComments();
    let counterObject = Object();
    for (let arrayElement of comments) {
        let counter = 0;
        for (let i = 0; i < arrayElement.length; i++) {
            if (arrayElement[i] === '!') {
                counter++;
            }
        }
        if(counterObject[counter] === undefined)
            counterObject[counter] = []
        counterObject[counter].push(arrayElement);
    }
    return (Object.entries(counterObject).sort((a, b) => b[0] - a[0]));
}


function sortByDate(){
    let comments = initComments();
    let userComment = {};
    let unnamedComment = {}
    comments.map(line => {
            let name = line[1];
            unnamedComment['undated'] = []
            if (line.length === 1) {
                unnamedComment['undated'].push(line[0].slice(8))
            }
            if (line.length > 1) {
                if (userComment[name] === undefined) {
                    userComment[name] = [];
                }
                userComment[name].push(line.join(' '));
            }
        }
    );
    return (Object.entries(userComment).sort().concat(Object.entries(unnamedComment).sort()));
}
