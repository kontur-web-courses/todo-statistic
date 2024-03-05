const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const todoRegex = /\/\/\s*todo\s*:?/i;
const dateRegex = /(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?/

let usedComments = [];

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    function getCommentsArray() {
        let commentsArray = [];
        let filesArray = getFiles();
        for (let i = 0; i < filesArray.length; i++) {
            let lines = filesArray[i].split('\n')

            for (let j = 0; j < lines.length; j++) {
                let index = lines[j].search(todoRegex)
                if (index != -1)
                    commentsArray.push(lines[j].substring(index).trim());
            }
        }
        return commentsArray;
    }

    let commentsArray = getCommentsArray();
    let splittedCommand = command.split(' ');

    function parseDate(str1) {
        let workString = "";
        if (typeof str1 === 'string')
            workString = str1;
        else
            workString = str1[0]

        let dateArr = [];
        if (workString.includes('-'))
            dateArr = workString.split('-');
        else
            dateArr.push(workString)
        let year = Number(dateArr[0]);
        let month = 1;
        let day = 1;

        if (dateArr.length >= 2) {
            month = Number(dateArr[1]);
        }
        if (dateArr.length >= 3) {
            day = Number(dateArr[2]);
        }
        return {year, month, day};
    }

    function printUser() {
        for (let i = 0; i < commentsArray.length; i++) {
            if (commentsArray[i].toLowerCase().includes(splittedCommand[1].toLowerCase())) {
                console.log(commentsArray[i]);
                usedComments.push(commentsArray[i]);
            }
        }
    }

    function printImportant() {
        for (let i = 0; i < commentsArray.length; i++) {
            if (commentsArray[i].includes('!')) {
                console.log(commentsArray[i]);
                usedComments.push(commentsArray[i]);
            }
        }
    }

    function printReminder() {
        for (let i = 0; i < commentsArray.length; i++) {
            if (!usedComments.includes(commentsArray[i]))
                console.log(commentsArray[i]);
        }
    }

    function printDate() {
        let {year, month, day} = parseDate(splittedCommand[1]);

        let currentDate = new Date(year, month - 1, day);

        for (let i = 0; i < commentsArray.length; i++) {
            let matchResult = commentsArray[i].match(dateRegex);
            if (matchResult !== null) {
                let {year, month, day} = parseDate(matchResult[0]);

                let comparisonDate = new Date(year, month - 1, day)
                if (comparisonDate > currentDate) {
                    console.log(commentsArray[i]);
                    usedComments.push(commentsArray[i]);
                }
            }
        }
    }

    switch (splittedCommand[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let i = 0; i < commentsArray.length; i++) {
                console.log(commentsArray[i]);
            }
            break;
        case 'important':
            printImportant();
            break;
        case 'user':
            printUser();
            break;
        case 'sort':
            let subCommand = splittedCommand[1];
            if (subCommand == 'important') {
                printImportant();
                printReminder();
            }
            if (subCommand == 'user') {
                printUser();
                printReminder();
            }
        case 'date':
            printDate();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
