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
    if(command.split(' ')[0] == 'date')
        makeBeauty(getDate(command.split(' ')[1]));
    else
    if(command.match(/sort/gi))
    {
        let secondCommand = command.split(' ')[1];
        switch (secondCommand)
        {
            case 'importance':
                makeBeauty(getSortImportant());
                break;

            case `user`:
                makeBeauty(getSortUsers())
                break;

            case `date`:
                makeBeauty(getSortDate());
                break;

            default:
                console.log('wrong command');
                break;
        }
    }
    else
    if(command.match(/user/gi))
    {
        let name = " " + command.split(' ')[1];
        makeBeauty(getUser(name))
    }
    else
        switch (command) {
            case 'exit':
                process.exit(0);
                break;
            case 'show':
                makeBeauty(getTodos());
                break;

            case 'important':
                makeBeauty(getImportant());
                break;

            default:
                console.log('wrong command');
                break;
        }

    function getTodos(){
        return files
            .map(file => file.match(/\/\/.*todo.*/gi))
            .flat(Infinity)
            .filter(x => x);
    }

    function getSortImportant(){
        return files
            .map(file => file.match(/\/\/.*todo.*/gi))
            .flat(Infinity)
            .filter(x => x)
            .sort((a, b) => countItem(b, '!') - countItem(a, '!'));
    }

    function getSortUsers(){
        let answer = [];
        let nameless = [];
        for(const el of getTodos())
            if(el.indexOf(';')>-1)
                answer.push(el);
            else
                nameless.push(el);
        return answer.sort().concat(nameless);
    }

    function getImportant(){
        return files
            .map(file => file.match(/\/\/ TODO .*!/gi))
            .flat(Infinity)
            .filter(x => x);
    }

    function getUser(name){
        let futureRegExp = `${name}`;
        let regexp = RegExp(futureRegExp.toUpperCase());
        let answer = [];
        for(const el of getTodos())
            if(regexp.test(el.toUpperCase()))
                answer.push(el);
        return answer;
    }

    function getSortDate()
    {
        let answer = [];
        let end = [];
        for(const el of getTodos())
        {
            let arr = el.split(';');
            if(arr.length>1)
            {
                answer.push(el);
            }
            else
                end.push(el)
        }
        answer.sort(function(a, b){
            let dateA=new Date(a.match(/\d\d\d\d-\d\d-\d\d/)), dateB=new Date(b.match(/\d\d\d\d-\d\d-\d\d/))
            return dateB-dateA});
        return answer.concat(end);
    }

    function getDate(date)
    {
        const dateA=new Date(date);
        let answer = [];
        for(const el of getTodos())
        {
            let arr = el.split(';');
            if(arr.length>1)
            {
                answer.push(el);
            }
        }
        answer = answer.filter(function(b) {
            let dateB=new Date(b.match(/\d\d\d\d-\d\d-\d\d/))
            return dateB > dateA;
        });
        return answer;
    }

    function countItem(string, item)
    {
        return string.split('').reduce((p, i) => i ===item ? p + 1 : p, 0);
    }

    function makeBeauty(text)
    {
        let nameLength = 1;
        let dateLength = 1;
        let messageLength = 1;
        for(const str of text)
        {
            if(str.indexOf(';') > -1)
            {
                let arr = str.split(';');

                if(arr[0].split(' ')[2].length > nameLength)
                    if(arr[0].split(' ')[2].length>=10)
                        nameLength = 10;
                    else
                        nameLength = arr[0].split(' ')[2].length;

                if(arr[1].substr(1,arr[1].length).length > dateLength ) 
                    if(arr[1].substr(1,arr[1].length).length>=10)
                        dateLength = 10;
                    else
                        dateLength = arr[1].substr(1,arr[1].length).length;

                if(arr[2].length > messageLength)
                    if(arr[2].length>=50)
                        messageLength = 50;
                    else
                        messageLength = arr[2].length;
            }
        }

        printRow("  !",nameLength, "user", dateLength, "date",messageLength, " comment")

        let sum = 5+nameLength+dateLength+messageLength+15;
        console.log("".padStart(sum, "-"));
        
        for(const str of text)
        {
            let arr = str.split(';');
            let important='';
            let name=arr[0].split(' ')[2];
            let date=arr[1];
            let message =arr[2];
            if(str.indexOf('!') > -1)
                important= '  !  ';
            if(str.indexOf(';') == -1)
            {
                name ='';
                date ='';
                message = str.substr(7,str.length);
            }
            printRow(important,nameLength, name, dateLength, date.replace(/\s+/g, ''),messageLength, message);
        }
        console.log("".padStart(sum, "-"));
}
}

function printRow(important,nameLength, name, dateLength, date,messageLength, message)
{
    if(message.length>messageLength)
        message = message.substr(0, messageLength-2)+"...";
    console.log(important.padEnd(5) +'|  ' 
    + name.padEnd(nameLength) + '  |  ' 
    + date.padEnd(dateLength) + '  | ' 
    + message.padEnd(messageLength));
}

// todo you can do it!
// TODO example
