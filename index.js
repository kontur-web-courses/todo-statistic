const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
	const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js')
	return filePaths.map(path => readFile(path))
}

function processCommand(command) {
    let parameter = '';
    if (command.includes(' ')){
        let splitCommand = command.split(' ')
		command = splitCommand[0];
        parameter = splitCommand[1];
    }
    switch (command) {
			case 'exit':
				process.exit(0)
				break
			case 'show':
				{
					let comments = getComments()
					for (let comment of comments) {
						console.log(comment)
					}
				}
				break
			case 'important':
				getImportantComments()
				break
			case 'user':
				getCommentUser(parameter)
				break
			case 'sort':
				getSortedComments(parameter)
				break
			case 'date':
                getDateAfter(parameter);
                break
            case 'printTable':
                printCommentsTable();
                break
			default:
				console.log('wrong command')
				break
		}
}

function getComments(){
    let comments = [];
    for (let file of files) {
        const fileLines = file.split('\r\n');
        
        for (let line of fileLines){
            let regexFind = line.match(/\/\/ TODO .*/g);
            if (regexFind){
                comments.push(regexFind[0]);
            }
        }
	}
    return comments;
}

function getImportantComments(){
    for (let file of files) {
		const fileLines = file.split('\r\n')
		for (let line of fileLines) {
            let regexFind = line.match(/\/\/ TODO .*/g)
			if (regexFind && regexFind[0].includes('!')) {
				console.log(regexFind[0])
			}
		}
	}
}

function getCommentUser(username){
    for (let file of files) {
		const fileLines = file.split('\r\n');
		for (let line of fileLines) {
            if (line.includes('// TODO')){
                let regexFind = line.match(/\/\/ TODO .*/g)
				if (regexFind && regexFind[0].split(' ')[2].split(';')[0].toLowerCase() == username) {
					console.log(regexFind[0]);
				}
			}
		}
	}
}

function getSortedComments(parameter){
    switch (parameter){
        case 'importance':
            {
            let arraw = importedSort();
            for (let comment of arraw){
                console.log(comment);
            }
        }
            break;
        case 'user':
            {
            let arraw = userSort();
            for (let comment of arraw){
                console.log(comment);
            } 
        }
        break;
        case 'date':
        {
            let arraw = dataSort();
            for (let comment of arraw){
                console.log(comment);
            } 
        }
    }

}

function importedSort(){
    return getComments().sort((a, b) => {
        const countA = getCountSign(a)
        const countB = getCountSign(b)
    
        if (countA > countB) {
            return -1;
        } else if (countA < countB) {
            return 1;
        } else {
            return 0;
        }
    });
}

function getCountSign(comment){
    let count = 0;
    for (let item of comment){
        if (item === '!'){
            count++;
        }
    }
    return count;
}

function userSort(){
    return getComments().sort((a, b) => {
			const aUser = getUsername(a);
			const bUser = getUsername(b);
            return aUser.localeCompare(bUser);
		});
}

function getUsername(line){
    let regexFind = line.match(/\/\/ TODO .*/g);
    return regexFind[0].split(' ')[2].split(';')[0].toLowerCase();
}

function getDate(line){
    let regexFind = line.match(/\/\/ TODO .*/g);
    if (regexFind){
        return regexFind[0].split(';')[1]
    }
    return '3000-01-01'
}

function getText(line){
    let regexFind = line.match(/\/\/ TODO .*/g);
    return regexFind[0].split(';')[2];
}

function dataSort(){
    return getComments().sort((a, b) => {
			const aData = new Date(getDate(a));
			const bData = new Date(getDate(b))
            if (aData < bData){
                return -1;
            }
            else if (aData > bData){
                return 1;
            }
            else{
                return 0;
            }
		});
}

function getDateAfter(parameter){
    let comments = getComments();
    for (let comment of comments){
        if (new Date(getDate(comment)) > new Date(parameter)){
            console.log(comment);
        }
    }
}

function printCommentsTable(){
    let comments = getComments();
    for (let comment of comments){
        let importanse = ' ';
        if (comment.includes('!')){
            importanse = '!';
        }
        console.log(`${importanse.padEnd(1)} | ${getUsername(comment).padEnd(10)} | ${getDate(comment).padEnd(10)} | ${getText(comment).padEnd()}`)
    }
}