const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

const groupBy = (arr, fn) => //;;
    arr
        .map(typeof fn === 'function' ? fn : val => val[fn])
        .reduce((acc, val, i) => {
            acc[val] = (acc[val] || []).concat(arr[i]);
            return acc;
        }, {});

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getComment(file){
    let todos = String(file).split('\n').filter(x => x.includes('// TODO') && !x.includes('x.includes'));
    let comments = [];

    for(line of todos)
        comments.push(line.slice(line.indexOf('TODO') + 5, line.length));
    return comments;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (file of files)
                console.log(getComment(file).join('\n'))
            break;
        case 'sort importance':
            let megaComments = [];
            for (file of files){
                megaComments = megaComments.concat(getComment(file));
            }
            console.log(megaComments.sort((a, b) => b.split('').filter(t => t === '!').length - a.split('').filter(t => t === '!').length).join('\n'));
            break;
        case 'sort date':
            let m = [];
            for (file of files){
                m = m.concat(getComment(file));
            }
            console.log(m.sort((a, b) => {
                let dateA;
                let dateB;
                if (a.split(';')[0].toLowerCase().split(' ').length !== 1)
                {
                    dateA = new Date('2045-08-10');
                }
                else
                    dateA = new Date(a.split(';')[1]);

                if (b.split(';')[0].toLowerCase().split(' ').length !== 1)
                {
                    dateB = new Date('2045-08-10');
                }
                else
                    dateB = new Date(a.split(';')[1]);
                return dateB - dateA;
            }).join('\n'));
            break;
        case 'sort user':
            let megaComm = [];
            for (file of files){
                megaComm = megaComm.concat(getComment(file));
            }
            let u = groupBy(megaComm, e => {
                    if (e.split(';')[0].toLowerCase().split(' ').length !== 1)
                        return "";
                    return e.split(';')[0].toLowerCase();
                }
            )
            for (k in u){
                if (k !== "")
                    console.log(u[k].join('\n'));
            }
            console.log(u[""].join('\n'));
            break;
        case 'important':
            for (file of files){
                let comments = getComment(file).filter(x => x.includes('!'));
                if (comments.length !== 0)
                    console.log(comments.join('\n'));
            }
            break;
        default:
            if (command.includes('user')){
                let userName = command.split(' ')[1];

                for (file of files){
                    let comments = getComment(file).filter(x => x.toLowerCase().includes(userName.toLowerCase()));
                    if (comments.length !== 0)
                        console.log(comments.join('\n'));
                }
                break;
            }
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
