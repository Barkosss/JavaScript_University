const fs = require('fs');


const inputFile = process.argv[3]; // Файл для чтения
const outputFile = process.argv[4]; // Файл для записи

// Объект с алфавитом
const rate = {
    'ru': {
        "о": 0.10983,
        "е": 0.08483,  
        "а": 0.07998,  
        "и": 0.07367,  
        "н": 0.067,  
        "т": 0.06318,  
        "с": 0.05473,  
        "р": 0.04746,  
        "в": 0.04533,  
        "л": 0.04343,
        "к": 0.03486,  
        "м": 0.03203,  
        "д": 0.02977,
        "п": 0.02804,  
        "у": 0.02615,  
        "я": 0.02001,  
        "ы": 0.01898,  
        "ь": 0.01735,  
        "г": 0.01687,  
        "з": 0.01641,  
        "б": 0.01592,  
        "ч": 0.0145,
        "й": 0.01208,  
        "х": 0.00966,  
        "ж": 0.0094,
        "ш": 0.00718,  
        "ю": 0.00639,
        "ц": 0.00486,  
        "щ": 0.00361,  
        "э": 0.00331,  
        "ф": 0.00267,  
        "ъ": 0.00037,  
        "ё": 0.00013
    },
    'en': {
        'a': 0.08167,
        'n': 0.06749,
        'b': 0.01492,
        'o': 0.07507,
        'c': 0.02782,
        'p': 0.01929,
        'd': 0.04253,
        'q': 0.00095,
        'e': 0.12702,
        'r': 0.05987,
        'f': 0.02228,
        's': 0.06327,
        'g': 0.02015,
        't': 0.09056,
        'h': 0.06094,
        'u': 0.02758,
        'i': 0.06966,
        'v': 0.00978,
        'j': 0.00153,
        'w': 0.02360,
        'k': 0.00772,
        'x': 0.00150,
        'l': 0.04025,
        'y': 0.01974,
        'm': 0.02406,
        'z': 0.0007
    }
};

const language = { 'ru':'абвгдеёжзийклмнопрстуфхцчшщъыьэюя', 'en':'abcdefghijklmnopqrstuvwxyz' };

// Проверка на наличие файла
if (!fs.existsSync(inputFile)) return console.log('');

function encode(content, shift, lang) {
    let encodeContent = '';
    for(let index = 0; index < content.length; index++) {
        // Если встретился не буква
        if (' ,.?!–-»()…'.includes(content[index]) || !isNaN(Number(content[index]))) {
            encodeContent += content[index];
            continue;
        }
        let isUpper = (content[index] == content[index].toUpperCase());
        let char = content[index].toLowerCase();

        // Если символ не соответствует алфовиту
        if (language[lang].indexOf(char) == -1){
            console.log(char);
            console.log('Got a character that doesn\'t match the alphabet.');
            return -1;
        }
        let encodeChar = language[lang][(language[lang].indexOf(char) + shift) % language[lang].length];
        encodeContent += (isUpper) ? (encodeChar.toUpperCase()) : (encodeChar);
    }

    
    return encodeContent;
}

function decode(content, lang) {
    let rateLetter, rateMax = 0;
    let decodeContentArray = [];

    for(let i = 0; i < content.length; i++) {
        if (rateLetter == content[i]) continue;
        
        
    }


    /*
    let decodeContentArray = [];

    for(let shift = 0; shift < language[lang].length + 1; shift++) {
        let decodeContent = '';
        for(let index = 0; index < content.length; index++) {
            // Если стретился не буква
            if (' ,.?!–-»()…'.includes(content[index]) || !isNaN(Number(content[index]))) {
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
    */
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