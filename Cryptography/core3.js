const fs = require('fs');

// Алфавит
const language = { 'ru':'абвгдеёжзийклмнопрстуфхцчшщъыьэюя', 'en':'abcdefghijklmnopqrstuvwxyz' };


// Кодирование ------------------------
function Encode(content, shift, lang) {
    let encodeContent = ''; let tableContent = {};

    for(let index = 0; index < content.length; index++) {
        // Если встретился не буква
        if (' ,.?!–-»()…'.includes(content[index]) || !isNaN(Number(content[index]))) {
            encodeContent += content[index];
            continue;
        }
        let isUpper = (content[index] == content[index].toUpperCase()); // Флаг для проверки на верхний регистр
        let char = content[index].toLowerCase(); // Нижний регистр символа

        // Если символ не соответствует алфовиту
        if (language[lang].indexOf(char) == -1){
            console.log('Got a character that doesn\'t match the alphabet.');
            return [-1, -1];
        }

        if (!tableContent[char]) tableContent[char] = 1;
        else tableContent[char]++;

        // Вычисление закодированного символа
        let encodeChar = language[lang][(language[lang].indexOf(char) + shift) % language[lang].length];
        encodeContent += (isUpper) ? (encodeChar.toUpperCase()) : (encodeChar); // Запись закодированного символа
    }

    // Поиск максимального элемента в тексте
    let maxLetter = Object.keys(tableContent).reduce((a, b) => tableContent[a] > tableContent[b] ? a : b);
    return [encodeContent, maxLetter];
}


// Декодирование --------------------
function Decode(content, key, lang) {
    let decodeContent = ''; let tableContent = {};

    // Поиск часто используемого символа
    for(let index = 0; index < content.length; index++) {
        // Если встретился не буква
        if (' ,.?!–-»()…'.includes(content[index]) || !isNaN(Number(content[index]))) continue;
        let char = content[index].toLowerCase();

        // Если символ не соответствует алфовиту
        if (language[lang].indexOf(char) == -1){
            console.log('Got a character that doesn\'t match the alphabet.');
            return -1;
        }

        if (!tableContent[char]) tableContent[char] = 1;
        else tableContent[char]++;
    }
    
    // Поиск максимального элемента в тексте
    let maxLetter = Object.keys(tableContent).reduce((a, b) => tableContent[a] > tableContent[b] ? a : b);

    // Подсчёт сдвига
    let shift = language[lang].length - Math.abs(language[lang].indexOf(maxLetter) - language[lang].indexOf(key));
    // Декодирование
    for(let index = 0; index < content.length; index++) {
        // Если встретился не буква
        if (' ,.?!–-»()…'.includes(content[index]) || !isNaN(Number(content[index]))) {
            decodeContent += content[index]; // Запись спец. символа
            continue;
        }
        let isUpper = (content[index] == content[index].toUpperCase()); // Флаг для проверки на верхний регистр
        let char = content[index].toLowerCase(); // Символ в нижнем регистре
        let decodeChar = language[lang][(language[lang].indexOf(char) + shift) % language[lang].length]; // Декодирование символ
        decodeContent += (isUpper) ? (decodeChar.toUpperCase()) : (decodeChar); // Запись декодированного символа
    }


    return decodeContent;
}

// --------

const readFile = process.argv[3]; // Файл для чтения
const writeFile = process.argv[4]; // Файл для записи

// Если не был найден файл для чтения
if (!fs.existsSync(readFile)) return console.log('Read file is not find');


const action = process.argv[2]; // Действие (Закодировать / Декодировать)
switch(action) {

    case 'code': {}
    case 'encode': { // Кодирование
        const content = fs.readFileSync(readFile, 'utf8'); // Содержимое файла
        let shift = parseInt(process.argv[process.argv.length - 2]); // Сдвиг
        let lang = process.argv[process.argv.length - 1].toLowerCase(); // Алфавит

        // Если сдвиг не число
        if (isNaN(parseInt(shift)) || parseInt(shift) < 0) return console.log('The shift must be similar to a number and at least 0');

        // Если алфавит не ru и не en
        if (['ru', 'en'].indexOf(lang) == -1) return console.log('There are only ru and en alphovites');

        let [encodeContent, maxLetter] = Encode(content, shift, lang);
        if (encodeContent == -1) return; // Если произошла ошибка
        fs.writeFileSync(writeFile, maxLetter + '\n' + encodeContent);
        console.log('The text is encoded');
        break;
    }

    case 'decode': { // Декодирование
        let lang = process.argv[process.argv.length - 1].toLowerCase(); // Алфавит
        let [key, content] = fs.readFileSync(readFile, 'utf8').split('\n'); // Содержимое файла
        
        // Если алфамит не ru и не en
        if (['ru', 'en'].indexOf(lang) == -1) return console.log('There are only ru and en alphovites');

        let decodeContent = Decode(content, key, lang);
        if (decodeContent == -1) return; // Если произошла ошибка
        fs.writeFileSync(writeFile, decodeContent);
        console.log('The text os decoded');
        break;
    }

    default: { // Если указано неправильное действие
        console.log(`${action} is not defind`)
        break;
    }
}