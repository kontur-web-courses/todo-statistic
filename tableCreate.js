function tableCreate(todoArray) {
    let arrayStringSplit = []
    for (const todoString of todoArray) {
        arrayStringSplit.push(todoString.split(';'))
    }
    let maxLengthName = 0;
    let maxLengthMassage = 0;
    let maxLengthDate = 0;
    let maxPath = 0;
    for (const stringArray of arrayStringSplit) {
        if (stringArray[0].length - 8 >= maxLengthName)
            maxLengthName = stringArray[0].length - 8;
        if (stringArray[1].length > maxLengthDate)
            maxLengthDate = stringArray[1].trim().length;
        if (stringArray[2].length >= maxLengthMassage)
            maxLengthMassage = stringArray[2].trim().length;
        if (stringArray[3].length > maxPath)
            maxPath = stringArray[3].length;
        if (maxLengthName > 10) maxLengthName = 10;
        if (maxLengthName < 4) maxLengthName = 4;
        if (maxLengthMassage > 50) maxLengthMassage = 50;
        if (maxLengthMassage < 7) maxLengthMassage = 7;

    }
    let tablecolomn = '  !  |  ';
    tablecolomn += 'user'.padEnd(maxLengthName, ' ') + '  |  ' + 'date'.padEnd(maxLengthDate, ' ') + '  |  ' + 'comment'.padEnd(maxLengthMassage, ' ') + '  |  ' + 'path'
    let minusesString = '-'.repeat(8 + maxLengthName + 5 + maxLengthDate + 5 + maxLengthMassage + 5 + maxPath);
    console.log(tablecolomn)
    console.log(minusesString)
    for (const stringArray of arrayStringSplit) {

        let tableString = ''
        if (stringArray[2].match('!')) {
            tableString += "  !  |  ";
        } else {
            tableString += "     |  ";
        }

        if (stringArray[0].length > 18) {
            tableString += stringArray[0].slice(8, 15) + '...' + '  |  ';
        } else {
            tableString += stringArray[0].slice(8, stringArray[0].length).padEnd(maxLengthName, ' ') + '  |  ';
        }

        tableString += stringArray[1].trim().padEnd(maxLengthDate) + '  |  '

        if (stringArray[2].length > 50) {
            tableString += stringArray[2].trim().slice(0, 47) + '...';
        } else {
            tableString += stringArray[2].trim().padEnd(maxLengthMassage, ' ');
        }
        tableString += '  |  ' + stringArray[3]
        console.log(tableString)
    }
    console.log(minusesString)
}

module.exports = {
    tableCreate
};
