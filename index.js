const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const path = require('path');

const files = getFiles();
const allFiles = show(/\/\/\s*TODO.*/gim);
const allCommentsAndFlags = morphComments(allFiles.map(fileObject => fileObject.comments));
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(filePath => {
        return {
            name: path.win32.basename(filePath),
            allStrings: readFile(filePath),
        }
    });
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            display(allCommentsAndFlags);
            break;
        case 'important':
            let rawComments = show(/\/\/\s*TODO.*!$/gim).map(fileObject => fileObject.comments);
            let importantComments = morphComments(rawComments);
            display(importantComments);
            break;
        case command.match(/^user.*$/gi) ? command : null:
            let nameComments = findCommentsByName(command.split(' ')[1]);
            display(nameComments)
            break;
        case command.match(/^sort.*$/gi) ? command : null:
            let sortedComments = sort(command.split(' ')[1]);
            display(sortedComments);
            break;
        case command.match(/^date.*$/gi) ? command : null:
            let sortedByDate = getCommentsByDate(command.split(" ")[1]);
            display(sortedByDate);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

function show (regEx) {
    let filesObject = [];
    for (let file of files) {
        let fileMatch = file.allStrings.match(regEx);
        if (fileMatch !== null) {
            let fileObject = {
                name: file.name,
                comments: fileMatch
            }
            filesObject.push(fileObject)
        }

    }
    return filesObject;
}

function findCommentsByName (name) {
    let allCommentsByName = [];
    let regExp = new RegExp(`\/\/\\s*TODO\\s*${name}.*`, "gi")
    let anonRegExp = /\/\/ TODO.*Anonymous Developer.*/gi;
    let allFilesComments = allCommentsAndFlags.slice();
    for (let commentObject of allFilesComments) {
        let comment = commentObject.text;
        let userComment = comment.match(regExp) ? comment : null;
        if (userComment !== null) {
            let notAnonUserComment = userComment.match(anonRegExp) ? null : userComment;
            if (notAnonUserComment !== null)
                allCommentsByName.push(commentObject);
        }
    }
    return allCommentsByName;
}

function sort (type) {
    let comments = allCommentsAndFlags.slice();
    switch (type) {
        case 'importance':
            comments.sort((a, b) => {
                let firstElement = a.text.match(/!/gi) || [];
                let secondElement = b.text.match(/!/gi) || [];
                return secondElement.length - firstElement.length;
            })
            break;
        case 'user':
            let knownUsers = [];
            let anonComments = [];
            for (let commentObject of comments) {
                let comment = commentObject.text;
                let arr = comment.split("; ");
                if (arr[0].match(/.*Anonymous Developer$/gi) === null && arr.length >= 3)
                    knownUsers.push(commentObject);
                else
                    anonComments.push(commentObject);
            }
            anonComments.map(element => knownUsers.push(element));
            comments = knownUsers;
            break;
        case 'date':
            let regEx = /\d{4}-\d{2}-\d{2}/gi;
            comments.sort((a, b) => {
                let firstElement = new Date(a.text.match(regEx));
                let secondElement = new Date(b.text.match(regEx));
                return secondElement - firstElement;
            })
            break;
    }
    return comments;
}

function morphComments(allCommentsFile) {
    let arr = [];
    for (let commentsOfFile of allCommentsFile) {
        for (let comment of commentsOfFile) {
            let commentObject = {
                text: comment,
                importance: !!comment.match(/!/gi)
            }
            arr.push(commentObject)
        }
    }
    return arr;
}

function getCommentsByDate(date) {
    let requiredDate = new Date(date);
    let sortedComments = sort("date").reverse();
    let result = [];
    for (let commentObject of sortedComments) {
        let comment = commentObject.text;
        let arr = comment.split("; ");
        if (arr.length >= 3) {
            let dateOfComment = new Date(arr[1]);
            if (requiredDate < dateOfComment)
                result.push(commentObject);
        }
    }
    return result;
}

function display(comments) {
    createRow("!".padEnd(3), "user".padEnd(12), "date".padEnd(12), "comment".padEnd(52), "file".padEnd(12))
    createSeparator(3 + 12 + 12 + 52 + 12)
    for (let comment of comments) {
        let str1 = comment.importance ? "!".padEnd(3, " ") : " ".padEnd(3, " ");
        let str2 = undefined;
        let str3 = undefined;
        let str4 = undefined;
        let str5 = undefined;
        for (let file of allFiles) {
            if (file.comments.includes(comment.text))
                str5 = file.name.padEnd(12);
        }
        let end = "..."
        let arr = comment.text.split("; ");
        if (arr.length >= 3) {
            let user = arr[0].replace(/\/\/\sTODO\s*/gi, "");
            str2 = (user.length > 10 ? user.slice(0, 7) + end : user).padEnd(12);
            str3 = (arr[1].length > 10 ? arr[1].slice(0, 7) + end : arr[1]).padEnd(12);
            str4 = (arr[2].length > 50 ? arr[1].slice(0, 47) + end : arr[2]).padEnd(52);
        }
        else {
            str2 = " ".padEnd(12)
            str3 = " ".padEnd(12)
            str4 = arr[0].replace(/\/\/\s*TODO\s*/gi, "").padEnd(52);
        }
        createRow(str1, str2, str3, str4, str5);
    }
}

function createRow(importance, user, date, comment, fileName) {
    console.log(`${importance}|  ${user}|  ${date}|  ${comment}|  ${fileName}`)
}

function createSeparator(length) {
    console.log("-".repeat(length))
}
