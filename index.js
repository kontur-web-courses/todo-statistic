const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getComments() {
    let comments = [];

    String.prototype.getMatches = function (regex, callback) {
        let matches = [];
        let match;
        while ((match = regex.exec(this)) !== null) {
            if (callback) {
                matches.push(callback(match));
            } else {
                matches.push(match)
            }
        }
        return matches
    }

    for (let i = 0; i < files.length; i++) {
        comments = comments.concat((files[i].getMatches(/(\/\/ TODO .+)(\r\n)*/g,
            function (matches) {
                return matches[1];
            })));
    }

    return comments;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            formattingOutput(getComments());
            break;
        case 'important':
            formattingOutput(getComments().filter(x => x.indexOf('!') !== -1))
            break;
        case `user ${name = command.split(' ')[1]}`:
            formattingOutput(getComments().filter(x => {
                let s = x.match(/\/\/ TODO (.+?);\s*(.+?);\s*/)
                return s !== null && s[1].toLowerCase() === name.toLowerCase();
            }))
            break;
        case `sort ${arg = command.split(' ')[1]}`:
            if (arg === 'importance') {
                const sortedComm = getComments()
                    .sort((x, y) =>
                        y.split('').filter(y => y === '!').length - x.split('').filter(y => y === '!').length);
                formattingOutput(sortedComm)
            } else if (arg === 'user') {
                const sortedComm = getComments()
                    .sort((x, y) => {
                            const s1 = x.match(/\/\/ TODO (.+?);\s*(.+?);\s*/);
                            const s2 = y.match(/\/\/ TODO (.+?);\s*(.+?);\s*/);
                            if (s1 === null) {
                                return s2 !== null ? s2[1].length : -1
                            } else if (s2 !== null) {
                                return s1[1].toLowerCase() > s2[1].toLowerCase() ? s1.length : -1;
                            } else {
                                return s1[1].length
                            }
                        }
                    );
                formattingOutput(sortedComm)
            } else if (arg === 'date') {
                const sortedComm = getComments()
                    .sort((x, y) => {
                        const s1 = x.match(/\/\/ TODO (.+?);\s*(.+?);\s*/);
                        const s2 = y.match(/\/\/ TODO (.+?);\s*(.+?);\s*/);
                        if (s1 === null) {
                            return s2 !== null ? s2[2].length : -1
                        } else if (s2 !== null) {
                            return s1[2].toLowerCase() < s2[2].toLowerCase() ? s1.length : -1;
                        } else {
                            return s1[2].length
                        }
                    });

                formattingOutput(sortedComm)
            }
            break;
        case `date ${date = command.split(' ')[1]}`:
            formattingOutput(getComments().filter(x => {
                const s = x.match(/\/\/ TODO (.+?);\s*(.+?);\s*/);
                return s !== null ? s[2] > date : false;
            }));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function formattingOutput(array) {
    for (const str of array) {
        let s = str.match(/\/\/ TODO (.+?);\s*(.+?);\s*(.+)(\r\n)*/);
        const i = str.split('').filter(y => y === '!').length > 0 ? '!' : ' ';

        if (s !== null) {
            const name = s[1].length > 10 ? s[1].substr(0, 9) + '…' : s[1].padEnd(10, ' ');
            const date = s[2].padEnd(10, ' ');
            const message = s[3].length > 50 ? s[3].substr(0, 49) + '…' : s[3].padEnd(50, ' ');
            console.log([i, name, date, message].join('  |  '));
        } else {
            s = str.match(/\/\/ TODO (.+)(\r\n)*/);
            const name = ''.padEnd(10, ' ');
            const date = ''.padEnd(10, ' ');
            const message = s[1].length > 50 ? s[1].substr(0, 49) + '…' : s[1].padEnd(50, ' ');
            console.log([i, name, date, message].join('  |  '));
        }
    }
}

// TODO you can do it!
