const fs = require('fs');
const escape = require('./escape.js');
const jump = require('./jump.js');

/*
input.txt - Исходные данные. Строка, которую надо закодировать
output.txt - Полученный результат кодирования
result.txt - Результат декодирования из output.txt
*/
const action = process.argv[2]; // Действие: encode (Кодирование) и decode (Декодирование)
const method = process.argv[3]; // Метод, которым будем кодировать/декодировать строки
const startFileName = process.argv[4]; // Название файла, который надо прочитать
const endFileName = process.argv[5]; // Название файла, в который надо запихнуть результат

// Проверка на аргументы
if (process.argv.length != 6) {
    console.log('Вы не указали требумое количество агрументов:\n1. Действие: encode, decode\n2. Метод: escape, jump\n3. Название файла на чтение\n4. Название файла на запись результата');
    return;
}

const readFileName = fs.readFileSync(startFileName, 'utf8'); // Чтение файла
if (!readFileName) {
    console.log('Указанный файл пустой: ' + startFileName);
    return;
}

switch (method) {
    case 'escape': { // Метод: Escape
        escape.run(action, startFileName, endFileName); // Действие, начальный файл, конечный файл
        break;
    }

    case 'jump': { // Метод: Jump
        jump.run(action, startFileName, endFileName); // Действие, начальный файл, конечный файл
        break;
    }

    default: { // Если указанный метод не найден
        console.log('Указанный метод не найден: ' + method);
        break;
    }
}