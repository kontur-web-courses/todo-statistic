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
    let data = command.split(' ');
    let cmd = data[0];
    let secondArgument = data[1];
    let todoLines = Array.from(String(files).matchAll('\\/\\/ TODO.*')).map(x => x[0]);
    switch (cmd) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let x of todoLines)
                console.log(x);
            break;
        case 'important':
            for (let line of todoLines)
                console.log(line);
            break;
        case 'user':
            for (let line of todoLines)
                if (line.indexOf(secondArgument) !== -1)
                    console.log(line);
            break;
        case 'sort':
            switch (secondArgument) {
                case 'importance':
                    let importanceCounter = [];
                    for (let line of todoLines) {
                        let counter = 0;
                        for (let i = line.length - 1; i >= 0; i--) {
                            if (line[i] === "!")
                                counter++;
                            else
                                break;
                        }
                        importanceCounter.push([line, counter]);
                    }
                    importanceCounter.sort((a, b) => {
                        return b[1] - a[1]
                    });
                    for (let line of importanceCounter.map(x=>x[0])){
                        console.log(line);
                    }
                    break;
                case 'user':
                    let userList = [];
                    for (let x of todoLines){
                        let name = x.match('\\/\\/ TODO (.*?);.*');
                        if (name !== null)
                            userList.push([x, x.match('\\/\\/ TODO (.*?);.*')[1]]);
                        else
                            userList.push([x, '']);
                    }
                    userList.sort((a, b) => {
                        return b[1].localeCompare(a[1]);
                    });
                    for (let line of userList.map(x=>x[0]))
                        console.log(line);
                    break;
                case 'date':
                    let dateList = [];
                    for (let x of todoLines){
                        let date = x.match('\\/\\/ TODO .*; (.*?);.*');
                        if (date !== null)
                            dateList.push([x, x.match('\\/\\/ TODO .*; (.*?);.*')[1]]);
                        else
                            dateList.push([x, '']);
                    }
                    dateList.sort((a, b) => {
                        return Date.parse(a[1]) - Date.parse(b[1]);
                    });
                    for (let line of dateList.map(x=>x[0]))
                        console.log(line);
                    break;
                default:
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
