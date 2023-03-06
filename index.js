const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllComments() {
    let comments = [];
    for (let file of files) {
        let matches = file.match(/\/\/ TODO .*/g);
        comments.push(...matches);
    }
    return comments;
}



function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getAllComments());
            break;
        case 'important':
            let importantComments = getAllComments().filter(s => s.includes('!'));
            console.log(importantComments);
            break;
        default:
            if (command.startsWith('user ')) {
                let userName = command.slice(5);
                let regExp = new RegExp(`//` + ` TODO ${userName};`, 'i');
                let userComments = getAllComments().filter(s => regExp.test(s));
                console.log(userComments);
                break;
            }
            else if (command.startsWith('sort ')) {
                let sortBy = command.split(' ')[1];
                let comparer = comparers[sortBy];
                let sorted = getAllComments().sort((s1,s2) => -comparer(s1,s2));
                console.log(sorted);
                break;
            }
            else if (command.startsWith('date '))
            {
                {
                let date = new Date(command.split(' ')[1]);
                let comments = getAllComments();
                let olderComments = [];
                for(let comment of comments)
                {
                    let userDate = getUserNameAndDate(comment);
                    if(userDate !== null && userDate[1] > date)
                    {
                        olderComments.push(comment);
                    }
                }
                console.log(olderComments);
                break;
            }
            }
            console.log('wrong command');
            break;
    }
}

const comparers = {
    importance: importanceComparer,
    user: userComparer,
    date: dateComparer,
}

function getUserNameAndDate(comment) {
    let regExp = new RegExp('\/\/ TODO .*;');
    if (!regExp.test(comment)) {
        return null;
    }
    let userName = comment.match(/\/\/ TODO .[^;]*/)[0].slice(8);
    let date = comment.match(regExp)[0].slice(-11, -1);
    return [userName, new Date(date)]; 
}

function importanceComparer(s1, s2) {
    return getExclamationPointCount(s1) - getExclamationPointCount(s2);
}

function userComparer(s1, s2) {
    let userDate1 = getUserNameAndDate(s1);
    let userDate2 = getUserNameAndDate(s2);
    if(userDate1 === null)
        return -1;
    if(userDate2 === null)
        return 1;
    
    return userDate1[0].localeCompare(userDate2[0]);
}

function dateComparer(s1, s2)
{
    let userDate1 = getUserNameAndDate(s1);
    let userDate2 = getUserNameAndDate(s2);
    if(userDate1 === null)
        return -1;
    if(userDate2 === null)
        return 1;
    
    return userDate1[1] >= userDate2[1] ? 1 : -1;
}

function getExclamationPointCount(str) {
    return (str.match(/!/g) || []).length;
}
// TODO you can do it!
