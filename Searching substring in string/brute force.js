const fs = require('fs');

module.exports.run = async(stringFile, substringFile) => {
    const string = fs.readFileSync(stringFile, 'utf8');
    const substring = fs.readFileSync(substringFile, 'utf8');

    if (string.length < substring.length) {
        return console.log("The length of the string must not be shorter than the length of the substring!");
    }

    let arrayIndex = [];
    let lenStringSubstring = string.length - substring.length;
    for(let i = 0; i < lenStringSubstring + 1; i++) {
        let count = 0;
        for(let j = 0; j < substring.length; j++) {
            if (string[i + j] == substring[j]) count++;
        }

        if (count == substring.length) arrayIndex.push(i);
    }

    console.log(arrayIndex);
}