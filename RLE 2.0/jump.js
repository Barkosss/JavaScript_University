const fs = require('fs');

module.exports.encode = async(inputFile, outputFile) => {
    const content = fs.readFileSync(inputFile, 'utf-8'); // Содержимое исходного файла
    var encodeContent = '';
    for(let index = 0; index < content.length; index++) {
        var countRepeat = 1; var countDifferent = 1; var differentLetters = '';
        if (content[index] == content[index + 1] && content[index] == content[index + 2]) {
            while((content[index] == content[index + 1]) && countRepeat < 128) {
                countRepeat++;
                index++;
            }
            encodeContent += String.fromCharCode(countRepeat) + content[index];
        }
        else {
            while(!((content[index] == content[index + 1]) && (content[index] == content[index + 2])) && countDifferent < 127) {
                countDifferent++;
                differentLetters += content[index];
                index++;
            }
            encodeContent += String.fromCharCode(128 + countDifferent) + differentLetters;
            index--;
        }
    }

    console.log("Jump encoding was successful!");
    fs.writeFileSync(outputFile, `Method: jump\n${encodeContent}`); // Запись в файл
}

module.exports.decode = async(inputFile, outputFile) => {
    const contentFile = fs.readFileSync(inputFile, 'utf8');
    const methodDecode = contentFile.split('\n')[0]; // Method: ...
    const contentDecode = contentFile.split('\n')[1]; // Content: ...
    if (!methodDecode.toLowerCase().endsWith('jump')) { // Если кодировка не Escape
        console.log("A different coding method was used. Not \"Jump\"");
        return;
    }
    var decodeContent = '';
    for(let index = 0; index < contentDecode.length; index++) { // Тут проблема!!!!!!!!!!!!!!!!!!!!!
        if (contentDecode[index].charCodeAt() < 128) { // Если повторяемые символы
            decodeContent += contentDecode[index + 1].repeat(contentDecode[index].charCodeAt());
            index += contentDecode[index].charCodeAt() + 1;
        } else {
            while (contentDecode[index].charCodeAt() > 127) {
                decodeContent += contentDecode[index + 1];
                contentDecode[index].charCodeAt()--;
                index++;
            }
        }
    }

    console.log("Jump decoding was successful!");
    fs.writeFileSync(outputFile, `Method: jump\nContent: ${decodeContent}`); // Запись в файл
};