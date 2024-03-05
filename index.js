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
    switch (true) {
        case command === 'exit':
            process.exit(0);
            break;
        case command === 'show':
            show();
            break;
        case command === 'important':
            important();
            break;
        case (command.startsWith("user")):
            let name = command.split(" ")[1];
            user(name);
            break;
        case (command.startsWith("sort")):
            let key = command.split(" ")[1];
            sort(key);
            break;
        case (command.startsWith("date")):
            let dateSrt = command.split(" ")[1];
            date(dateSrt);
            break
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

let todos = takeTODOSfromAllFiles(files);
let classified = classifyTODOs();
// console.log(classified);
// console.log(classified.important);
// TODO Digi; 2018-09-22; Добавить функ2
// TODO Digi; 2018-09-23; Добавить функ3
// TODO Digi; 2018-09-25; Добавить функ4
// console.log(compareDates("2018-09-25", "2018-09-23"));
function takeAllTODOs(file) {
    matches = file.matchAll(/\/\/ TODO ([^\n]*)/g);
    res = []
    for (m of matches) {
        res.push(m[1]);
    }
    return res;
}

function takeTODOSfromAllFiles(files) {
    let todos = [];
    let todosFromFile;
    for (let file of files) {
        todosFromFile = takeAllTODOs(file);
        todos.push(todosFromFile);
    }
    return todos;
}

function show() {
    showCommentsTable(classified.pile);
    // for (let commentsFromFile of todos) {
    //     for (let comment of commentsFromFile) {
    //         console.log(comment);
    //     }
    // }
}


function important() {
    let comments = classified.pile.filter(val => val.imp);
    showCommentsTable(comments);
}

function sort(key) {
    let all = todos.flat();

    if (key == "importance") {
        let imp = classified.pile.filter(com => com.imp)
        let rest = classified.pile.filter(com => !com.imp)
        showCommentsTable(imp);
        showCommentsTable(rest);
    }

    if (key == "user") {
        for(let user of Object.keys(classified.named)) {
            let userComments = classified.pile.filter(com => com.name == user)
            showCommentsTable(userComments);
        }
        let unnamed = classified.pile.filter(com => com.name == "")
        showCommentsTable(unnamed);
    }

    if (key == "date") {
        let dated = classified.pile.filter(com => com.date  != "");
        let dateSorted = dated.sort(compareDatesComs);
        showCommentsTable(dateSorted);

        showCommentsTable(classified.pile.filter(com => com.date  == ""));
    }
}

function user(username) {
    var comments = classified.pile.filter(com => com.name == username);
    showCommentsTable(comments);
}


function date(dateStr) {
    let dated = classified.pile.filter(com => com.date  != "");
    let dateSorted = dated.sort(compareDatesComs);
    let after = dateSorted.filter(val => {
        let comp = compareDates(currentDate, val);
        return comp ==  -1 || comp == 0;
    });
    showCommentsTable(after);


    // let sortedDates = Object.keys(classified.withDate).sort(compareDates);
    // let currentDate = new Date(dateStr);

    // let datesAfter = sortedDates.filter(val => {
    //     let comp = compareDates(currentDate, val);
    //     return comp ==  -1 || comp == 0;
    // });
    // for (let date of datesAfter) {
    //     showComments(classified.withDate[date].flat());
    // }
}

function compareDatesComs(c1, c2) {
    let date1 = new Date(c1.date).getTime();
    let date2 = new Date(c2.date).getTime();
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
}

function compareDates(dateStr1, dateStr2) {
    let date1 = new Date(dateStr1).getTime();
    let date2 = new Date(dateStr2).getTime();
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
}

function showCommentsTable(comments) {
    let rows = [];
    for (let comment of comments) {
        let rowParts = [];
        if (comment.imp) {
            rowParts.push("  !");
        } else {
            rowParts.push("   ");
        }
        let name = comment.name;

        if (name.length > 10 - 3) {
            name = name.substr(0, 10 - 3) + "...";
        }
        else {
            name = name.padEnd(10, " ")
        }
        rowParts.push(name);

        rowParts.push(comment.date.padEnd(10, " "));
        let text = comment.text;
        if (text.length > 50) {
            text = text.substr(0, 50) + "...";
        }
        rowParts.push(text);
        // rowParts.push(comment.text.padEnd(50, " "));
        let row = rowParts.join("  |  ");
        rows.push(row);
    }

    for(let row of rows){
        console.log(row);
    }
}

function showCommentsTable1(comments) {
    for (let comment of comments) {
        let imp = classified.important.includes(comment);
        let haveDate = classified.datesOfComments.includes(comment);
    }
}

function classifyTODOs() {
    let classified = {
        important: [],
        named: {

        },
        withDate: {

        },
        unnamed: [],
        datesOfComments: {

        },
        pile: []
    }
    let reg = /([^;]*);\s?(\d{4}-\d{2}-\d{2});\s?([^\n]*)/;

    for (let comment of todos.flat()) {
        let imp = false;
        if (comment.indexOf('!') != -1) {
            classified.important.push(comment);
            imp = true;
        }

        let match = comment.match(reg);
        if (match) {
            let name = match[1]
            let dateStr = match[2];
            let date = new Date(dateStr);
            let text = match[3];
            if (!(name in classified.named)) {
                classified.named[name] = [];
            }
            classified.named[name].push(text);

            if (!(dateStr in classified.withDate)) {
                classified.withDate[dateStr] = [];
            }
            classified.withDate[dateStr].push(text);

            // datesOfComments[text] = dateStr;

            classified.pile.push(
                {
                    name: name,
                    date: dateStr,
                    text: text,
                    imp: imp
                }
            );
        } else {
            classified.unnamed.push(comment);
            classified.pile.push(
                {
                    name: "",
                    date: "",
                    text: comment,
                    imp: imp
                }
            );
        }
    }

    return classified;
}