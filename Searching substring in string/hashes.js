const fs = require('fs');

/*
-с - помимо списка вхождений вывести число коллизий (только хэши);
-n N, где N - произвольное натуральное число - вывести первые N вхождений;
-t - вывести время работы алгоритма.
*/


// Переделать функции
// Избавиться от дублирования кода

// Hashes: Сумма кодов
module.exports.sum = async(keys, stringFile, substringFile) => {
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

    for(let i = 0; i < substring.length; i++) {
        // Сумма ASCII у подстроки
        sumSubstring += substring[i].charCodeAt();

        // Сумма ASCII у строки
        sumString += string[i].charCodeAt();
    }

    for(let i = 0; i < string.length - substring.length + 1; i++) {

        if (sumString == sumSubstring) {
            counter = 0;
            for(let j = 0; j < substring.length; j++) {
                if (string[i + j] != substring[j]) break; // Если не совпал символ
                counter++;
            }

            if (counter == substring.length) arrayIndex.push(i);
            else counterCollision++;
        }

        if (arrayIndex.length >= numberOfIndexs) break;
        sumString = sumString - string[i].charCodeAt() + string[i + substring.length - 1].charCodeAt();
    }

    time = performance.now() - time; // Конец работы алгоритма
    if (keys.indexOf('-c') != -1) console.log(`Collision: ${counterCollision}`);
    if (keys.indexOf('-t') != -1) console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
    console.log(arrayIndex);
}


// Hashes: Сумма квадратов кодов
module.exports.sumSquare = async(keys, stringFile, substringFile) => {
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

    for(let i = 0; i < substring.length; i++) {
        // Сумма ASCII у подстроки
        sumSubstring += substring[i].charCodeAt() ** 2;

        // Сумма ASCII у строки
        sumString += string[i].charCodeAt() ** 2;
    }

    for(let i = 0; i < string.length - substring.length + 1; i++) {

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
        sumString = sumString - (string[i].charCodeAt() ** 2) + (string[i + substring.length - 1].charCodeAt() ** 2);
    }

    time = performance.now() - time; // Конец работы алгоритма
    if (keys.indexOf('-c') != -1) console.log(`Collision: ${counterCollision}`);
    if (keys.indexOf('-t') != -1) console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
    console.log(arrayIndex);
}


// Hashes: Рабина-Карпа
module.exports.rabinaKarp = async(keys, stringFile, substringFile) => {
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

    for(let i = 0; i < substring.length; i++) {
        // Сумма ASCII у подстроки
        sumSubstring += substring[i].charCodeAt() * (2**(substring.length - i - 1));

        // Сумма ASCII у строки
        sumString += string[i].charCodeAt() * (2**(substring.length - i - 1));
    }

    for(let i = 0; i < string.length - substring.length + 1; i++) {
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
        if (!string[i + substring.length]) continue; // Если последний символ не найден, то ничего не делаем
        sumString = (sumString - string[i].charCodeAt() * (2**(substring.length - 1))) * 2 + string[i + substring.length].charCodeAt();
    }

    
    time = performance.now() - time; // Конец работы алгоритма
    if (keys.indexOf('-c') != -1) console.log(`Collision: ${counterCollision}`);
    if (keys.indexOf('-t') != -1) console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
    console.log(arrayIndex);
}