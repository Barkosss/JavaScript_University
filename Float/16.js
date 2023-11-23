//Представление чисел с плавающей точкой. Стандарт IEEE 754

function call(number) {  
    let sign = (number < 0) ? 1 : 0;
    number = Math.abs(number)
    let whole = Math.floor(number);
    let fractional;

    if (whole != number) {
        fractional = Number('0.' + String(number).split('.')[1]);
    } else {
        fractional = 0;
    }
    frac.push(fractional);
    let wholeBin = toBinWhole(whole);
    let lenWholeBin = wholeBin.length;

    order = (lenWholeBin > 0) ? lenWholeBin - 1 : (-1);
    let fractionalBin = toBinFraction(fractional, lenWholeBin)
    let orderBin = toBinWhole(order + 127);
    let float = assembling(sign, orderBin, wholeBin, fractionalBin)
    
    orders.push(order);
    return float;
}

function toBinWhole (whole) {
    let wholeBin = whole.toString(2);
    return wholeBin;   
} 

function toBinFraction (fractional, lenWholeBin) {
    let fractionalBin = '';  
    let flag = (lenWholeBin > 0) ? true : false;
    if (fractional) { 
        for (let i = 0; i < 24-lenWholeBin; i++) {
            if (Math.floor(fractional*2) == 1) flag = true;
            if (flag == false) {
                i--;
                order--;
            }
            else {
                fractionalBin += Math.floor(fractional*2);          
            }   
            fractional = Number('0.' + String(fractional*2).split('.')[1]);
            if (isNaN(fractional)) break;
        }
    } else {
        if (lenWholeBin > 24) {
            fractionalBin = '';
            return fractionalBin; 
        } else {
            fractionalBin = '0'.repeat(24-lenWholeBin)
        }
    }
    fractionalBin += '0'.repeat(24 - lenWholeBin - fractionalBin.length)
    return fractionalBin;   
}

function assembling(sign, orderBin, wholeBin, fractionalBin) {
    let float = sign;
    float += '0'.repeat(8 - orderBin.length) + orderBin;
    if (wholeBin > 0) {
        float += wholeBin.slice(1, wholeBin.length) + fractionalBin;
    } else {
        float += fractionalBin.slice(1, fractionalBin.length);
    }
    float = float.slice(0, 32);
    return float;
}

function binToDec(orderBin) {
    let order = 0;
    let two = 1;
    for (let i = orderBin.length - 1; i >= 0; i--) {
        order += Number(orderBin[i]) * two;
        two *= 2;
    }
    return order -= 127;  
}

function toDecFloat(conversion) {
    let mantissaBin = conversion.slice(9, 32);
    let orderBin = conversion.slice(1, 9);
    let sign = conversion[0];
    let order = binToDec(orderBin);
    let mantissa = 0;
    two = 0.5;
    for (let i = 0; i < mantissaBin.length; i++) {
        mantissa += Number(mantissaBin[i]) * two;
        two *= 0.5
    }

    let decimal = (1 + mantissa) * Math.pow(2, order) * Math.pow((-1), sign);
    return decimal;
}

function notEqual(first, second) {
    let difference = orders[0] - orders[1];
    second = first.slice(0,9) + '0'.repeat(difference - 1) + '1' + second.slice(9, 32 - difference);
    return second;
}

function addition(first, second) {
    let gain = 1;
    let sum = '';
    let trim = 30;
    if (first.slice(1,9) != second.slice(1,9)) {
        trim = 31;
        gain = 0;
        second = notEqual(first, second);
    }

    let dop = 0;
    for (let i = trim; i >= trim - 22; i--) {
        let amount = Number(first[i]) + Number(second[i]);
        sum = String((amount + dop) % 2) + sum;
        dop = Math.floor((amount + dop) / 2);
    }
    if (dop >= 1) {
        if (gain == 1);
        else sum = '0' + sum.slice(0, 23);
        gain++;
    }

    if (gain >= 1) {
        return first[0] + toBinWhole(binToDec(first.slice(1, 9))+128) + sum;
    }
    return first.slice(0,9) + sum;
}

function subtraction(first, second) {
    let gain = -1;
    let diff = '';
    if (first.slice(1,9) != second.slice(1,9)) {
        second = notEqual(first, second);
        flag = true;
        gain = 0;
    } 

    let dop = 0;
    for (let i = 31; i >= 9; i--) {
        let amount = Number(first[i]) - Number(second[i]);
        diff = String((Math.abs(amount - dop)) % 2) + diff;
        dop = ((amount + dop) >= 0) ? 0 : -1;        
    }

    if (gain == -1 || (gain == 0 && dop == -1)) {
        let i; 
        for (i = 0; diff[i] == '0'; i++) {
            gain--;
        }
        if (dop == -1) {
            i++;
            gain--;
        }
        if (orders[0] == orders[1]) {
            i++;
        }
        diff = diff.slice(i, 31) + '0'.repeat(i);
      
    }
    let tempOrder = toBinWhole(binToDec(first.slice(1, 9)) +  127 + gain);
    let sign = (string[0] > string[2]) ? '0' : '1';
    return sign + '0'.repeat(8 - tempOrder.length) + tempOrder + diff;   
}
let result = '';

let fs = require('fs')
let data = fs.readFileSync("input.txt", "utf8")
result += data + '\n\n';
let string = data.split(' ');
let order;
let orders = []; 
if (string[1] == '-') {
    string[2] *= -1;
}
if (Math.abs(string[0]) < Math.abs(string[2])) {
    [string[0], string[2]] = [string[2], string[0]];
    if (string[2] > 0 && string[1] == '-') {
        string[1] = '+';
    } 
}
let frac = [];
let first = call(Number(string[0]));
string[0] = String(string[0]);
result += string[0] + ': ' + first + '\n';
let second = call(Number(string[2]));
result += string[2] + ': ' + second + '\n\n'; 
let answer;



// 1) сложение (при двух одинаковых знаках)
if ((string[0][0] == string[1]) || (string[1] == '+' && string[0][0] != '-' && string[2][0] != '-'))  {
    answer = addition(first, second);
    result += answer + '\n';
// 2) вычитание (при двух разных знаках)
} else {
    answer = subtraction(first, second); 
    result += answer + '\n';
}
result += String(toDecFloat(answer));
fs.writeFileSync('result.txt', result);
console.log("Успешно! Результат загружен в файл result.txt");
