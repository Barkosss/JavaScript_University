const fs = require('fs');

const priority = {
    '(': 0,
    ')': 0,
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    'd': 3,
    '^': 3
};
var expression;
let threeArgv = process.argv[2];

// Функция для замены всех входящих элементов в строке
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function help() {
    console.log('------ HELP ------');
    console.log('#1 Usage example:');
    console.log('- You can specify an expression in the arguments in the terminal. Example: node core.js (2 + 5) * 10');
    console.log('------------------');
    console.log('#2 Usage example:');
    console.log('- You can specify an expression in the file that you will pass in the arguments. Example: node core.js exp.js');
    console.log('------ HELP ------');
    return;
}

// Справочник
if (!threeArgv || threeArgv.toLowerCase() == 'help') help();

// Если выражение указано в файле
else if (threeArgv.endsWith('.txt')) {
    let fileName = threeArgv;
    expression = fs.readFileSync(fileName, 'utf8').trim()
        .replaceAll('(', ' ( ')
        .replaceAll(')', ' ) ')
        .replaceAll('+', ' + ')
        .replaceAll('-', ' - ')
        .replaceAll('*', ' * ')
        .replaceAll('/', ' / ')
        .replaceAll('^', ' ^ ')
        .replaceAll('d', ' d ').toLowerCase();
    if (!expression.length) return help();
    expression = expression.split(' ');

// Если выражение указано в терминале
} else {
    expression = process.argv.slice(2)[0]
        .replaceAll('(', ' ( ')
        .replaceAll(')', ' ) ')
        .replaceAll('+', ' + ')
        .replaceAll('-', ' - ')
        .replaceAll('*', ' * ')
        .replaceAll('/', ' / ')
        .replaceAll('^', ' ^ ')
        .replaceAll('d', ' d ').toLowerCase().split(' ');
}
const stack = [];
let heap = [];

/* Пример:
5 * 2                    --->       5 2 *               ---> (10)
(5 + 2) * 5              --->       5 2 + 5 *           ---> (35)
(5 + 2 - 1) * (5 + 2)    --->       5 2 + 1 - 5 2 + *   ---> (42)
(2 + 5 * 2) * 5 + 2      --->       2 5 2 * + 5 * 2 +   ---> (62)
*/

/* Тесты

1. ( 8 + 2 * 5 ) / ( 1 + 3 * 2 - 4 ) - 5 + ( 9 / ( 1 + 2 ) + 1 ) * 3 = 13
2. ( 6 + 10 - 4 ) / ( 1 + 1 * 2 ) + 1 = 5
3. ( ( 7 - 6.35 ) / 6.5 + 9.9 ) / ( ( 1.2 / 36 + 1.2 / 0.25 - 21 / 16 ) / ( 169 / 24 ) ) = 20

*/

// Формарование стэка и выходных данных
for(let index = 0; index < expression.length; index++) {

    switch(expression[index]) {

        case '(': { // Открытие скобки
            stack.push('('); // Добавляем в стэк скобку
            break;
        }

        case ')': { // Закрытие скобки
            while(stack.length && stack[stack.length - 1] != '(') {
                heap.push(stack[stack.length - 1]); // Добавляем последний элемент из массива stack в массив heap
                stack.pop(); // Удаляем последний элемент из массива
            }
            stack.pop(); // Удаляем '(' из массива stack
            break;
        }

        case '+': { // Сложение
            // Если попалась операция, которая имеет выше приоритетом, чем последняя операци в стэке
            if (!stack.length || priority[expression[index]] > priority[stack[stack.length - 1]]) stack.push(expression[index]);
            // Если попалась операция, которая имеет не выше приоритет
            else {
                while(stack.length && stack[stack.length - 1] != '(') {
                    heap.push(stack[stack.length - 1]);
                    stack.pop();
                }
                stack.push(expression[index]);
            }
            break;
        }

        case '-': { // Вычитание
            // Если попалась операция, которая имеет выше приоритетом, чем последняя операци в стэке
            if (!stack.length || priority[expression[index]] > priority[stack[stack.length - 1]]) stack.push(expression[index]);
            // Если попалась операция, которая имеет не выше приоритет
            else {
                while(stack.length && stack[stack.length - 1] != '(') {
                    heap.push(stack[stack.length - 1]);
                    stack.pop();
                }
                stack.push(expression[index]);
            }
            break;
        }

        case '*': { // Умножение
            // Если попалась операция, которая имеет выше приоритетом, чем последняя операци в стэке
            if (!stack.length || priority[expression[index]] > priority[stack[stack.length - 1]]) stack.push(expression[index]);
            // Если попалась операция, которая имеет не выше приоритет
            else {
                while(stack.length && stack[stack.length - 1] != '(') {
                    heap.push(stack[stack.length - 1]);
                    stack.pop();
                }
                stack.push(expression[index]);
            }
            break;
        }

        case '/': { // Деление
            // Если попалась операция, которая имеет выше приоритетом, чем последняя операци в стэке
            if (!stack.length || priority[expression[index]] > priority[stack[stack.length - 1]]) stack.push(expression[index]);
            // Если попалась операция, которая имеет не выше приоритет
            else {
                while(stack.length && stack[stack.length - 1] != '(') {
                    heap.push(stack[stack.length - 1]);
                    stack.pop();
                }
                stack.push(expression[index]);
            }
            break;
        }

        case 'd': {}
        case '^': { // Степень
            stack.push(expression[index]);
            break;
        }

        default: { // Если не операция
            if (!expression[index].length) break;
            let number = parseFloat(expression[index]);
            if (isNaN(number)) return console.log(`Unknown operation or multiplier: ${expression[index]}`);
            heap.push(number);
            break;
        }
    }
}

// Остатки элементов в stack записываем в heap
while(stack.length) {
    heap.push(stack[stack.length - 1]);
    stack.pop();
}

console.log(':', heap.join(' '));

let index = 0;
while(heap.length != 1) {

    // Если первый и второй аргумент являются числами, а третий - операцией
    let result;
    if (!isNaN(Number(heap[index])) && !isNaN(Number(heap[index + 1])) && (heap[index + 2] in priority)) {
        let leftNumber = heap[index]; let rightNumber = heap[index + 1];
        result = 0;
        switch(heap[index + 2]) {
            case '+': { result = leftNumber + rightNumber; break; }
            case '-': { result = leftNumber - rightNumber; break; }
            case '*': { result = leftNumber * rightNumber; break; }
            case '/': { result = leftNumber / rightNumber; break; }
            case '^': {}
            case 'd': { result = leftNumber ** rightNumber; break; }
        }
        heap[index] = result;
        heap = heap.slice(0, index + 1).concat(heap.slice(index + 3, heap.length));
        index = 0;
    } else {
        index++;
    }
}

// Вывод ответа
console.log('Answer:', heap[0]);