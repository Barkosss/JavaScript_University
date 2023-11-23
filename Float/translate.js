// ПРЕОБРАЗОВАНИЕ ВО FLOAT

const fs = require('fs');

/* СТАНДАРТ КОДИРОВАНИЯ IEEE-754

(-1) ^ S x 1.M x 10^E -- Экспоненциальная запись чисела
S - Знак (Положительный или Отрицательный)
M - Мантисса ()
E - ЭКспонента ()

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
    // 1 бит под знак
    // 8 бита под целую часть
    // 23 бита под дробную часть
    const memory = Array.from({ length: 32 }, () => 0); // Массив, длиной 32 бита, заполненный нулями
    if (float[0] == '-') { memory[0] = 1; float = float.slice(1); } // Если число отрицательно
    var int = parseInt(float.split('.')[0]); // Целая часть
    var decimal = parseFloat('0.' + float.split('.')[1]); // Дробная часть
    var intBin = intToBin(int);
    var decimalBin = floatToBin(decimal);
    var floatBin = intBin + decimalBin;
    var degree = floatBin.indexOf('.') - floatBin.indexOf('1');
    var fractionalPart = Number(floatBin + '0'.repeat(23 - floatBin.length)).toString();
    console.log('0.', float);
    console.log('1.', intBin, decimalBin);
    console.log('2.', floatBin, degree, fractionalPart);

    for (let i = 1; i < memory.length - 1; i++) memory[i] = fractionalPart[i];
    console.log(memory)
};