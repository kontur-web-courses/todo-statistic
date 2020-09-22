const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const todo = '// TO' + 'DO ';

const files = getFiles();
let comments = [];
for(file of files)
    for(row of file.split('\r\n'))
    {
        let index = 0;
        let isWrite = false;
        let comment = '';
        for(symbol of row)
        {
            if(isWrite)
                comment += symbol;
            if(symbol === todo[index])
                index++;
            else
                index = 0;
            if(index === todo.length)
                isWrite = true;
        }
        if(isWrite)
            comments.push(comment);
    }
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command.substring(0, 4)) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for(comment of comments)
                console.log(comment);
            break;
        case 'impo':
            if(command !== 'important')
                break;
            for(comment of comments.filter(comment => comment.includes('!')))
                console.log(comment);
            break;
        case 'user':
            let specialComments = getSpecialComments();
            let user = command.substring(5).toLowerCase();
            for(comment of specialComments.get(user).map(n => n.comment))
                console.log(comment);
            break;
        case 'sort':
            let atribute = command.substring(5);
            let spec = getSpecialComments();
            switch(atribute){
                case 'importance':
                    for(comment of comments.filter(comment => comment.includes('!')))
                        console.log(comment);
                    for(comment of comments.filter(comment => !comment.includes('!')))
                        console.log(comment);
                    break;
                case 'user':
                    for(comment of spec)
                        if(comment[0] !== 'Nan')
                        {
                            console.log(comment[0]);
                            for(com of comment[1])
                                console.log(com.comment);
                        }
                    for(com of spec.get('Nan'))
                        console.log(com);
                    break;
                case 'date':
                    const sortArr = [];
                    for(let com of spec.values())
                        if(Array.isArray(com))
                            for(let c of com)
                                sortArr.push(c);
                        else
                            sortArr.push(com);
                    sortArr.sort((a, b) => b.date - a.date);
                    for(let i = 0; i < sortArr.length; i++)
                        if(typeof sortArr[i] !== 'string')
                            console.log(sortArr[i].comment);
                    for(com of spec.get('Nan'))
                        console.log(com);
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
            
    }
}

function getSpecialComments(){
    let result = new Map();
    result.set('Nan',[]);
    for(let comment of comments){
        let endOfUserName = 0;
        let endOfDate = 0;
        for(let i = 0; i < comment.length; i++)
        if(comment[i] === ';'){
            if(endOfUserName === 0)
                endOfUserName = i;
            else if(endOfDate === 0)
                endOfDate = i;
        }
        let arr = [];
        if(endOfDate && endOfUserName)
        {
            let user = comment.substring(0, endOfUserName).toLowerCase();
            arr.push({ 
                date : new Date(comment.substring(endOfUserName + 1, endOfDate)),
                comment : comment.substring(endOfDate + 2)
            })
            if(!result.has(user))
                result.set(user, arr)
            else
                result.get(user).push(arr[0]);
        }
        else
            result.get('Nan').push(comment);
    }
    return result;
}

// TODO you can do it!

