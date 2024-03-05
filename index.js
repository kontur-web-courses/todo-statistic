const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTODOs(file){
    let TODOs = [];
    for (const obj of [...file.matchAll(/\/\/ TODO.*/g)]){
        TODOs.push(obj[0])
    }
    return TODOs;
}

function filter(TODOs, symbol) {
    const result = [];
    for (const TODO of TODOs){
        if (TODO.includes(symbol)){
            result.push(TODO);
        }
    }
    return result;
}

function processCommand(command) {
    const splitCommand = command.split(' ');
    const comm = splitCommand[0];
    const arguments = splitCommand.splice(1);

    switch (comm) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
        {
            const result = [];
            for (const file of getFiles()){
                result.push(...getTODOs(file));
            }
            for (const item of result){
                console.log(item);
            }
            break;
        }
        case 'important':
        {
            const result = [];
            for (const file of getFiles()){
                result.push(...filter(getTODOs(file), '!'));
            }
            for (const item of result){
                console.log(item);
            }
            break;
        }
        case 'user':
            const semiResult = [];
            for (const file of getFiles()){
                const TODOs = filter(getTODOs(file), ';');
                if (!TODOs.length){
                    continue;
                }
                semiResult.push(TODOs)
            }
            const name = arguments[0];

            for (const TODOs of semiResult){
                const result = [];
                for (const TODO of TODOs){
                    if (TODO.split(';')[0].split('TODO')[1].trim().toLowerCase() === name.toLowerCase()){
                        result.push(TODO);
                    }
                }
                console.log(...result);
            }
            break;
        case 'sort':
            const allTODOs = [];
            for (const file of getFiles()){
                allTODOs.push(...getTODOs(file));
            }

            switch (arguments[0].trim()){
                case 'importance':
                    allTODOs.sort((b, a) => {
                        const countA = (a.match(/!/g) || []).length; // Подсчитываем количество восклицательных знаков в строке a
                        const countB = (b.match(/!/g) || []).length; // Подсчитываем количество восклицательных знаков в строке b
                        return countA - countB;  // Сортируем по возрастанию количества восклицательных знаков
                    });
                    console.log(allTODOs)
                    break;
                case 'user':
                    const nameDict = new Map();
                    const noname = [];
                    for (const TODO of allTODOs){
                        if (TODO.includes(';')){
                            const name = TODO.split(';')[0].split('TODO')[1].trim().toLowerCase();
                            if (!(nameDict.has(name))){
                                nameDict.set(name, []);
                            }
                            nameDict.get(name).push(TODO);
                        }
                        else{
                            noname.push(TODO);
                        }
                    }
                    //console.log(nameDict)
                    for (const user of nameDict.keys()){
                        console.log(nameDict.get(user));
                    }
                    console.log(noname);
                    break;
                case 'date':
                    const dateDict = [];
                    const noDate = [];
                    for (const TODO of allTODOs){
                        if (TODO.includes(';')){
                            const date = new Date(TODO.split(';')[1].trim());
                            dateDict.push([date, TODO]);
                        }
                        else{
                            noDate.push(TODO);
                        }
                    }
                    dateDict.sort((b, a) => {
                        const dateA = new Date(a[0]); // Преобразуем первую дату-строку из массива a в объект Date
                        const dateB = new Date(b[0]); // Преобразуем первую дату-строку из массива b в объект Date
                        return dateA - dateB; // Сортируем массив основываясь на результатах сравнения дат
                    });
                    for (const item of dateDict){
                        console.log(item[1])
                    }
                    console.log(...noDate);
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
// TODO PE; 2018-08-20; lox
