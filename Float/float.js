let fs = require('fs');

if (process.argv.length ==  2 || !process.argv[2].length) {
    return console.log('Данные указаны некорректно!');
}
let number = process.argv[2];

function creat(number) {
    number = parseFloat(eval(number));
    let res = "";
    let makc = (2 - 2 ** (-23)) * 2 ** 127;
    let min = -1 * ((2 - 2 ** (-23)) * 2 ** 127);
    let denom = 2 ** (-126);
    let arr = new Array(23).fill(0);
    if (number < denom) {
        for (let i = -1; i >= -23; i--) {
            if (number == denom * (2 ** i)) {
                arr[-126 - (-126 + i) - 1] = 1;
                res = res + "000000000" + arr.join('');
                return console.log("Искомое выражение: ", res); 
            }
        }
    }
    if (isNaN(number)) {
        res = "01111111100100010000000000000000";
        return console.log("Искомое выражение:", res);
    }
    if (number > makc) {
        res = "011111111000000000000000000000000";
        return console.log("Искомое выражение:", res);
    }
    if (Math.abs(number) > Math.abs(min)) {
        res = "111111111000000000000000000000000";
        return console.log("Искомое выражение:", res);
    }
    if (number < 0) {
        res += "1";
    }
    else {
        res += "0";
    }
    number = Math.abs(parseFloat(number).toString(2));
    let copyNumber = number;
    let count1 = 0;
    if (number < 1) {
        while (Math.abs(number * 10 ** count1) < 1) {
            count1++;
        }   
    }
    else {
        while (Math.floor(number) !== 1) {
            number = (number / 10).toFixed(number.toString().length - number.toString().indexOf("."));
            count1++; 
        }
    }  
    if (Math.abs(copyNumber) < 1) { 
        number = "1." + number.toString().slice(count1 + 2, number.toString().length);
        res = res + "0".repeat(8 - (-count1 + 127).toString(2).length) + (-count1 + 127).toString(2);
        if (number.length - 2 <= 23) {
            res = res + number.slice(2, number.length) + "0".repeat(23 - (number.length - 2));
        }
        else {
            res += number.slice(2,25);
        } 
    } 

    else {
        res = res + "0".repeat(8 - (count1 + 127).toString(2).length) + (count1 + 127).toString(2);
        if (number.toString().length - 2 <= 23) {
            res = res + number.toString().slice(2, number.toString().length) + "0".repeat(23 - (number.toString().length - 2));
        }
        else {
            res += number.toString().slice(2,25);
        }
    }
    return console.log("Искомое выражение:", res);
}

creat(number);

