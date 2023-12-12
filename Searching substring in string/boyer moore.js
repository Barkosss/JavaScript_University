const fs = require('fs');

module.exports.run = async(keys, stringFile, substringFile) => {
    let time = performance.now(); // Начало работы алгоритма
    const string = fs.readFileSync(stringFile, 'utf8').toLowerCase();
    const substring = fs.readFileSync(substringFile, 'utf8').toLowerCase();
    let arrayIndex = [];

    let lastNumberOfChar = new Array(256);
    for(let i = 0; i < substring.length; i++) lastNumberOfChar[substring[i]] = i;

    for(let index = 0; index < string.length; index++) {
        let shift = -1; // Сдвиг
        let cpIndex = 0;
        let control = true;
        for(let j = substring.length; j > -1; j--) {
            if (string[index + j] != substring[j]) {
                cpIndex = index;
                control = false;
                if (!(substring.length - 1 - index)) shift = substring.length - 1 - index;
                break;
            }
        }
        if (control) arrayIndex.push(index);
        index += Math.max(1, substring.length - lastNumberOfChar[string[index + cpIndex]] - 1 - shift);
    }

    time = performance.now() - time; // Конец работы алгоритма
    if (keys.indexOf('-t') != -1) console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
    if (keys.indexOf('-n') != -1) { // Если был найден ключ на вывод lastNumberOfChar элементов
        let number = parseInt(keys[keys.indexOf('-n') + 1]); // Получаем следующий элемент. Это количество, сколько элементов надо вывести
        if (number < 0 || isNaN(number)) return console.log('The number of elements per output must be at least 0'); // Ошибка, если количество меньше 0
        console.log(arrayIndex.slice(0, number));
    } else console.log(arrayIndex); // Если не был найден ключ не вывод определённого кол-ва элементов
}