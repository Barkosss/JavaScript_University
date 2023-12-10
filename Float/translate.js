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

// Из двоичной записи в целую часть
const binToInt = (number) => {
    let result = 0;
    for(let i = 0; i < number.length; i++) result += 2**i * parseInt(number[i]);
    return result;
}

// Из двоичной в веществунную часть
const binToFloat = (number) => {
    let result = 0;
    for(let i = -1; i > number.length; i--) result += 2**i * parseInt(number[i]);
    return result;
}

module.exports.run = async (float) => {
    // ------------ ПЕРЕВОД ИЗ ДЕСЯТИЧНОЙ В ДВОИЧНУЮ ------------
    // 1 бит под знак
    // 8 бита под целую часть
    // 23 бита под дробную часть
    const memory = Array.from({ length: 32 }, () => 0); // Массив, длиной 32 бита, заполненный нулями
    if (float[0] == '-') { memory[0] = 1; float = float.slice(1); } // Если число отрицательно
    let int = parseInt(float.split('.')[0]); // Целая часть
    let decimal = parseFloat('0.' + float.split('.')[1]); // Дробная часть
    let binInt = intToBin(int); // Двоинчая запись целой части числа
    let binDecimal = floatToBin(decimal); // Двоичная запись дробной части числа
    let binFloat = binInt + binDecimal; // Двоичная запись дробного числа
    let movePoint = binFloat.indexOf('1') + 1; // Сдвиг точки
    let degreeFloat = binInt.length - binFloat.indexOf('1') - 1;
    let degreeFloatBin = intToBin(degreeFloat + 127);
    let binDecimalFloat = binFloat.slice(movePoint, binFloat.length);
    let resultFloat = memory[0] + degreeFloatBin + binDecimalFloat + '0'.repeat(23 - binDecimalFloat.length);
    
    // Целая часть
    for(let i = 0; i < 32; i++) 
        memory[i] = parseInt(resultFloat[i]);
    
    console.log(`${float} (10) -> ${memory.join('')} (2)`);
    let result = `${memory.join('')} (2) -> ${0} (10)`;
    // ------------ ПЕРЕВОД ИЗ ДЕСЯТИЧНОЙ В ДВОИЧНУЮ ------------



    // ------------ ПЕРЕВОД ИЗ ДВОИЧНОЙ В ДЕСЯТИЧНУЮ ------------
    //let bitSign = memory[0]; // Бит знака
    //let bitDegree = memory.slice(1, 9).join(''); // Биты целой части числа
    //let bitDecimal = memory.slice(9, 32).join(''); // Биты дробной части числа
    //let intDegreeBin = intToBin(binToInt(bitDegree) - 127);
    //let resultNumber = (((-1) ** bitSign) * (1 + ('0.' + bitDecimal)) * (10 ** intDegreeBin)).toString();
    //console.log(resultNumber);
    //resultNumber = binToInt(resultNumber.split('.')[0]) + binToFloat(resultNumber.split('.')[1])
    //console.log(`${memory.join('')} (2) -> ${resultNumber} (10)`);
    // ------------ ПЕРЕВОД ИЗ ДВОИЧНОЙ В ДЕСЯТИЧНУЮ ------------

    //fs.writeFileSync('result.txt', result + '\n' + `${memory.join('')} (2) -> ${0} (10)`);
};