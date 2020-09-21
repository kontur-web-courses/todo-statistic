const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
function searchTODO()
{
    let arr = [];
    files.forEach(file => { 
        let pos = 0;
        while(file.indexOf('// TODO', pos) != -1){
            let r = file.indexOf('// TODO',pos);
            let t = file.indexOf('\n', r);
            pos = r+1;
            arr.push(file.slice(r, t));
        }
    });
    return arr;
}
function getCount(str)
{
    let i=0;
    for(let s of str)
    {
        if(s==='!') i++;
    }
    return i;
}
function processCommand(command) {
    let name = command.split(' ')[1];
    let arr = searchTODO();
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':{
            searchTODO().forEach(e => console.log(e));
            break;
        }
        case 'important':
            let impotant = arr.filter(e => e.includes('!'));  
            impotant.forEach(e => console.log(e)); 
            break;
        case `user ${name}`:
            user=arr.filter(e => e.startsWith(`// TODO ${name}`));
            user.forEach(e => console.log(e));
            break;
        // case 'sort importance':{
        //     let sortArr = arr.sort((a, b) => {
        //         if(a.includes('!')){
        //             if(b.includes('!')){
        //                 return getCount(b) - getCount(a)
        //             }
        //             return 1;
        //         }
        //         return b.includes('!')
        //     });

       // }

            break;
        case 'sort user':

            
            break;
        case 'sort  date ':
            break;               

        default:
              console.log('wrong command');
            break;
    }
}

// TODO you can do it!
