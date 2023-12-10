const fs = require('fs');

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

module.exports.run = async(array) => {
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

    switch(data[1]) {

        case '+': { // Сложение
            break;
        }

        case '-': { // Вычитание

            break;
        }

        default: { // Ошбика
            return console.log('');
        }
    }
};