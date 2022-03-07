const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const COMMENT_REGEX = /.*(\/\/ TODO ((?<name>.*?); (?<date>.*?); )?(?<comment>.*))/;

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
	const commandSplitted = command.split(' ');
	let comments = [];
    switch (commandSplitted[0]) {
		case 'show':
			files.forEach(x => getComment(x).forEach(y => comments.push(y)));
			comments.forEach(x => console.log(x[1]));
			break;
		case 'important':
			files.forEach(x => getComment(x, true).forEach(y => comments.push(y)));
			comments.forEach(x => console.log(x[1]));
			break;
		case 'user':
			files.forEach(x => getComment(x, false, commandSplitted[1]).forEach(y => comments.push(y)));
			comments.forEach(x => console.log(x[1]));
			break;
		case 'sort':
			files.forEach(x => getComment(x).forEach(y => comments.push(y)));
		
			switch (commandSplitted[1]) {
				case 'user':
					comments.sort((x, y) => compareStrings(x.groups.name, y.groups.name));
					break;
				case 'importance':
					comments = comments.filter(x => x.groups.comment !== undefined);
					comments.sort((x, y) => getImportance(y.groups.comment) - getImportance(x.groups.comment));
					break;
				case 'date':
					comments.sort((x, y) => Date.parse(y.groups.date) - Date.parse(x.groups.date));
					break;
				default:
				    console.log('wrong sort order');
					break;
			}
		
			comments.forEach(x => console.log(x[1]));
			break;
		case 'date':
			const date = parseDate(commandSplitted[1]);
			files.forEach(x => getComment(x, false, undefined, date).forEach(y => comments.push(y)));
            comments.forEach(x => console.log(x[1]));
			break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
    }
}

function getComment(file, isImportant = false, name = undefined, date = undefined) {
	let comments = file.split(/\r?\n/).map(x => x.match(COMMENT_REGEX)).filter(x => x);
	
	if (isImportant){
		comments = comments.filter(x => x.groups.comment.includes('!'));
	}
	
	if (name !== undefined){
		comments = comments.filter(x => x.groups.name !== undefined && x.groups.name.toLowerCase() === name);
	}
	
	if (date !== undefined){
		comments = comments.filter(x => date <= Date.parse(x.groups.date));
	}
	
	return comments;
}

function compareStrings(a, b) {
	if (b === undefined) {
		return a === undefined ? 0 : -1;
	}
	
	if (a === undefined) {
		return 1;
	}
	
	const x = a.toLowerCase();
	const y = b.toLowerCase();
	
	if (x > y) {
		return 1;
	}
	if (x < y) {
		return -1;
	}
	return 0;
}

function getImportance(s) {
	return s === undefined ? 0 : (s.split('!').length - 1);
}

function parseDate(s) {
	const numbers = s.split('-');
	return new Date(numbers[0], numbers[1] || 0, numbers[2] || 1);
}

// TODO you can do it!
// TODO МИХЕЙ КРУТОЙ!!!!!!!!!!!
