const fs = require('fs');

module.exports.run = async(keys, stringFile, substringFile) => {
    let time = performance.now(); // Начало работы алгоритма
    const string = fs.readFileSync(stringFile, 'utf8').toLowerCase();
    const substring = fs.readFileSync(substringFile, 'utf8').toLowerCase();
    const arrayIndex = new Array(); // Массив индексов вхождения подстроки в строку
    const arrPrefix = new Array(); // Массив префиксов
    const uniqueSubstringElements = new Array(); // Массив с уникальными элементами подстроки
    const tableResult = new Array(); // Таблица состояний

    arrPrefix.push('');
    let suffixStatus = 0;
    let prefix = ''; let suffix = '';
    for(let i = 0; i < substring.length; i++) {
        prefix += substring[i];
        arrPrefix.push(prefix);

        // Создание суффикса и проверка его равенства префиксу
        suffix = substring[substring.length - i - 1] + suffix;
        if (prefix == suffix && i != substring.length - 1) suffixStatus = i + 1;
        
        // Создание массива из элементов подстроки
        let checkArray = false;
        for(let j = 0; j < uniqueSubstringElements.length; j++) if (substring[i] == uniqueSubstringElements[j]) checkArray = true;

        if (!checkArray) uniqueSubstringElements.push(substring[i]);
    }

    // Создание таблицы автомата
    for(let i = 0; i < arrPrefix.length; i++) {
        tableResult.push(new Array(uniqueSubstringElements.length));

        // Если при сложении i-го префикса состояния и символа
        // Получается слудеющее состояние, то записываем его номер
        // на последнем состоянии смотрим на совпавший суффикс

        for(let j = 0; j < uniqueSubstringElements.length; j++) {
            if (arrPrefix[i] + uniqueSubstringElements[j] == arrPrefix[i + 1]) tableResult[i][j] = i + 1;
            else if (uniqueSubstringElements[j] == arrPrefix[1]) tableResult[i][j] = 1;
            else if (i == arrPrefix.length - 1 && arrPrefix[suffixStatus] + uniqueSubstringElements[j] == arrPrefix[suffixStatus + 1]) tableResult[i][j] = suffixStatus + 1;
            else tableResult[i][j] = 0;
        }
    }
    
    // Сверка строки с таблицей
    let status = 0;
    for(let i = 0; i < string.length + 1; i++) {
        if (status == arrPrefix.length - 1) arrayIndex.push(i - substring.length);
        if (uniqueSubstringElements.indexOf(string[i]) == -1) status = 0;
        else status = tableResult[status][uniqueSubstringElements.indexOf(string[i])];
    }

    
    time = performance.now() - time; // Конец работы алгоритма
    if (keys.indexOf('-t') != -1) console.log(`Time: ${time.toFixed(4)}ms`); // Если был найден ключ на вывод времени работы кода
    if (keys.indexOf('-n') != -1) { // Если был найден ключ на вывод N элементов
        let number = parseInt(keys[keys.indexOf('-n') + 1]); // Получаем следующий элемент. Это количество, сколько элементов надо вывести
        if (number < 0 || isNaN(number)) return console.log('The number of elements per output must be at least 0'); // Ошибка, если количество меньше 0
        console.log(arrayIndex.slice(0, number));
    } else console.log(arrayIndex); // Если не был найден ключ не вывод определённого кол-ва элементов
    if (keys.indexOf('-a')) { // Вывести таблицу
        console.log('The table of the automaton:');
        console.log(' '.repeat(arrPrefix.length), ' | ', uniqueSubstringElements.join(' | '));
        console.log('-'.repeat(20))
        for(let i = 0; i < tableResult.length; i++) { console.log(arrPrefix[i], ' '.repeat(arrPrefix.length - i - 1), ' | ', tableResult[i].join(' | ')); console.log('-'.repeat(20)) };
    }
}