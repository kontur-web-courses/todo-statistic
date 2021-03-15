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
            console.log(getComments())
            break;
        case 'important':
            console.log(getComments().filter(x => x.indexOf('!') !== -1))
            break;
        case `user ${name = command.split(' ')[1]}`:
            console.log(getComments().filter(x => {
                let s = x.match(/\/\/ TODO (.+?);\s*(.+?);\s*/)
                return s !== null && s[1].toLowerCase() === name.toLowerCase();
            }))
            break;
        case `sort ${arg = command.split(' ')[1]}`:
            if (arg === 'importance') {
                const sortedComm = getComments()
                    .sort((x, y) =>
                        y.split('').filter(y => y === '!').length - x.split('').filter(y => y === '!').length);
                console.log(sortedComm)
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
                console.log(sortedComm)
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

                console.log(sortedComm)
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
