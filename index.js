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
    const commandContext = command.split(' ');
    switch (commandContext[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'date':
            const date = commandContext[1];
            formatLog(getTODOsAfterDate(getTODOs(), date));
            break;
        case 'sort':
            const parameter = commandContext[1];
            formatLog(sortUsingParameter(getTODOs(), parameter));
            break;
        case 'user':
            const username = commandContext[1];
            formatLog(getTODOsOfUser(getTODOs(), username));
            break;
        case 'important':
            formatLog(getImportantTODOs(getTODOs()));
            break;
        case 'show':
            formatLog(getTODOs());
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function formatLog(data) {
    console.log(`!  |  ${'user'.padEnd(10)}  |  ${'date'.padEnd(11)}  | comment`)
    console.log(`-`.repeat(100))
    for (let line of data) {
        const importance = line.indexOf('!') > -1 ? '!' : ' ';
        line = line.slice(8);
        const parts = line.split(';');
        let name = (parts.length === 3 ? parts[0] : '');
        name = name.length > 10 ? name.slice(0, 7).concat('...') : name;
        name = name.padEnd(10);
        let date = (parts.length === 3 ? parts[1] : '').padEnd(11);
        let text = parts.length === 3 ? parts[2].trim() : line;
        text = text.length > 50 ? text.slice(0, 47).concat('...') : text;
        console.log(`${importance}  |  ${name}  |  ${date}  | ${text}`);
    }
    console.log('-'.repeat(100))
}

function getTODOs() {
    return files.join().match(/\/\/ TODO [^\r]*/g);
}

function getImportantTODOs(TODOs) {
    return TODOs.filter((el) => el.indexOf('!') > -1);
}

function getTODOsOfUser(TODOs, name) {
    return TODOs.filter(
        (el) =>
            el.split(';')[0].slice(8).toLowerCase() === name.toLowerCase()
    );
}

function sortUsingParameter(TODOs, parameter) {
    switch (parameter) {
        case 'importance':
            return TODOs.sort(
                (a, b) => b.split('!').length - a.split('!').length
            );
        case 'user':
            return TODOs
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                .sort((a, b) => b.split(';').length - a.split(';').length);
        case 'date':
            let hasDate = TODOs.filter((el) => el.split(';').length === 3);
            let hasNotDate = TODOs.filter((el) => el.split(';').length !== 3);
            return hasDate
                .sort((a, b) => {
                    a = new Date(a.split(';')[1]);
                    b = new Date(b.split(';')[1]);
                    return a > b ? -1 : a < b ? 1 : 0;
                })
                .concat(hasNotDate);
    }
}

function getTODOsAfterDate(TODOs, date) {
    return TODOs
        .filter((el) => {
            const parts = el.split(';');
            return parts.length === 3 && new Date(parts[1]) > new Date(date);
        })
        .sort((a, b) => {
            a = new Date(a.split(';')[1]);
            b = new Date(b.split(';')[1]);
            return a > b ? -1 : a < b ? 1 : 0;
        });
}