const fs = require('fs');
const escape = require('./escape.js');
const jump = require('./jump.js');

const consoleArgs = process.argv.slice(2);
const action = consoleArgs[0].toLowerCase(); // Действие: Encode, Decode (Кодирование, Декодирование)
const method = consoleArgs[1].toLowerCase(); // Метод: Escape, Jump
const inputFile = consoleArgs[2]; // Фалй для чтения
const outputFile = consoleArgs[3]; // Файл для записи результата

const existsInputFile = fs.existsSync(inputFile); // Проверка на наличие файла для чтения
const existsOutputFile = fs.existsSync(outputFile); // Проверка на наличие файла для записи
if (!existsInputFile || !existsOutputFile) { // Если файл для чтения или файл для записи отсутствуют - Ошибка
    console.log("Input or Output files do not exists!"); return;
}

switch(action) {

    case 'encode': { // Кодирование

        // Если метод кодирования равен "escape", то запускаем функция кодирования через escape,
        // иначе, если метод равен "jump", то запускаем функцию кодирования через jump,
        // иначе, если ничему не равен, то ошибка
        (method == "escape") ? (escape.encode(inputFile, outputFile)) : ((method == "jump") ? (jump.encode(inputFile, outputFile)) : (console.log(`Method "${method}" is not found!`)));
        break;
    }

    case 'decode': { // Декодирование

        // Если метод декодирования равен "escape", то запускаем функция декодирования через escape,
        // иначе, если метод равен "jump", то запускаем функцию декодирования через jump,
        // иначе, если ничему не равен, то ошибка
        (method == "escape") ? (escape.decode(inputFile, outputFile)) : ((method == "jump") ? (jump.decode(inputFile, outputFile)) : (console.log(`Method "${method}" is not found!`)));
        break;
    }

    default: { // Если не найден метод - Ошибка
        console.log(`Action "${action}" is not found!`);
        break;
    }
}