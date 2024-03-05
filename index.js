
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
    const regex = /\/\/\s*TODO.*/g;
    const regex1 = /^TODO ([^;]+); ([^;]+); ([\s\S]*)$/;
    const pattern = /^sort\s(\w+)\s:\sвыводит отсортированные todo$/;
    switch (command) {
        case 'show : показать все todo':
            
            for (const file of files){
                const result = String(file).match(regex);
                for (const comment of result){
                    console.log(comment)
                }
                
            }
        case 'important : показывать только todo, в которых есть восклицательный знак':
                for (const file of files){
                    const result = String(file).match(regex);
                    for (const comment of result){
                        if (comment.includes('!')){
                            console.log(comment)
                        }
                    }
                }
        
        case command.match(pattern) ? command: true:
            switch (command.match(pattern)[1]){
                case 'importance':
                    console.log(1)
                case 'user':
                    console.log(2)
                case 'date':
                    console.log(3)
            }
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
