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
const string = fs.readFileSync(stringFile, 'utf8').toLowerCase();
const substring = fs.readFileSync(substringFile, 'utf8').toLowerCase();

if (string.length < substring.length) { // Если длина строки меньше длины подстроки - Ошибка
    return console.log("The length of the string must not be shorter than the length of the substring!");
}

let arrayIndex = []; // Массив индексов
for(let i = 0; i < string.length - substring.length + 1; i++) {
    let count = 0; // Счётчик совпадений символов
    for(let j = 0; j < substring.length; j++) {
        if (string[i + j] == substring[j]) count++; // Если символы совпали, то count++;
    }

    // Если количество совпавших символов равна длине подстроки - добавляем в массив индекс
    if (count == substring.length) arrayIndex.push(i);
    if (arrayIndex.length >= numberOfIndexs) break;
}

time = performance.now() - time; // Конец работы алгоритма
if (keys.indexOf('-t') != -1) console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
console.log(arrayIndex);