const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

Array.prototype.groupBy = function(selector) {
    return this.reduce(function(rv, x) {
        (rv[selector(x)] = rv[selector(x)] || []).push(x);
        return rv;
    }, {});
};

const files = getFiles();
const singleLineCommentRegex = /\/\/ TODO (.*)/g
const singleLineComments = [...files.map(f => getSingleLineComments(f))].flat();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getSingleLineComments(file) {
    return [...file.matchAll(singleLineCommentRegex)].map(m => m[1])
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            singleLineComments.forEach(x => console.log(x));
            break;
        case 'important':
            getImportantComments(singleLineComments).forEach(x => console.log(x));
            break;
        case command.match(/user (.*)/)?.input:
            const userName = command.match(/user (.*)/)[1].toLowerCase();
            singleLineComments.filter(x => getData(x)?.userName === userName)
                              .forEach(x => console.log(x));
            break;
        case command.match(/sort (importance|user|date)/)?.input:
            const order = command.match(/sort (importance|user|date)/)[1];
            let comments = [];
            switch (order) {
                case 'importance':
                    // noinspection JSVoidFunctionReturnValueUsed
                    singleLineComments.sort((a, b) => compareByExclamation(a, b, '!')).forEach(x => console.log(x));
                    break;
                case 'user':
                    Object.entries(singleLineComments.groupBy(x => getData(x)?.userName)).forEach(([name, comments]) => {
                        console.log(name + ":");
                        comments.forEach(x => console.log("\t" + x));
                    });
                    break;
                case 'date':
                    singleLineComments.sort((a, b) => getData(b)?.date - getData(a)?.date)
                        .forEach(x => console.log(x));
                    break;
            }
            break;
        case command.match(/date .*/)?.input:
            const date = Date.parse(command.match(/date (.*)/)[1]);
            singleLineComments.filter(x => getData(x)?.date > date).forEach(x => console.log(x));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

function getData(str) {
    const match = str.match(/^([^;]*);([^;]*);(.*)/);
    return match && {
        userName: match[1].toLowerCase(),
        date: Date.parse(match[2]),
        text: match[3]
    };
}

function getImportantComments(arr) {
    return arr.filter(x => x.includes('!'));
}

function compareByExclamation(a, b, symbol) {
    const countA = (a.match(`${symbol}`) || []).length;
    const countB = (b.match(`${symbol}`) || []).length;
    if (countA === 0 && countB === 0)
        return a.localeCompare(b);
    return countB - countA;
}
