const fs = require('fs');

const lenArgs = process.argv.length; // Длина аргументов
// Получаем массив из ключей (от 2, потому что первые два эл. это `node` и `*.js`, по lenArgs - 3, потому что три аргумента в конце гарантированно будут: метод, файл со строкой и файл с подстрокой)
const keys = process.argv.slice(2, lenArgs - 3);
const method = process.argv[lenArgs - 3]; // Метод, который используется
const stringFile = process.argv[lenArgs - 2]; // Файл со строкой
const substringFile = process.argv[lenArgs - 1]; // Файл с подстрокой

// Проверка на существование файла со строкой и файла с подстрокой
if (!fs.existsSync(stringFile) || !fs.existsSync(substringFile)) {
    return console.log('String file and/or substring file are not found');
}

// Проверка, что файл со строкой и файл с подстрокой не пустые
if (!fs.readFileSync(stringFile, 'utf-8').length || !fs.readFileSync(substringFile, 'utf-8').length) {
    return console.log('String file and/of substring file are empty')
}

let numberOfIndexs;
if (keys.indexOf('-n') != -1) { // Если был найден ключ на вывод N элементов
    numberOfIndexs = parseInt(keys[keys.indexOf('-n') + 1]); // Получаем следующий элемент. Это количество, сколько элементов надо вывести
    if (numberOfIndexs < 0 || isNaN(numberOfIndexs)) return console.log('The number of elements per output must be at least 0'); // Ошибка, если количество меньше 0
}
let time = performance.now(); // Начало работы алгоритма
let counterCollision = 0;
const string = fs.readFileSync(stringFile, 'utf8');
const substring = fs.readFileSync(substringFile, 'utf8');

let arrayIndex = []; // Массив индексов
// Сумма строки, Сумма подстроки, Счётчик совпадений
let sumSubstring = 0; let counter;
let sumString = 0; // Обнуление суммы строки


switch(method.toLowerCase()) {

    // Метод Brute Force
    case 'brute-force': {}
    case 'bruteforce': {}
    case 'b': {
        for(let i = 0; i < string.length - substring.length + 1; i++) {
            let count = 0; // Счётчик совпадений символов
            for(let j = 0; j < substring.length; j++) {
                if (string[i + j] == substring[j]) count++; // Если символы совпали, то count++;
            }

            // Если количество совпавших символов равна длине подстроки - добавляем в массив индекс
            if (count == substring.length) arrayIndex.push(i);
            if (arrayIndex.length >= numberOfIndexs) break;
        }
        break;
    }

    // Метод Hashes: Сумма кодов
    case 'hashes-sum': {}
    case 'hashessum': {}
    case 'hs': {}
    case 'h1': {
        for(let i = 0; i < substring.length; i++) {
            // Сумма ASCII у подстроки
            sumSubstring += substring[i].charCodeAt();
    
            // Сумма ASCII у строки
            sumString += string[i].charCodeAt();
        }
        method = 'h1';
        break;
    }

    // Метод Hashes: Сумма квадратов кодов
    case 'hashes-sum-square': {}
    case 'hashessumsquare': {}
    case 'hss': {}
    case 'h2': {
        for(let i = 0; i < substring.length; i++) {
            // Сумма ASCII у подстроки
            sumSubstring += substring[i].charCodeAt() ** 2;
    
            // Сумма ASCII у строки
            sumString += string[i].charCodeAt() ** 2;
        }
        method = 'h2';
        break;
    }

    // Метод Hashes: Рабина-Карпа
    case 'hashes-rabina-karp': {}
    case 'hashesrabinakarp': {}
    case 'hrk': {}
    case 'h3': {
        for(let i = 0; i < substring.length; i++) {
            // Сумма ASCII у подстроки
            sumSubstring += substring[i].charCodeAt() * (2**(substring.length - i - 1));
    
            // Сумма ASCII у строки
            sumString += string[i].charCodeAt() * (2**(substring.length - i - 1));
        }
        method = 'h3';
        break;
    }

    default: {
        console.log(`Command: core.js (-c | -n N | -t | -a) [h1 | h2 | h3] string.txt substring.txt`)
        break;
    }
}

for(let i = 0; i < string.length - substring.length; i++) {

    if (sumString == sumSubstring) {
        counter = 0;
        for(let j = 0; j < substring.length; j++) {
            if (string[i + j] != substring[j]) break; // Если символ не совпал
            counter++;
        }

        if (counter == substring.length) arrayIndex.push(i);  
        else counterCollision++;          
    }

    if (arrayIndex.length >= numberOfIndexs) break;

    switch(method) {
        case 'h1': {
            sumString = sumString - string[i].charCodeAt() + string[i + substring.length].charCodeAt();
            break;
        }

        case 'h2': {
            sumString = sumString - (string[i].charCodeAt() ** 2) + (string[i + substring.length].charCodeAt() ** 2);
            break;
        }

        case 'h3': {
            sumString = (sumString - string[i].charCodeAt() * (2**(substring.length - 1))) * 2 + string[i + substring.length].charCodeAt();
            break;
        }
    }
}

time = performance.now() - time; // Конец работы алгоритма
if (keys.indexOf('-c') != -1) console.log(`Collision: ${counterCollision}`);
if (keys.indexOf('-t') != -1) console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
console.log(arrayIndex);