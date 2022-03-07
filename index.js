const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTODO(files) {
    return files.map(file => file
        .split('\n')
        .filter(string => string.includes('// TODO '))
        .map(string => string.substr(string.indexOf('// TODO '))))
        .flat();
}

function getAllTODOWithName(files, name) {
    let allTODO = getAllTODO(files);
    let exp = new RegExp(`// TODO ${name};[\\s]?[\\D\\d]+;[\\s]?[\\D\\d]+`, 'i');
    return allTODO.filter(elem => exp.exec(elem));
}

function getAllTOTDOWithoutFormat(files) {
    let allTODO = getAllTODO(files);
    let exp = new RegExp(`// TODO [\\D\\d]+;[\\s]?[\\D\\d]+;[\\s]?[\\D\\d]+`, 'i');
    return allTODO.filter(elem => !exp.exec(elem));
}

function getAllTOTDOWithFormat(files) {
    let allTODO = getAllTODO(files);
    let exp = new RegExp(`// TODO [\\D\\d]+;[\\s]?[\\D\\d]+;[\\s]?[\\D\\d]+`, 'i');
    return allTODO.filter(elem => exp.exec(elem));
}

function getAllNamesFromTODOWithFormat(files) {
    let TODOlen = '// TODO '.length;
    let allTODO = getAllTODO(files);
    let exp = new RegExp(`// TODO [\\D\\d]+;[\\s]?[\\D\\d]+;[\\s]?[\\D\\d]+`, 'i');
    return new Set(allTODO
        .filter(elem => exp.exec(elem))
        .map(elem => elem.substr(TODOlen, elem.indexOf(';') - TODOlen))
        .map(elem => elem.toLowerCase()));
}

function getDateFromFormatString(string) {
    return Date.parse(string.trim().split(';')[1]);
}

function processCommand(command) {
    let splitCommand = command.split(' ');
    let mainCommand = splitCommand[0];
    splitCommand.shift();
    let args = splitCommand;
    switch (mainCommand) {
        case 'exit':
            if (args.length !== 0) {
                break;
            }
            process.exit(0);
            break;
        case 'show':
            if (args.length !== 0) {
                break;
            }
            console.log(getAllTODO(files));
            break;
        case 'important':
            if (args.length !== 0) {
                break;
            }
            console.log(getAllTODO(files).filter(elem => elem.includes('!')));
            break;
        case 'user':
            if (args.length !== 1) {
                break;
            }
            let name = args[0];
            console.log(getAllTODOWithName(files, name));
            break;
        case 'sort':
            if (args.length !== 1) {
                break;
            }
            let flag = args[0];
            if (flag === 'importance') {
                console.log(getAllTODO(files).sort((elem1, elem2) =>
                    (elem2.match(/!/g) || []).length - (elem1.match(/!/g) || []).length));
            }
            if (flag === 'user') {
                let ans = [];
                getAllNamesFromTODOWithFormat(files).forEach(name => ans.push(getAllTODOWithName(files, name)));
                ans.push(getAllTOTDOWithoutFormat(files));
                console.log(ans.flat());
            }
            if (flag === 'date') {
                let ans = [];
                let TODOWithDate = getAllTOTDOWithFormat(files).map(function(elem) { return {
                    string: elem, 
                    date: getDateFromFormatString(elem)
                }});
                ans.push(TODOWithDate.sort((elem1, elem2) => elem1.date - elem2.date).map(tuple => tuple.string));
                ans.push(getAllTOTDOWithoutFormat(files));
                console.log(ans.flat());
            }
            break;
    }
}

// TODO you can do it!
