const {getComments} = require('./getComments');

function user (files, name) {
    name = name.toLowerCase();
    let comments = getComments(files);
    let result = []
    comments.forEach((comment) => {
        let nameInComment = comment.replace('// TODO ', '').split(';')[0].toLowerCase()
        if (nameInComment === name)
            result.push(comment)
    })
    return result;
}

module.exports = {
    user
};