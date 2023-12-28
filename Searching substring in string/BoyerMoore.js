const fs = require('fs');

const lenArgs = process.argv.length; // Длина аргументов
const keys = process.argv.slice(2, lenArgs - 2);
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

let time = performance.now(); // Начало работы алгоритма
const string = fs.readFileSync(stringFile, 'utf8').toLowerCase();
const substring = fs.readFileSync(substringFile, 'utf8').toLowerCase();
let arrayIndex = [];

let numberOfIndexs;
if (keys.indexOf('-n') != -1) { // Если был найден ключ на вывод N элементов
    numberOfIndexs = parseInt(keys[keys.indexOf('-n') + 1]); // Получаем следующий элемент. Это количество, сколько элементов надо вывести
    if (numberOfIndexs < 0 || isNaN(numberOfIndexs))
        return console.log('The number of elements per output must be at least 0'); // Ошибка, если количество меньше 0
}

let lastNumberOfChar = new Array(256); // Массив для хранения индекса последнего вхождения символа
for(let i = 0; i < 256; i++) lastNumberOfChar[i] = -1;
for(let i = 0; i < substring.length; i++)
    lastNumberOfChar[substring[i]] = i; // Сохранение индекса символа

for(let index = 0; index < string.length;) {
    let shift = -1; // Сдвиг
    let cpIndex = 0; // Для учёта сдвига
    let control = true; // Флаг
    for(let j = substring.length - 1; j >= 0; j--) {
        if (string[index + j] != substring[j]) { // Если символ не совпал
            cpIndex = j; // Сохранения индекса
            control = false; // Изменяем флаг
            shift = substring.length - 1 - j;
            break;
        }
    }
    if (control) arrayIndex.push(index); // Если Флаг не был изменён под false
    if (arrayIndex.length >= numberOfIndexs) break;

    // 5 + 1 - 1 - 2 = 3
    index += Math.max(1, substring.length - lastNumberOfChar[string[index + cpIndex]] - 1 - shift);
}

time = performance.now() - time; // Конец работы алгоритма
if (keys.indexOf('-t') != -1) console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
console.log(arrayIndex); // Если не был найден ключ не вывод определённого кол-ва элементов