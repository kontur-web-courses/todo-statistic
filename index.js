
const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function extractDate(str) {
    const datePattern = /\b\d{4}-\d{2}-\d{2}\b/g; // Паттерн для поиска даты в формате YYYY-MM-DD
    const dateMatch = str.match(datePattern);
    
    if (dateMatch && dateMatch.length > 0) {
        return new Date(dateMatch[0]);
    }
    
    return null;
}


function getUser(comment){
    const pattern = new RegExp("// TODO .*;.*;.*")
    const match = comment.match(pattern);

    if (!match) {
        return null;
    }
    const firstPart = comment.split(';').at(0).split(' ');
    return firstPart.at(2).toUpperCase();
}




function processCommand(command) {
    const regex = /\/\/\s*TODO.*/g;

    const pattern = /^sort\s(\w+)\s/;
    commandSplit = command.split(' ')

    switch (commandSplit.at(0)) {
        case 'show':
            
            for (const file of files){
                const result = String(file).match(regex);
                for (const comment of result){
                    console.log(comment)
                }
                
            }
            break;
        case 'important':
                for (const file of files){
                    const result = String(file).match(regex);
                    for (const comment of result){
                        if (comment.includes('!')){
                            console.log(comment)
                        }
                    }
                }
                break;
        
        case 'user':
                    for (const file of files) {
                        const result = String(file).match(regex);
                        for (const comment of result) {
                     
        
                            if (getUser(comment) === commandSplit.at(1).toUpperCase()) {
                                console.log(comment);
                            }
                        }
                    }
                    break;
        

        case 'sort':
            
            switch (commandSplit.at(1)){
                
                case 'importance':
                    let withoutVoskl = []
                    for (const file of files){
                        const result = String(file).match(regex);
                        for (const comment of result){
                            if (comment.includes('!')){
                                console.log(comment)
                            }
                            else{
                                withoutVoskl.push(comment);
                            }
                        }
                        
                        
                    }
                    for (const comment of withoutVoskl){
                        console.log(comment)
                    }
                    break;
                case 'date':
                    let arr = []
                    for (const file of files){
                        const result = String(file).match(regex);
                        for (const comment of result){
                            arr.push(comment)
                        }
                    }
                    const sortedStrings = arr.sort((b, a) => {
                        const dateA = extractDate(a);
                        const dateB = extractDate(b);
                        
                        if (dateA && dateB) {
                            return dateA - dateB;
                        } else {
                            return 0; 
                        }
                    });
                    for (const comment of arr){
                        console.log(comment)
                    }
                    break;
                case 'user':
                        regex2 = /^\/\/ TODO {[a-zA-Z]+};{.*};{.*}$/;
                        
                        let commentsDict = {};
                        for (const file of files) {
                            const result = String(file).match(regex);
                            for (const comment of result) {
                                const username = getUser(comment)
                                if (!commentsDict[username]) {
                                    commentsDict[username] = [];
                                }
                                
                                commentsDict[getUser(comment)].push(comment)
                            }
                        }
                        console.log(commentsDict)
                        
                
            }
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
