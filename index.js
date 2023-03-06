const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

//const important = TODOs.filter(todo => todo.indexOf('!') > -1)

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

const findTerm = (term) => {
    if (href.includes(term)){
        return href;
    }
};

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;

        case 'show':
            const TODOs = files.toString().match(/\/\/ TODO .*/gmu);
            console.log(TODOs);
            break;

        case 'important':
            const important = files.toString().match(/\/\/ TODO .*!+.*/gmu);
            console.log(important);
            break;

        case (command.match(/^user/) || {}).input:
            const user = command.split(' ')[1];
            const regExp = new RegExp(`\/\/ TODO ${user}; *.*; *.*`, 'gmui');
            const userTODOs = files.toString().match(regExp);
            console.log(userTODOs);
            break;

        case 'sort importance':
            const importantUnsorted = files.toString().match(/\/\/ TODO .*.*/gmu);
            const importantSorted = importantUnsorted.sort((a, b) =>
                (b.split("!").length - 1) - (a.split("!").length - 1));
            console.log(importantSorted);
            break;

        case 'sort user':
            const regExpAnyUser = new RegExp(`\/\/ TODO .+; *.*; *.*`, 'gmui');
            const noUserTODOs = [];
            const anyUserTODOs = [];
            const AllTODOs = files.toString().match(/\/\/ TODO .*/gmu);
            for (let f of AllTODOs)
            {
                if (f.match(regExpAnyUser))
                    anyUserTODOs.push(f)
                else
                    noUserTODOs.push(f)
            }

            const userSorted = anyUserTODOs.sort((a, b) =>
            {
                const userA = a.toLowerCase().split(";")[0].slice(8);
                const userB = b.toLowerCase().split(";")[0].slice(8);
                if (userA < userB) {
                    return -1;
                }
                if (userA > userB) {
                    return 1;
                }
                return 0;
            });

            console.log(userSorted);
            console.log(noUserTODOs);
            break;

        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
