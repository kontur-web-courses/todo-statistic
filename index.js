const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

const todos = x => {let result = [];
    for (let file of files)
    {
        let rows = file.split('\r\n').filter(x => x.indexOf('// todo '.toUpperCase()) !== -1 )
            .map(x => x.substr(x.indexOf('// todo '.toUpperCase()) + 8));
        result = result.concat(rows);
    }
    return result;
}

function processCommand(command) {
    const a = command.split(' ')
    switch (a[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log()
            let d = todos()
            if (d.length !== 0)
                console.log(d.join('\n----------------------------------------------\n'));
            break;
        case 'important':
            console.log()
            let c = todos().filter(x => x.includes('!'))
            if (c.length !== 0)
                console.log(c.join('\n----------------------------------------------\n'));
            break;
        case 'user':
            console.log()
            let b = todos().filter(x => x.split(';')[0].toLowerCase() === a[1].toLowerCase())
            if (b.length !== 0)
                console.log(b.join('\n----------------------------------------------\n'))
            break;
        case 'sort':
            console.log()
            switch(a[1]) {
                case 'importance':
                    let k = todos().sort((x, y) => y.split('').filter(t => t === '!').length
                        - x.split('').filter(t => t === '!').length)
                    if (k.length !== 0)
                        console.log(k.join('\n----------------------------------------------\n'))
                    break;
                case 'user':
                    let p = todos().sort( (x,y) => x.split(';')[0].toLowerCase() < y.split(';')[0].toLowerCase()
                        ? -1 : x.split(';')[0].toLowerCase() > y.split(';')[0].toLowerCase() ? 1 : 0)
                        .sort((x,y) => y.split(';').length - x.split(';').length)
                    if (p.length !== 0)
                        console.log(p.join('\n----------------------------------------------\n'))
                    break;
                case 'date':
                    let s = todos().sort( (x,y) => x.split(';')[1] < y.split(';')[1]
                        ? 1 : x.split(';')[1] > y.split(';')[1] ? -1 : 0)
                        .sort((x,y) => y.split(';').length - x.split(';').length)
                    if (s.length !== 0)
                        console.log(s.join('\n----------------------------------------------\n'))
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
