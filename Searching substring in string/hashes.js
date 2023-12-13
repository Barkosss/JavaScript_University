const fs = require('fs');

/*
-с - помимо списка вхождений вывести число коллизий (только хэши);
-n N, где N - произвольное натуральное число - вывести первые N вхождений;
-t - вывести время работы алгоритма.
*/


// Hashes: Сумма кодов
module.exports.sum = async(keys, stringFile, substringFile) => {
    let time = performance.now(); // Начало работы алгоритма
    let counterCollision = 0;
    const string = fs.readFileSync(stringFile, 'utf8');
    const substring = fs.readFileSync(substringFile, 'utf8');
    
    let arrayIndex = []; // Массив индексов
    // Сумма строки, Сумма подстроки, Счётчик совпадений
    let sumSubstring = 0; let counter;
    for(let i = 0; i < substring.length; i++) {
        // Сумма ASCII у подстроки
        sumSubstring += substring[i].charCodeAt();
    }

    let sumString = 0; // Обнуление суммы строки
    for(let j = 0; j < substring.length; j++) {
        // Сумма ASCII у строки
        sumString += string[j].charCodeAt();
    }

    for(let i = 0; i < string.length - substring.length + 1; i++) {

        if (sumString != sumSubstring) continue // Если сумма не равна
        counterCollision++;
        counter = 0;
        for(let j = 0; j < substring.length; j++) {
            if (string[i + j] != substring[j]) break; // Если какие-то символы не совпадают, то выходим из цикла
            counter++;
        }

        // Если кол-во совпадений равна длине подстроки, то добавляем индекс в массив
        if (counter == substring.length) arrayIndex.push(i);

        sumString = sumString + string[i].charCodeAt() - string[i - substring.length - 1];
    }

    time = performance.now() - time; // Конец работы алгоритма
    if (keys.indexOf('-c') != -1) console.log(`Collision: ${counterCollision}`);
    if (keys.indexOf('-t') != -1) console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
    if (keys.indexOf('-n') != -1) { // Если был найден ключ на вывод N элементов
        let number = parseInt(keys[keys.indexOf('-n') + 1]); // Получаем следующий элемент. Это количество, сколько элементов надо вывести
        if (number < 0 || isNaN(number)) return console.log('The number of elements per output must be at least 0'); // Ошибка, если количество меньше 0
        console.log(arrayIndex.slice(0, number));
    } else console.log(arrayIndex); // Если не был найден ключ не вывод определённого кол-ва элементов
}

console.log('h1');

// Hashes: Сумма квадратов кодов
module.exports.sumSquare = async(keys, stringFile, substringFile) => {
    let time = performance.now(); // Начало работы алгоритма
    let counterCollision = 0;
    const string = fs.readFileSync(stringFile, 'utf8');
    const substring = fs.readFileSync(substringFile, 'utf8');
    
    let arrayIndex = []; // Массив индексов
    // Сумма строки, Сумма подстроки, Счётчик совпадений
    let sumSubstring = 0; let counter;
    for(let i = 0; i < substring.length; i++) {
        // Сумма ASCII у подстроки
        sumSubstring += substring[i].charCodeAt() ** 2;
    }

    let sumString = 0; // Обнуление суммы строки
    for(let j = 0; j < substring.length; j++) {
        // Сумма ASCII у строки
        sumString += string[j].charCodeAt() ** 2;
    }

    for(let i = 0; i < string.length - substring.length + 1; i++) {

        if (sumString != sumSubstring) continue // Если сумма не равна
        counter = 0;
        counterCollision++;
        for(let j = 0; j < substring.length; j++) {
            if (string[i + j] != substring[j]) break; // Если какие-то символы не совпадают, то выходим из цикла
            counter++;
        }

        // Если кол-во совпадений равна длине подстроки, то добавляем индекс в массив
        if (counter == substring.length) arrayIndex.push(i);

        sumString = sumString + (string[i].charCodeAt() ** 2) - (string[i - substring.length - 1].charCodeAt() ** 2);
    }

    time = performance.now() - time; // Конец работы алгоритма
    if (keys.indexOf('-c') != -1) console.log(`Collision: ${counterCollision}`);
    if (keys.indexOf('-t') != -1) console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
    if (keys.indexOf('-n') != -1) { // Если был найден ключ на вывод N элементов
        let number = parseInt(keys[keys.indexOf('-n') + 1]); // Получаем следующий элемент. Это количество, сколько элементов надо вывести
        if (number < 0 || isNaN(number)) return console.log('The number of elements per output must be at least 0'); // Ошибка, если количество меньше 0
        console.log(arrayIndex.slice(0, number));
    } else console.log(arrayIndex); // Если не был найден ключ не вывод определённого кол-ва элементов
}


// Hashes: Рабина-Карпа (Новое)
module.exports.rabinaKarp = async(keys, stringFile, substringFile) => {


}


// Hashes: Рабина-Карпа
module.exports.rabinaKarp = async(keys, stringFile, substringFile) => {
    var time = performance.now(); // Начало работы алгоритма
    let counterCollision = 0;
    const string = fs.readFileSync(stringFile, 'utf8');
    const substring = fs.readFileSync(substringFile, 'utf8');
    
    let arrayIndex = [];
    let sumSubstring = 0;
    for(let i = 0; i < substring.length; i++) {
        sumSubstring += substring[i].charCodeAt() * 2 ** (substring.length - i - 1) // Сумма хэшей у подстроки
    }

    let sumString = 0;
    for(let i = 0; i < substring.length; i++) {
        sumString += string[i].charCodeAt() * 2 ** (substring.length - i - 1);
    }
    for(let i = 0; i < string.length - substring.length + 1; i++) {
        console.log('let:'+string[i], sumString, sumSubstring, i);

        if (sumString != sumSubstring) { // Если сумма не равна
            sumString = sumString * 2 + string[i + 1].charCodeAt() - string[i].charCodeAt() * 2**substring.length;
            continue
        }
        counter = 0;
        counterCollision++;
        for(let j = 0; j < substring.length; j++) {
            if (string[i + j] != substring[j]) { // Если какие-то символы не совпадают, то выходим из цикла
                console.log('break:', 'i+j:'+string[i+j], 'i:'+string[i], 'j:'+substring[j], sumString, sumSubstring, i, j);
                sumString = sumString * 2 + string[i + 1].charCodeAt() - string[i].charCodeAt() * 2**substring.length;
                break;
            }
            counter++;
        }

        // Если кол-во совпадений равна длине подстроки, то добавляем индекс в массив
        if (counter == substring.length) arrayIndex.push(i);

        sumString = sumString * 2 + string[i + 1].charCodeAt() - string[i].charCodeAt() * 2**substring.length;
    }
    
    time = performance.now() - time; // Конец работы алгоритма
    if (keys.indexOf('-c') != -1) console.log(`Collision: ${counterCollision}`);
    if (keys.indexOf('-t') != -1) console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
    if (keys.indexOf('-n') != -1) { // Если был найден ключ на вывод N элементов
        let number = parseInt(keys[keys.indexOf('-n') + 1]); // Получаем следующий элемент. Это количество, сколько элементов надо вывести
        if (number < 0 || isNaN(number)) return console.log('The number of elements per output must be at least 0'); // Ошибка, если количество меньше 0
        console.log(arrayIndex.slice(0, number));
    } else console.log(arrayIndex); // Если не был найден ключ не вывод определённого кол-ва элементов
}