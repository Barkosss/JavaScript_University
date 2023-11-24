const fs = require('fs');

module.exports.sum = async(keys, stringFile, substringFile) => {
    const string = fs.readFileSync(stringFile, 'utf8');
    const substring = fs.readFileSync(substringFile, 'utf8');
    
    let arrayIndex = []; // Массив индексов
    let sumString; let sumSubstring = 0; let counter;
    for(let i = 0; i < substring.length; i++) {
        sumSubstring += substring[i].charCodeAt();
    }

    for(let i = 0; i < string.length - substring.length + 1; i++) {
        sumString = 0;
        for(let j = 0; j < substring.length; j++) {
            sumString += string[i + j].charCodeAt();
        }

        if (sumString != sumSubstring) continue // Если сумма не равна
        counter = 0;
        for(let j = 0; j < substring.length; j++) {
            if (string[i + j] != substring[j]) break;
            counter++;
        }

        if (counter == substring.length) arrayIndex.push(i);
    }

    console.log(arrayIndex);
}

module.exports.sumSquare = async(keys, stringFile, substringFile) => {
    const string = fs.readFileSync(stringFile, 'utf8');
    const substring = fs.readFileSync(substringFile, 'utf8');

    
}

module.exports.rabinaKarp = async(keys, stringFile, substringFile) => {
    const string = fs.readFileSync(stringFile, 'utf8');
    const substring = fs.readFileSync(substringFile, 'utf8');

    
}