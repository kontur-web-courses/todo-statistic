const {getComments} = require('./getComments');

let sortType = ''

function sort (files, type) {
    sortType = type
    let comments = getComments(files)
    let result = comments.sort(function (a, b) {
        switch (sortType) {
            case 'importance':
                return sortImportance(a,b);
                break;

            case 'user':
                return sortUser(a,b);
                break;

            case 'date':
                return sortDate(a,b);
                break;

            default :
                return 0;
        }});
    return result;
}

function sortImportance(a, b) {
    function getRepeatCount (str) {
        return str.replace(/[^\!]/g, '').length;
    }
    a = getRepeatCount(a)
    b = getRepeatCount(b)
    return (a > b) ? -1 : 1;
}

function sortUser(a, b) {
    a = a.replace(/\/\/.*TODO |\/\/.*TODO.*: */gi, '').split(';')[0].toLowerCase()
    b = b.replace(/\/\/.*TODO |\/\/.*TODO.*: */gi, '').split(';')[0].toLowerCase()
    return (a > b) ? 1 : -1;
}

function sortDate(a, b) {
    if (a.split(';').length < 2 || b.split(';').length < 2) return 0;
    a = a.replace(/\/\/.*TODO |\/\/.*TODO.*: */gi, '').split(';')[1].split('-')
    b = b.replace(/\/\/.*TODO |\/\/.*TODO.*: */gi, '').split(';')[1].split('-')
    a = new Date (a[0] , a[1], a[2]);
    b = new Date (b[0] , b[1], b[2]);
    return (a > b) ? -1 : 1;
}

module.exports = {
    sort
};