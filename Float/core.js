const fs = require('fs');
const inputFile = process.argv[2];
if (!inputFile) return console.log(`Specify the name of the txt file`);
if (!fs.existsSync(inputFile)) return console.log(`File "${inputFile}" not found`);
const content = fs.readFileSync(inputFile, 'utf-8');
const argv = content.split(/[ ,]+/);
if (!content.length) return console.log(`Less than one or more than three arguments are specified`);

// Перевод числа во Float запись
function ConvertToFloat(number) {
    let MaxNumber = (2 - 2 ** (-23)) * 2 ** 127;
    if (isNaN(Number(number))) { // NaN
        return ['11111111101010101010101010101010', 'NaN'];
    } else if (Math.abs(Number(number)) > MaxNumber) { // Бесконечное число (Плюс / Минус)
        return [1 * (Number(number) < 0) + '1111111100000000000000000000000', (Number(number) < 0) ? ('-') : ('+') + ' Бесконечность']
    } else if (Number(number) == 0) { // 0
        return ['10000000000000000000000000000000', '0'];
    } else if (Number(number) % 1 == 0) {
        return [ConvertIntToBin(number), number];
    }

    let memory = Array.from({ length: 32 }, () => 0);
    // Если число отрицательно
    if (number[0] == '-') {
        memory[0] = 1;
        number = number.slice(1);
    }
    let intPart = number.toString().split('.')[0]; // Целая часть
    let fractPart = '0.' + number.toString().split('.')[1]; // Дробная часть
    let intPartToBin = ConvertIntToBin(intPart); // Перевод целой части в двоичную
    let fractPartToBin = ConvertFractToBin(fractPart); // Перевод дробной части в двоичную
    let numberToBin = intPartToBin + '.' + fractPartToBin; // Число в двоичную запись
    let degreeNumber = (intPartToBin.length - numberToBin.indexOf('1') - 1) + 127; // Степень
    let degreeToBin = ConvertIntToBin(degreeNumber); // Перевод степени в двоичную запись
    let Mantissa = intPartToBin.slice(intPartToBin.indexOf('1'), intPartToBin.length) + fractPartToBin;
    Mantissa = Mantissa + '0'.repeat((24 - Mantissa.length <= 0) ? (0) : (24 - Mantissa.length));
    degreeToBin = '0'.repeat(8 - degreeToBin.length) + degreeToBin;

    for(let i = 0; i < 9; i++)
        memory[i + 1] = parseInt(degreeToBin[i]);

    for(let i = 0; i < 24; i++)
        memory[i + 9] = parseInt(Mantissa[i]);

    return [memory.join(''), ConvertBinToNumber(memory)];
}

// Конвертация из Двоичных записи в число
function ConvertBinToNumber(memory) { // ОШИБКА
    let result = ((-1) ** memory[0]) * (parseFloat('1.' + memory.slice(1, 9).join('')).toFixed(8)) * (10 ** Number(ConvertBinToInt(memory.slice(9, 24).join(''))));
    return result;
}

// Конвертировать целую часть в двоичную запись
function ConvertIntToBin(number) {
    if (number == 0) return '0';
    let result = '';
    while(number > 0) {
        result = (number % 2) + result;
        number = Math.floor(number / 2);;
    }
    return result;
}

// Конвертировать дробную часть в двоичную запись
function ConvertFractToBin(number) {
    number = parseFloat(number);
    let result = '';
    while(Math.floor(number) != 1) {
        result += (Math.floor(number * 2)).toString();
        number *= 2;
    }
    return result;
}

function ConvertBinToInt(number) {
    let result = 0;
    for(let i = number.length - 1; i >= 0; i--) {
        result += number[i] * 2**i;
    }
    return result;
}

switch(argv.length) {

    case 1: { // Перевод
        let numberToBin = ConvertToFloat(argv[0]);

        console.log('Result:', numberToBin[0], '\nInt:', numberToBin[1]);
        break;
    }

    case 3: { // Выражение

        break;
    }

    default: {
        console.log(`Incorrect number of arguments`);
        break;
    }
}