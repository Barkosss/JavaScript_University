const fs = require('fs');

// Алфавит
const language = { 'ru':'абвгдеёжзийклмнопрстуфхцчшщъыьэюя', 'en':'abcdefghijklmnopqrstuvwxyz' };


// Кодирование
function Encode(content, shift, lang) {
    let encodeContent = '';
    let tableContent = {};

    for(let index = 0; index < content.length; index++) {
        // Если встретился не буква
        if (' ,.?!–-»()…'.includes(content[index]) || !isNaN(Number(content[index]))) {
            encodeContent += content[index];
            continue;
        }
        let isUpper = (content[index] == content[index].toUpperCase()); // Флаг для проверки на верхний регистр
        let char = content[index].toLowerCase(); // Нижний регистр символа

        // Если символ не соответствует алфовиту
        if (!language[lang].indexOf(char) == -1){
            console.log('Got a character that doesn\'t match the alphabet.');
            return;
        }

        if (!tableContent[char]) tableContent[char] = 1;
        else tableContent[char]++;

        // Вычисление закодированного символа
        let encodeChar = language[lang][(language[lang].indexOf(char) + shift) % language[lang].length];
        encodeContent += (isUpper) ? (encodeChar.toUpperCase()) : (encodeChar); // Запись закодированного символа
    }

    
    return encodeContent;
}


// Декодирование
function Decode(content, lang) {
    let decodeContent = ''; let shift = 0;
    let table = {}; 
    let rate = {
        "ru": {
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
            "ё": 0.00013,
        },    
        "en": {
            "a": 0.0817,
            "b": 0.0149, 
            "c": 0.0278, 
            "d": 0.0425, 
            "e": 0.1270, 
            "f": 0.0223, 
            "g": 0.0202, 
            "h": 0.0609, 
            "i": 0.0697, 
            "j": 0.0015, 
            "k": 0.0077, 
            "l": 0.0403, 
            "m": 0.0241, 
            "n": 0.0675, 
            "o": 0.0751, 
            "p": 0.0193, 
            "q": 0.0010, 
            "r": 0.0599, 
            "s": 0.0633, 
            "t": 0.0906, 
            "u": 0.0276, 
            "v": 0.0098, 
            "w": 0.0236, 
            "x": 0.0015, 
            "y": 0.0197, 
            "z": 0.0007,
        }
    };

    for(let index = 0; index < content.length; index++) {
        // Если встретился не буква
        if (' ,.?!–-»()…'.includes(content[index]) || !isNaN(Number(content[index])))
            continue;
        
        let char = content[index].toLowerCase(); // Нижний регистр символа
        // Если символ не соответствует алфовиту
        if (!language[lang].indexOf(char) == -1){
            console.log('Got a character that doesn\'t match the alphabet.');
            return;
        }

        if (!table[char]) table[char] = 1;
        else table[char]++;
    }

    let currRate = 0; let currLetter;
    let minRate = +Infinity; let minLetter;
    let ObjectTable = Object.keys(table);
    for(let index = 0; index < ObjectTable.length; index++) {
        currRate = table[ObjectTable[index]] / content.length;
        currLetter = ObjectTable[index];

        for(let j = 0; j < Object.keys(rate[lang]).length; j++) {
            if (minRate > Math.abs(currRate - rate[lang][Object.keys(rate[lang])[j]])) {
                minRate = Math.abs(currRate - rate[lang][Object.keys(rate[lang])[j]]);
                minLetter = currLetter;
                shift = language[lang].indexOf(currLetter) - language[lang].indexOf(Object.keys(rate[lang])[j]);
            }
        }
    }

    

    console.log('res', decodeContent, shift);
    return [decodeContent, shift];
}


const action = process.argv[2];
const readFile = process.argv[3];
const writeFile = process.argv[4];

if (!fs.existsSync(readFile)) return console.log(``);

const content = fs.readFileSync(readFile, 'utf8');
switch(action) {

    case 'code': {}
    case 'encode': {
        let shift = Number(process.argv[5]);
        const lang = process.argv[6];

        if (isNaN(shift)) return console.log(``);
        shift = (shift < 0) ? (language[lang].length - Math.abs(shift)) : (shift);
        if (['ru', 'en'].indexOf(lang)) return console.log(``);

        const encodeContent = Encode(content, shift, lang);
        if (!encodeContent) return;
        fs.writeFileSync(writeFile, encodeContent);
        console.log(`The text is encoded`);
        break;
    }

    case 'decode': {
        const lang = process.argv[5];
        if (['ru', 'en'].indexOf(lang)) return console.log(``);

        const [decodeContent, shift] = Decode(content, lang);
        if (!decodeContent) return;
        fs.writeFileSync(writeFile, 'Shift: ' + shift + '\n' + decodeContent);
        console.log(`Text decoded`);
        break;
    }

    default: {
        console.log(`${action} is not find`);
        break;
    }
}