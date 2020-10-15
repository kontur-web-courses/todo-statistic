const maxWidth = [5, 14, 14, 54]
let width = [0, 0, 0, 0]
let indent = 2

function show (comments) {
    setWidthArray(comments)
    showHeader()
    drawLine()
    comments.forEach((comment) => console.log(format(comment)))
    drawLine()
}

function showHeader (titles) {
    let header = [ getContentFit('!', 0),
                   getContentFit('user', 1),
                   getContentFit('date', 2),
                   getContentFit('comment', 3) ]
    console.log(header.join('|'));
}

function format (comment) {
    let [importance, userName, date, content] = separateContent(comment)
    let res = [ getContentFit(importance, 0),
                getContentFit(userName, 1),
                getContentFit(date, 2),
                getContentFit(content, 3) ]
    return res.join('|');
}

function separateContent (comment) {
    let importance = isImportant(comment) ? '!' : '';
    let commentArray = comment.replace(/\/\/.*TODO |\/\/.*TODO.*: *|!/gi, '').split(';')
    let userName = commentArray[0]
    let date = commentArray[1] ? commentArray[1].substr(1) : ''
    let content = commentArray[2] ? commentArray[2].substr(1) : ''
    return [importance, userName, date, content]
}

function getContentFit(phrase, colNumber){
    if (phrase === undefined) return ' '.repeat(width[colNumber]);
    if (phrase.length + 4 > width[colNumber])
        return (' '.repeat(indent) + phrase.substr(0, width[colNumber] - 7) + '...' + ' '.repeat(indent))
    return (' '.repeat(indent) + phrase).padEnd(width[colNumber])
}

function isImportant (str) {
    return str.includes('!');
}

function setWidthArray (comments) {
    for (let comment of comments) {
        let [importance, userName, date, content] = separateContent(comment)
        if (importance && importance.length > width[0] && importance.length <= maxWidth[0])
            width[0] = importance.length + indent * 2
        if (userName && userName.length > width[1] && userName.length <= maxWidth[1])
            width[1] = userName.length + indent * 2
        if (date && date.length > width[2] && date.length <= maxWidth[2])
            width[2] = date.length + indent * 2
        if (content && content.length > width[3] && content.length <= maxWidth[3])
            width[3] = content.length + indent * 2
    }
}

function drawLine() {
    console.log('-'.repeat(width[0] + width[1] + width[2] + width[3] + 1))
}

module.exports = {
    show
};


//ToDo: digi; 2016-04-08; добавить writeLine!!!