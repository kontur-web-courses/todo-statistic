const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

let comments = []

function processCommand(command) {
    let part_command = command.split(' ');
    switch (part_command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const file of files) {
                const lines = file.split('\n');
                for (const line of lines) {
                    if (line.trim().startsWith('// TODO')) {
                        comments.push(line.replace('// TODO', '').trim());
                    }
                }
            }
            console.log(comments);
            break;
        case 'important':
            for (const file of files) {
                const lines = file.split('\n');
                for (const line of lines) {
                    if (line.trim().startsWith('//') &&
                        line.includes('TODO') &&
                        line.includes('!')) {
                        comments.push(line.replace('// TODO', '').trim());
                    }
                }
            }
            console.log(comments);
            break;
        case 'user':
            for (const file of files) {
                const lines = file.split('\n');
                for (const line of lines) {
                    if (line.trim().startsWith('//') &&
                        line.includes('TODO') &&
                        line.includes(part_command[1])) {
                        comments.push(line.replace('// TODO', '').trim());
                    }
                }
            }
            console.log(comments);
            break;
        case 'sort':
            switch (part_command[1]){
                case 'importance':
                    const importantComments = [];
                    const otherComments = [];
                    for (const file of files) {
                        const lines = file.split('\n');
                        for (const line of lines) {
                            if (line.trim().startsWith('//')) {
                                if (line.includes('TODO') && line.includes('!')) {
                                    importantComments.push(line.replace('// TODO', '').trim());
                                } else {
                                    otherComments.push(line.replace('// TODO', '').trim());
                                }
                            }
                        }
                    }
                    importantComments.sort((a, b) => b.split('!').length - a.split('!').length);
                    console.log(importantComments.concat(otherComments));
                    break;
                case 'user':
                    const userComments = {};
                    const unnamedComments = [];
                    for (const file of files) {
                        const lines = file.split('\n');
                        for (const line of lines) {
                            if (line.trim().startsWith('// TODO')) {
                                let comment = line.replace('// TODO', '').trim();
                                let parts_comments = comment.split(';');
                                if (parts_comments.length === 3){
                                    const user = parts_comments[0];
                                    if (!userComments[user]) {
                                        userComments[user] = [];
                                    }
                                    userComments[user].push(comment)
                                } else {
                                    unnamedComments.push(comment)
                                }
                            }
                        }
                    }
                    const sortedUsers = Object.keys(userComments).sort();
                    for (const user of sortedUsers) {
                        console.log(`${user}:`);
                        console.log(userComments[user]);
                    }
                    console.log("Noname:");
                    console.log(unnamedComments);
                    break;
                case 'date':
                    const datedComments = [];
                    const undatedComments = [];
                    for (const file of files) {
                        const lines = file.split('\n');
                        for (const line of lines) {
                            if (line.trim().startsWith('// TODO')) {
                                let comment = line.replace('// TODO', '').trim();
                                let parts_comments = comment.split(';');
                                if (parts_comments.length === 3){
                                    datedComments.push(comment);
                                } else {
                                    undatedComments.push(comment);
                                }
                            }
                        }
                    }
                    datedComments.sort((a, b) => {
                        let dateA = new Date(a.split(';')[1]);
                        let dateB = new Date(b.split(';')[1]);
                        return dateB - dateA;
                    });
                    console.log(datedComments.concat(undatedComments));
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!