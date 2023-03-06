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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show();
            break;
        case 'important':
            important();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllIndexes(arr, val) {
    let indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) !== -1){
        indexes.push(i);
    }
    return indexes;
}
function show() {
    const filepaths = getAllFilePathsWithExtension(process.cwd(), 'js') || [];
    for (const file of filepaths) {
        const comments = getComments(file);
        if (comments) {
            comments.forEach(function (item, index) {
                console.log(item[0]);})
        }
    }
}
function important() {
    const filepaths = getAllFilePathsWithExtension(process.cwd(), 'js') || [];
    let fullComments = [];
    for (const file of filepaths) {
        const comments = getComments(file);
        if (comments) {
            comments.filter(comment => comment[0].includes('!')).forEach(el => {
                fullComments.push(el);
            });
        }
    }
    let sortedComments = fullComments.sort(function(a, b) {
        return b[1] - a[1];
    });
    sortedComments.forEach(function (item, index) {
        console.log(item[0])})
}

function getComments(file) {
    let content = readFile(file);
    let indexes = getAllIndexes(content, '//' + ' ' + 'TODO', content);
    let comments = [];
    const regex = new RegExp('(?<comment_content>\\/{2} TODO' +
        ' (?<opt>(?<username>.+?); (?<date>.+?);' +
        ' )?(?<comment>.+?)(?<excl_mark>!*))\\r\\n');
    // console.dir(regex.exec(content));
    if (!regex.test(content)) {
        return;
    }
    for (const index of indexes) {
        let { groups } = regex.exec(content.substring(index));
        // console.dir(groups)
        const objects = {
            groups: groups,
            comment_content: groups.comment_content,
            priority: groups.excl_mark.length || 0
        }
        comments.push([objects.comment_content, objects.priority]);
        // console.log(objects.priority)
    }
    return comments;
}

// TODO you can do it!
