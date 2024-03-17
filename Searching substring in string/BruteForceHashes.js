const fs = require('fs');

const lenArgs = process.argv.length; // Длина аргументов
// Получаем массив из ключей (от 2, потому что первые два эл. это `node` и `*.js`, по lenArgs - 3, потому что три аргумента в конце гарантированно будут: метод, файл со строкой и файл с подстрокой)
const keys = process.argv.slice(2, lenArgs - 3);
let method = process.argv[lenArgs - 3]; // Метод, который используется
const stringFile = process.argv[lenArgs - 2]; // Файл со строкой
const substringFile = process.argv[lenArgs - 1]; // Файл с подстрокой

// Проверка на существование файла со строкой и файла с подстрокой
if (!fs.existsSync(stringFile) || !fs.existsSync(substringFile)) {
    return console.log('String file and/or substring file are notarra found');
}

// Проверка, что файл со строкой и файл с подстрокой не пустые
if (!fs.readFileSync(stringFile, 'utf-8').length || !fs.readFileSync(substringFile, 'utf-8').length) {
    return console.log('String file and/of substring file are empty')
}

let numberOfIndexs; // Количество выводимых индексов
if (keys.indexOf('-n') != -1) { // Если был найден ключ на вывод N элементов
    numberOfIndexs = parseInt(keys[keys.indexOf('-n') + 1]); // Получаем следующий элемент. Это количество, сколько элементов надо вывести
    if (numberOfIndexs < 0 || isNaN(numberOfIndexs)) // Проверяем на корректность: не меньше 0 и является числом
        return console.log('The number of elements per output must be at least 0'); // Ошибка, если количество меньше 0 или не число
}
let time = performance.now(); // Начало работы алгоритма
let counterCollision = 0; // Количество колизий (Коллизия - если у нас хэш-сумма совпала, а сама строка не совпала)
const string = fs.readFileSync(stringFile, 'utf8'); // Строка
const substring = fs.readFileSync(substringFile, 'utf8'); // Подстрока

let arrayIndex = []; // Массив индексов
// Сумма строки  | Сумма подстроки     | Счётчик совпадений
let sumString = 0; let sumSubstring = 0; let counter;

// Функиця для Хэшей: Сумма, сумма квадратов, Алгоритм Рабина-Карпа
function hashes() {

    // Цикл от нуля до длины строки - длиня подстроки
    for(let i = 0; i < string.length - substring.length; i++) {

        // Проверка на совпадение хэш сумм
        if (sumString == sumSubstring) {
            // Если совпали...
            counter = 0; // Обнуляем счётчик
            for(let j = 0; j < substring.length; j++) {
                if (string[i + j] != substring[j]) {
                    break; // Если символ не совпал
                }

                counter++; // +1 к счётчику, так как у нас есть совпадение
            }
    
            // Если количество совпавших символов равна длине подстроки
            if (counter == substring.length) {
                arrayIndex.push(i); // Добавляем начальный индекс в массив
            }
            else { // Если не совпало
                counterCollision++; // +1 к количеству коллизий
            }
        }
    
        // Если количество индексов равна или больше количеству, требуемых на вывод -> Выходим из основного цикла
        if (arrayIndex.length >= numberOfIndexs) {
            break; // <-- Выход из цикла
        }
    

        // Мой любимый switch..case :D
        switch(method) { // Если был выбран метод...

            case 'h1': { // Сумма кодов
                // Вычитаем из прошлой суммы первый символ строки и прибавляем следующий символ строки
                sumString = sumString - string[i].charCodeAt() + string[i + substring.length].charCodeAt();
                break;
            }
    
            case 'h2': { // Сумма квадратов
                // Вычитаем из прошлой суммы первый символ строки в квадрате и прибавляем следующий символ строки в квадрате
                sumString = sumString - (string[i].charCodeAt() ** 2) + (string[i + substring.length].charCodeAt() ** 2);
                break;
            }
    
            case 'h3': { // Алгоритм Рабина-Карпа
                // Вычитаем из прошлой суммы, код первого символа умноженное на 2 в степени длина подстроки - 1. Это умножаем на 2 (так как степень этой двойки будет равен 1)
                // К этому мы прибавляем код следующего символа. Мы не умножаем на 2, потому что у двойки будет нулевая степень, то есть, мы будем умножать на единицу
                sumString = (sumString - string[i].charCodeAt() * (2**(substring.length - 1))) * 2 + string[i + substring.length].charCodeAt();
                break;
            }
        }
    }
}

// Switch...case на указанный метод
switch(method.toLowerCase()) {

    // Метод Brute Force
    case 'brute-force': {} // Один из вариантов названия метода
    case 'bruteforce': {} // Один из вариантов названия метода
    case 'b': {
        for(let i = 0; i < string.length - substring.length + 1; i++) {
            let count = 0; // Счётчик совпадений символов
            for(let j = 0; j < substring.length; j++) {
                if (string[i + j] == substring[j])
                    count++; // Если символы совпали, то count++;
            }

            // Если количество совпавших символов равна длине подстроки - добавляем в массив индекс
            if (count == substring.length) {
                arrayIndex.push(i);
            }

            // Если количество индексов в массие больше или равна количеству требуемых на вывод
            if (arrayIndex.length >= numberOfIndexs) {
                break; // <-- Выходим из цикла
            }
        }
        // Сохраняю новое название этого метода, чтобы в будущем им воспользоваться (чтобы не делать много case, я перезаписываю название метода в переменной)
        method = 'b';
        break;
    }

    // Метод Hashes: Сумма кодов
    case 'hashes-sum': {} // Один из вариантов названия метода
    case 'hashessum': {} // Один из вариантов названия метода
    case 'hs': {} // Один из вариантов названия метода
    case 'h1': {
        for(let i = 0; i < substring.length; i++) {
            // Сумма ASCII у подстроки
            sumSubstring += substring[i].charCodeAt();
    
            // Сумма ASCII у строки
            sumString += string[i].charCodeAt();
        }
        
        // Сохраняю новое название этого метода, чтобы в будущем им воспользоваться (чтобы не делать много case, я перезаписываю название метода в переменной)
        method = 'h1';
        hashes(); // Вызываем функция хэшей
        break;
    }

    // Метод Hashes: Сумма квадратов кодов
    case 'hashes-sum-square': {} // Один из вариантов названия метода
    case 'hashessumsquare': {} // Один из вариантов названия метода
    case 'hss': {} // Один из вариантов названия метода
    case 'h2': {
        for(let i = 0; i < substring.length; i++) {
            // Сумма ASCII у подстроки
            sumSubstring += substring[i].charCodeAt() ** 2;
    
            // Сумма ASCII у строки
            sumString += string[i].charCodeAt() ** 2;
        }
        // Сохраняю новое название этого метода, чтобы в будущем им воспользоваться (чтобы не делать много case, я перезаписываю название метода в переменной)
        method = 'h2';
        hashes(); // Вызываем функция хэшей
        break;
    }

    // Метод Hashes: Рабина-Карпа
    case 'hashes-rabina-karp': {} // Один из вариантов названия метода
    case 'hashesrabinakarp': {} // Один из вариантов названия метода
    case 'hrk': {} // Один из вариантов названия метода
    case 'h3': {
        for(let i = 0; i < substring.length; i++) {
            // Сумма ASCII у подстроки
            sumSubstring += substring[i].charCodeAt() * (2**(substring.length - i - 1));
    
            // Сумма ASCII у строки
            sumString += string[i].charCodeAt() * (2**(substring.length - i - 1));
        }
        // Сохраняю новое название этого метода, чтобы в будущем им воспользоваться (чтобы не делать много case, я перезаписываю название метода в переменной)
        method = 'h3';
        hashes(); // Вызываем функция хэшей
        break;
    }

    default: { // Если указанный метод не сущесвует
        return console.log(`Command: core.js (-c | -n N | -t | -a) [h1 | h2 | h3] string.txt substring.txt`)
    }
}

// Конец работы алгоритма
time = performance.now() - time;

// Если есть ключ на вывод количества коллизий
if (keys.indexOf('-c') != -1) {
    console.log(`Collision: ${counterCollision}`);
}

// Если есть ключ на вывод времени
if (keys.indexOf('-t') != -1) {
    console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
}

// Вывод массива из индексов
console.log(arrayIndex);