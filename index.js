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
    let param = command.split(/\s+/g)[1];
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
            
        case 'show':
            show(getFiles());
            break;
        
        case 'important':
            important(getFiles());
            break;
        
        case 'user ' + param:
            user(getFiles(), param);
            break;

        case 'sort importance':
            sortImportance(getFiles());
            break;

        case 'sort user':
            sortUser(getFiles());
            break;

        case 'sort date':
            sortDate(getFiles(), param);
            break;
        
        case 'date ' + param:
            showDate(getFiles(), param);
            break;

        default:
            console.log('wrong command');
            break;
    }
}

function show (files) {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    const todoArray = files.map(file =>  file.split('\n'))
    let result = []
    let regEx = /\/\/ TODO.*/gi 
        for (let item of todoArray){
            for (let str of item){
                if (str.match(regEx)){
                    result.push(str
                        .slice(str.indexOf('//')))
                }
            }
        }

    let res=[];
    let name=' ';
    let date=' ';
    let comment=' ';
    let imp = ' ';
    let maxWidthName=10;
    let maxWidthComment=50;
    for(let i=0;i<result.length;i++){
        result[i].match(/ *!$/gim) ? imp = '!' : imp = ' '
        let tableResult=result[i].replace('//'+' TODO','').split(';');
        if(tableResult.length<2){
            comment=String(tableResult).replace(/\!/gim, '');
            res.push(`  ${imp}  | ${" ".repeat(10)}   | ${" ".repeat(10)}   | ${comment}`)
        }
        else{
        for(let j=0;j<tableResult.length;j++){
                if(tableResult[0]===undefined){name=''}else{name=tableResult[0];}
                if(tableResult[1]===undefined){date=''}else{date=tableResult[1];}
                if(tableResult[2]===undefined){comment=''}else{comment=String(tableResult[2]).replace(/\!/gim, '');}
                
                if(tableResult[0].length>maxWidthName){
                    maxWidthName=tableResult[0].length;
                }
                if(tableResult[2].length>maxWidthComment){
                    maxWidthComment=tableResult[2].length;
                }
                
                var resultName = ''
                name.length > 10 ? resultName = name.slice(0, 7) + '...'
                                 : resultName = name + " ".repeat(10-name.length)
                
                var resultComment = ''
                comment.length > 50 ? resultComment = comment.slice(0, 47) + '...'
                                    : resultComment = comment
        }
        res.push(`  ${imp}  | ${resultName}   | ${date}  | ${resultComment}`);
    }
}
    console.log('  !  | user         |  date        | comment    ');
    console.log('-'.repeat(74));

for(let el=0; el < res.length; el++){
        console.log(res[el]);
    }
    console.log('-'.repeat(74));
}


function important (files) {
    const todoArray = files.map(file =>  file.split('\n'))
    let result = []
    let regEx = /\/\/ TODO.*!$/gim
        for (let item of todoArray){
            for (let str of item){
                if (str.match(regEx)){
                    result.push(str
                        .slice(str.indexOf('//')))
                }
            }
        }
        
        let res=[];
        let name=' ';
        let date=' ';
        let comment=' ';
        let imp = ' ';
        let maxWidthName=10;
        let maxWidthComment=50;
        for(let i=0;i<result.length;i++){
            result[i].match(/ *!$/gim) ? imp = '!' : imp = ' '
            let tableResult=result[i].replace('//'+' TODO','').split(';');
            if(tableResult.length<2){
                comment=String(tableResult).replace(/\!/gim, '');
                res.push(`  ${imp}  | ${" ".repeat(10)}   | ${" ".repeat(10)}   | ${comment}`)
            }
            else{
            for(let j=0;j<tableResult.length;j++){
                    if(tableResult[0]===undefined){name=''}else{name=tableResult[0];}
                    if(tableResult[1]===undefined){date=''}else{date=tableResult[1];}
                    if(tableResult[2]===undefined){comment=''}else{comment=String(tableResult[2]).replace(/\!/gim, '');}
                    
                    if(tableResult[0].length>maxWidthName){
                        maxWidthName=tableResult[0].length;
                    }
                    if(tableResult[2].length>maxWidthComment){
                        maxWidthComment=tableResult[2].length;
                    }
                    
                    var resultName = ''
                    name.length > 10 ? resultName = name.slice(0, 7) + '...'
                                     : resultName = name + " ".repeat(10-name.length)
                    
                    var resultComment = ''
                    comment.length > 50 ? resultComment = comment.slice(0, 47) + '...'
                                        : resultComment = comment
            }
            res.push(`  ${imp}  | ${resultName}   | ${date}  | ${resultComment}`);
        }
    }
    console.log('  !  | user         |  date        | comment    ');
    console.log('-'.repeat(74));
    for(let el=0; el < res.length; el++){
        console.log(res[el]);
    }
        console.log('-'.repeat(74));
}

function user (files, param) {
    const todoArray = files.map(file =>  file.split('\n'))
    let result = []
    nameUser = String(param).toLowerCase();
    let regEx = 'todo ' + nameUser + ';';
        for (let item of todoArray){
            for (let str of item){
                if (str.toLowerCase().match(regEx)){
                    result.push(str
                        .slice(str.indexOf('//')))
                }
            }
        }
    if (!result.length) result.push('UserNotFound')
    let res=[];
    let name=' ';
    let date=' ';
    let comment=' ';
    let imp = ' ';
    let maxWidthName=10;
    let maxWidthComment=50;
    for(let i=0;i<result.length;i++){
        result[i].match(/ *!$/gim) ? imp = '!' : imp = ' '
        let tableResult=result[i].replace('//'+' TODO','').split(';');
        if(tableResult.length<2){
            comment=String(tableResult).replace(/\!/gim, '');
            res.push(`  ${imp}  | ${" ".repeat(10)}   | ${" ".repeat(10)}   | ${comment}`)
        }
        else{
        for(let j=0;j<tableResult.length;j++){
                if(tableResult[0]===undefined){name=''}else{name=tableResult[0];}
                if(tableResult[1]===undefined){date=''}else{date=tableResult[1];}
                if(tableResult[2]===undefined){comment=''}else{comment=String(tableResult[2]).replace(/\!/gim, '');}
                
                if(tableResult[0].length>maxWidthName){
                    maxWidthName=tableResult[0].length;
                }
                if(tableResult[2].length>maxWidthComment){
                    maxWidthComment=tableResult[2].length;
                }
                
                var resultName = ''
                name.length > 10 ? resultName = name.slice(0, 7) + '...'
                                 : resultName = name + " ".repeat(10-name.length)
                
                var resultComment = ''
                comment.length > 50 ? resultComment = comment.slice(0, 47) + '...'
                                    : resultComment = comment
        }
        res.push(`  ${imp}  | ${resultName}   | ${date}  | ${resultComment}`);
    }
}
    
console.log('  !  | user         |  date        | comment    ');
console.log('-'.repeat(74));
for(let el=0; el < res.length; el++){
    console.log(res[el]);
}
console.log('-'.repeat(74));
}


function sortUser (files) {
    const todoArray = files.map(file =>  file.split('\n'))
    let result = []
    let regEx = /\/\/ TODO.*$/gim
    for (let item of todoArray){
        for (let str of item){
            if (str.match(regEx)){
                result.push(str
                    .slice(str.indexOf('//')))
            }
        }
    }

    let important = []
    let other = []
    for (let item of result){
        if (item.includes(';')){ 
            important.push(item)
        }
        else other.push(item)
    }
    important.sort(function(a, b){
        a = a.toLowerCase().slice(8,)
        b = b.toLowerCase().slice(8,)
        if (a < b) return -1
        if (a > b) return 1
        return 0
    })
    result = important.concat(other)
    let res=[];
    let name=' ';
    let date=' ';
    let comment=' ';
    let imp = ' ';
    let maxWidthName=10;
    let maxWidthComment=50;
    for(let i=0;i<result.length;i++){
        result[i].match(/ *!$/gim) ? imp = '!' : imp = ' '
        let tableResult=result[i].replace('//'+' TODO','').split(';');
        if(tableResult.length<2){
            comment=String(tableResult).replace(/\!/gim, '');
            res.push(`  ${imp}  | ${" ".repeat(10)}   | ${" ".repeat(10)}   | ${comment}`)
        }
        else{
        for(let j=0;j<tableResult.length;j++){
                if(tableResult[0]===undefined){name=''}else{name=tableResult[0];}
                if(tableResult[1]===undefined){date=''}else{date=tableResult[1];}
                if(tableResult[2]===undefined){comment=''}else{comment=String(tableResult[2]).replace(/\!/gim, '');}
                
                if(tableResult[0].length>maxWidthName){
                    maxWidthName=tableResult[0].length;
                }
                if(tableResult[2].length>maxWidthComment){
                    maxWidthComment=tableResult[2].length;
                }
                
                var resultName = ''
                name.length > 10 ? resultName = name.slice(0, 7) + '...'
                                 : resultName = name + " ".repeat(10-name.length)
                
                var resultComment = ''
                comment.length > 50 ? resultComment = comment.slice(0, 47) + '...'
                                    : resultComment = comment
        }
        res.push(`  ${imp}  | ${resultName}   | ${date}  | ${resultComment}`);
    }
}
    
console.log('  !  | user         |  date        | comment    ');
console.log('-'.repeat(74));
for(let el=0; el < res.length; el++){
    console.log(res[el]);
}
console.log('-'.repeat(74));
}

function sortImportance (files) {
    const todoArray = files.map(file =>  file.split('\n'))
    let result = []
    let regEx = /\/\/ TODO.*$/gim
    for (let item of todoArray){
        for (let str of item){
            if (str.match(regEx)){
                result.push(str
                    .slice(str.indexOf('//')))
            }
        }
    }

    let important = []
    let other = []
    let excl = / *!$/gim
    for (let item of result){
        if (item.match(excl)) important.push(item)
        else other.push(item)
    }
    important.sort((a, b) => (b.split('!').length - a.split('!').length))
    result = important.concat(other)
    let res=[];
    let name=' ';
    let date=' ';
    let comment=' ';
    let imp = ' ';
    let maxWidthName=10;
    let maxWidthComment=50;
    for(let i=0;i<result.length;i++){
        result[i].match(/ *!$/gim) ? imp = '!' : imp = ' '
        let tableResult=result[i].replace('//'+' TODO','').split(';');
        if(tableResult.length<2){
            comment=String(tableResult).replace(/\!/gim, '');
            res.push(`  ${imp}  | ${" ".repeat(10)}   | ${" ".repeat(10)}   | ${comment}`)
        }
        else{
        for(let j=0;j<tableResult.length;j++){
                if(tableResult[0]===undefined){name=''}else{name=tableResult[0];}
                if(tableResult[1]===undefined){date=''}else{date=tableResult[1];}
                if(tableResult[2]===undefined){comment=''}else{comment=String(tableResult[2]).replace(/\!/gim, '');}
                
                if(tableResult[0].length>maxWidthName){
                    maxWidthName=tableResult[0].length;
                }
                if(tableResult[2].length>maxWidthComment){
                    maxWidthComment=tableResult[2].length;
                }
                
                var resultName = ''
                name.length > 10 ? resultName = name.slice(0, 7) + '...'
                                 : resultName = name + " ".repeat(10-name.length)
                
                var resultComment = ''
                comment.length > 50 ? resultComment = comment.slice(0, 47) + '...'
                                    : resultComment = comment
        }
        res.push(`  ${imp}  | ${resultName}   | ${date}  | ${resultComment}`);
    }
}
    
console.log('  !  | user         |  date        | comment    ');
console.log('-'.repeat(74));
for(let el=0; el < res.length; el++){
    console.log(res[el]);
}
console.log('-'.repeat(74));
}

function sortDate (files) {
    const todoArray = files.map(file =>  file.split('\n'))
    let result = []
    let year = /\d\d\d\d.*;/im;
    let dayAndMonth = /\d/gim;
    let regEx = /\/\/ TODO.*$/gim;
        for (let item of todoArray){
            for (let str of item){
                if (str.match(regEx)){
                    result.push(str
                        .slice(str.indexOf('//')))
                }
            }
        }
    let important = []
    let other = []
    for (let item of result){
        if (item.match(year)) important.push(item)
        else other.push(item)
    }
    important.sort(function(a, b){
        a = a.match(dayAndMonth).join('')
        b = b.match(dayAndMonth).join('')
        return b - a
    })
    result = important.concat(other)
    let res=[];
    let name=' ';
    let date=' ';
    let comment=' ';
    let imp = ' ';
    let maxWidthName=10;
    let maxWidthComment=50;
    for(let i=0;i<result.length;i++){
        result[i].match(/ *!$/gim) ? imp = '!' : imp = ' '
        let tableResult=result[i].replace('//'+' TODO','').split(';');
        if(tableResult.length<2){
            comment=String(tableResult).replace(/\!/gim, '');
            res.push(`  ${imp}  | ${" ".repeat(10)}   | ${" ".repeat(10)}   | ${comment}`)
        }
        else{
        for(let j=0;j<tableResult.length;j++){
                if(tableResult[0]===undefined){name=''}else{name=tableResult[0];}
                if(tableResult[1]===undefined){date=''}else{date=tableResult[1];}
                if(tableResult[2]===undefined){comment=''}else{comment=String(tableResult[2]).replace(/\!/gim, '');}
                
                if(tableResult[0].length>maxWidthName){
                    maxWidthName=tableResult[0].length;
                }
                if(tableResult[2].length>maxWidthComment){
                    maxWidthComment=tableResult[2].length;
                }
                
                var resultName = ''
                name.length > 10 ? resultName = name.slice(0, 7) + '...'
                                 : resultName = name + " ".repeat(10-name.length)
                
                var resultComment = ''
                comment.length > 50 ? resultComment = comment.slice(0, 47) + '...'
                                    : resultComment = comment
        }
        res.push(`  ${imp}  | ${resultName}   | ${date}  | ${resultComment}`);
    }
}
    
console.log('  !  | user         |  date        | comment    ');
console.log('-'.repeat(74));
for(let el=0; el < res.length; el++){
    console.log(res[el]);
}
console.log('-'.repeat(74));
}

function showDate (files, param) {
    const todoArray = files.map(file =>  file.split('\n'))
    let result = []
    inputDate = String(param);
    let regEx = new RegExp('\/\/ TODO.*'+inputDate,'gi');
        for (let item of todoArray){
            for (let str of item){
                if (str.match(regEx)){
                    result.push(str
                        .slice(str.indexOf('//')))
                }
            }
        }
    if (!result.length) result.push('DateNotFound')
    
    let res=[];
    let name=' ';
    let date=' ';
    let comment=' ';
    let imp = ' ';
    let maxWidthName=10;
    let maxWidthComment=50;
    for(let i=0;i<result.length;i++){
        result[i].match(/ *!$/gim) ? imp = '!' : imp = ' '
        let tableResult=result[i].replace('//'+' TODO','').split(';');
        if(tableResult.length<2){
            comment=String(tableResult).replace(/\!/gim, '');
            res.push(`  ${imp}  | ${" ".repeat(10)}   | ${" ".repeat(10)}   | ${comment}`)
        }
        else{
        for(let j=0;j<tableResult.length;j++){
                if(tableResult[0]===undefined){name=''}else{name=tableResult[0];}
                if(tableResult[1]===undefined){date=''}else{date=tableResult[1];}
                if(tableResult[2]===undefined){comment=''}else{comment=String(tableResult[2]).replace(/\!/gim, '');}
                
                if(tableResult[0].length>maxWidthName){
                    maxWidthName=tableResult[0].length;
                }
                if(tableResult[2].length>maxWidthComment){
                    maxWidthComment=tableResult[2].length;
                }
                
                var resultName = ''
                name.length > 10 ? resultName = name.slice(0, 7) + '...'
                                 : resultName = name + " ".repeat(10-name.length)
                
                var resultComment = ''
                comment.length > 50 ? resultComment = comment.slice(0, 47) + '...'
                                    : resultComment = comment
        }
        res.push(`  ${imp}  | ${resultName}   | ${date}  | ${resultComment}`);
    }
}
    
console.log('  !  | user         |  date        | comment    ');
console.log('-'.repeat(74));
for(let el=0; el < res.length; el++){
    console.log(res[el]);
}
console.log('-'.repeat(74));
}

// TODO you can do it!
