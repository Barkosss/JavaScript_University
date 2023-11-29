const fs = require('fs');

// Методы
const bruteForce = require('./brute force.js'); // Метод: Brute Force (Грубая сила)
const hashes = require('./hashes.js'); // Метод: Хэширование
const auto = require('./auto.js'); // Метод: Автомат
// Методы


const lenArgs = process.argv.length; // Длина аргументов
// Получаем массив из ключей (от 2, потому что первые два эл. это `node` и `*.js`, по lenArgs - 3, потому что три аргумента в конце гарантированно будут: метод, файл со строкой и файл с подстрокой)
const keys = process.argv.slice(2, lenArgs - 3);
const method = process.argv[lenArgs - 3]; // Метод, который используется
const stringFile = process.argv[lenArgs - 2]; // Файл со строкой
const substringFile = process.argv[lenArgs - 1]; // Файл с подстрокой


// Создание рандомной строк, которая будет записана в string.txt
if (keys.indexOf('-create') != -1) {
    let string = '';
    let counter = Math.floor(Math.random() * 10_000); // Рандомное кол-во символов в строке
    for(let i = 0; i < counter; i++) string += String.fromCharCode(Math.floor(Math.random() * (226 - 1) + 1));
    fs.writeFileSync(stringFile, string);
}
// Создание рандомной строк, которая будет записана в string.txt


// Проверка на существование файла со строкой и файла с подстрокой
if (!fs.existsSync(stringFile) || !fs.existsSync(substringFile)) {
    return console.log('String file and/or substring file are not found');
}

// Проверка, что файл со строкой и файл с подстрокой не пустые
if (!fs.readFileSync(stringFile, 'utf-8').length || !fs.readFileSync(substringFile, 'utf-8').length) {
    return console.log('String file and/of substring file are empty')
}


switch(method.toLowerCase()) {

    // Метод Brute Force
    case 'brute-force': {}
    case 'bruteforce': {}
    case 'b': {
        bruteForce.run(keys, stringFile, substringFile);
        break;
    }

    // Метод Hashes: Сумма кодов
    case 'hashes-sum': {}
    case 'hashessum': {}
    case 'hs': {}
    case 'h1': {
        hashes.sum(keys, stringFile, substringFile);
        break;
    }

    // Метод Hashes: Сумма квадратов кодов
    case 'hashes-sum-square': {}
    case 'hashessumsquare': {}
    case 'hss': {}
    case 'h2': {
        hashes.sumSquare(keys, stringFile, substringFile);
        break;
    }

    // Метод Hashes: Рабина-Карпа
    case 'hashes-rabina-karp': {}
    case 'hashesrabinakarp': {}
    case 'hrk': {}
    case 'h3': {
        hashes.rabinaKarp(keys, stringFile, substringFile);
        break;
    }

    // Метод Автомат
    case 'automatic': {}
    case 'automat': {}
    case 'auto': {
        auto.run(stringFile, substringFile);
        break;
    }
}