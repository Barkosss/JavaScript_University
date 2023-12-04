const fs = require('fs');


/*
-n N, где N - произвольное натуральное число - вывести первые N вхождений;
-t - вывести время работы алгоритма.
*/


// Brute Force
module.exports.run = async(keys, stringFile, substringFile) => {
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
    }

    time = performance.now() - time; // Конец работы алгоритма
    if (keys.indexOf('-t') != -1) console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
    if (keys.indexOf('-n') != -1) { // Если был найден ключ на вывод N элементов
        let number = parseInt(keys[keys.indexOf('-n') + 1]); // Получаем следующий элемент. Это количество, сколько элементов надо вывести
        if (number < 0 || isNaN(number)) return console.log('The number of elements per output must be at least 0'); // Ошибка, если количество меньше 0
        console.log(arrayIndex.slice(0, number));
    } else console.log(arrayIndex); // Если не был найден ключ не вывод определённого кол-ва элементов
}