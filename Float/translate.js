// ПРЕОБРАЗОВАНИЕ ВО FLOAT

const fs = require('fs');

/* СТАНДАРТ КОДИРОВАНИЯ IEEE-754

(-1) ^ S x 1.M x 10^E -- Экспоненциальная запись чисела
S - Знак (Положительный или Отрицательный)
M - Мантисса ()
E - Экспонента ()

+беск: 0 11111111 00000000000000000000000
-беск: 1 11111111 00000000000000000000000
NaN: 1 11111111 01010110000011010100000 (Не имеет значения, что хранится в дробной части)

- АЛГОРИТМ:

### Целая часть:
Переводим целую часть в двоичный код
И записываем результат в раздел "Целая часть"

### Дробная часть:


*/

// Из целого числа в двоичную запись
const intToBin = (number) => {
    if (number == 0) return '0';
    let bin = '';
    while (number > 0) {
        bin = (number % 2).toString() + bin;
        number = Math.floor(number / 2);
    }
    return bin;
};

// Из вещественного числа в двоичную запись
const floatToBin = (number) => {
    let bin = '';
    while (number % 1 != 0) {
        bin += (Math.floor(number * 2)).toString();
        number *= 2;
    }
    return bin;
};

module.exports.run = async (float) => {
    // ------------ ПЕРЕВОД ИЗ ДЕСЯТИЧНОЙ В ДВОИЧНУЮ ------------
    // 1 бит под знак
    // 8 бита под целую часть
    // 23 бита под дробную часть
    const memory = Array.from({ length: 32 }, () => 0); // Массив, длиной 32 бита, заполненный нулями
    if (float[0] == '-') { memory[0] = 1; float = float.slice(1); } // Если число отрицательно
    var int = parseInt(float.split('.')[0]); // Целая часть
    var decimal = parseFloat('0.' + float.split('.')[1]); // Дробная часть
    var binInt = intToBin(int); // Двоинчая запись целой части числа
    var binDecimal = floatToBin(decimal); // Двоичная запись дробной части числа
    var bitFloat = binInt + binDecimal; // Двоичная запись дробного числа
    var movePoint = binInt.length + 1 - bitFloat.indexOf('1'); // Индекс первого вхождения цифры 1

    // Если бесконечное число
    if (binInt.length > 8) for(let i = 1; i < 8; i++) memory[i] = 1;
    // Если не бесконечное число
    else for(let i = 1; i < 8; i++) for(let i = 1; i < 8; i++) memory[i] = Number(binInt[i - 1]);

    // ...
    
    
    console.log(`${float} (10) -> ${memory.join('')} (2)`);
    // ------------ ПЕРЕВОД ИЗ ДЕСЯТИЧНОЙ В ДВОИЧНУЮ ------------



    // ------------ ПЕРЕВОД ИЗ ДВОИЧНОЙ В ДЕСЯТИЧНУЮ ------------
    let bitSign = memory[0]; // Бит знака
    let bitInt = memory.slice(1, 8); // Биты целой части числа
    let bitDecimal = memory.slice(9, 32); // Биты дробной части числа
    // ...
    let bitFloat = (-1) ** bitSign * Number(`1.${bitInt}`) * 
    // ...
    console.log(`${memory.join('')} (2) -> ${0} (10)`)
    // ------------ ПЕРЕВОД ИЗ ДВОИЧНОЙ В ДЕСЯТИЧНУЮ ------------
};