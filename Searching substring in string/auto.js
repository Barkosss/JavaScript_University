const fs = require('fs');

module.exports.run = async(stringFile, substringFile) => {
    let time = performance.now(); // Начало работы алгоритма
    const string = fs.readFileSync(stringFile, 'utf8').toLowerCase();
    const substring = fs.readFileSync(substringFile, 'utf8').toLowerCase();

    // ...
    
    time = performance.now() - time; // Конец работы алгоритма
    if (keys.indexOf('-t') != -1) console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
    if (keys.indexOf('-n') != -1) { // Если был найден ключ на вывод N элементов
        let number = parseInt(keys[keys.indexOf('-n') + 1]); // Получаем следующий элемент. Это количество, сколько элементов надо вывести
        if (number < 0 || isNaN(number)) return console.log('The number of elements per output must be at least 0'); // Ошибка, если количество меньше 0
        console.log(arrayIndex.slice(0, number));
    } else console.log(arrayIndex); // Если не был найден ключ не вывод определённого кол-ва элементов
}