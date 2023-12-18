const fs = require('fs');


const inputFile = process.argv[3]; // Файл для чтения
const outputFile = process.argv[4]; // Файл для записи

// Объект с алфавитом
const language = { 'ru':'абвгдеёжзийклмнопрстуфхцчшщъыьэюя', 'en':'abcdefghijklmnopqrstuvwxyz' };

// Проверка на наличие файла
if (!fs.existsSync(inputFile)) return console.log('');

function encode(content, shift, lang) {
    let encodeContent = '';
    for(let index = 0; index < content.length; index++) {
        // Если стретился не буква
        if (' ,.?!'.includes(content[index])) {
            encodeContent += content[index];
            continue;
        }
        let isUpper = (content[index] == content[index].toUpperCase());
        let char = content[index].toLowerCase();

        // Если символ не соответствует алфовиту
        if (language[lang].indexOf(char) == -1){
            console.log('Got a character that doesn\'t match the alphabet.');
            return -1;
        }
        let encodeChar = language[lang][(language[lang].indexOf(char) + shift) % language[lang].length];
        encodeContent += (isUpper) ? (encodeChar.toUpperCase()) : (encodeChar);
    }

    
    return encodeContent;
}

function decode(content, lang) {
    let decodeContentArray = [];

    for(let shift = 0; shift < language[lang].length + 1; shift++) {
        let decodeContent = '';
        for(let index = 0; index < content.length; index++) {
            // Если стретился не буква
            if (' ,.?!'.includes(content[index])) {
                decodeContent += content[index];
                continue;
            }
            let isUpper = (content[index] == content[index].toUpperCase());
            let char = content[index].toLowerCase();

            // Если символ не соответствует алфовиту
            if (language[lang].indexOf(char) == -1){
                console.log('Got a character that doesn\'t match the alphabet.');
                return -1;
            }
            let encodeChar = language[lang][((language[lang].indexOf(char) - shift >= 0) ? (language[lang].indexOf(char) - shift) : (language[lang].length - shift)) % language[lang].length];
            decodeContent += (isUpper) ? (encodeChar.toUpperCase()) : (encodeChar);
        }
        decodeContentArray.push(shift + '\t|\t' + decodeContent);
    }

    return decodeContentArray;
}

const content = fs.readFileSync(inputFile, 'utf8'); // Содержимое файла
const action = process.argv[2]; // Действие (Закодировать / Декодировать)
switch(action) {

    case 'code': {}
    case 'encode': { // Если надо закодировать текст
        let shift = parseInt(process.argv[process.argv.length - 2]);
        let lang = process.argv[process.argv.length - 1].toLowerCase();

        // Если сдвиг не число
        if (isNaN(parseInt(shift)) || parseInt(shift) < 0) return console.log('The shift must be similar to a number and at least 0');

        // Если алфавит не ru и не en
        if (['ru', 'en'].indexOf(lang) == -1) return console.log('There are only ru and en alphovites');

        let encodeContent = encode(content, shift, lang);
        if (encodeContent == -1) return;
        fs.writeFileSync(outputFile, encodeContent);
        console.log('The text is encoded');
        break;
    }

    case 'decode': { // Если надо декодировать текст
        let lang = process.argv[process.argv.length - 1].toLowerCase();

        // Если алфавит не ru и не en
        if (['ru', 'en'].indexOf(lang) == -1) return console.log('There are only ru and en alphovites');

        let decodeContent = decode(content, lang);
        if (decodeContent == -1) return;
        fs.writeFileSync(outputFile, decodeContent.join('\n'));
        console.log('The text is decoded');
        break;
    }

    default: { // Если не указан корректно формат
        console.log('Format: [encode/decode] [input file] [output file] (shift to encode) [alphabet]');
        break;
    }
}