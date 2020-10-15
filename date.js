const {getComments} = require('./getComments');

function date (files, startDate) {
    startDate = new Date(startDate.split('-'))
    let comments = getComments(files);
    let filteredArray = comments.filter((comment) => {
        let commentArray = comment.split(';');
        if (commentArray.length < 2) return false;
        let dateCompare = new Date(commentArray[1].replace(' ', '').split('-'))
        return dateCompare > startDate;
    });
    return filteredArray;
}

module.exports = {
    date
};