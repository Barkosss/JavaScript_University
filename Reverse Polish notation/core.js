const fs = require('fs');
// 0 - низкий приоритет (+ | -)
// 1 - средний приоритет (* | /)
// 2 - высокий приоритет (^)
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

// Справочник
if (!threeArgv || threeArgv.toLowerCase() == 'help') {
    console.log('------ HELP ------');
    console.log('#1 Usage example:');
    console.log('- You can specify an expression in the arguments in the terminal. Example: node core.js (2 + 5) * 10');
    console.log('------------------');
    console.log('#2 Usage example:');
    console.log('- You can specify an expression in the file that you will pass in the arguments. Example: node core.js expression.js');
    console.log('------ HELP ------');
    return;
}
// Если выражение указано в файле
else if (threeArgv.endsWith('.txt')) {
    let fileName = threeArgv;
    expression = fs.readFileSync(fileName, 'utf8').trim().split(' ').join('');

// Если выражение указано в терминале
} else {
    expression = process.argv.slice(2).join('');
}
const stack = [];
const heap = [];

/* Пример:
5 * 2                    --->       5 2 *
(5 + 2) * 5              --->       5 2 + 5 *
(5 + 2 - 1) * (5 + 2)    --->       5 2 + 1 - 5 2 + *
(2 + 5 * 2) * 5 + 2      --->       2 5 2 * + 5 * 2 +
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
            let number = parseInt(expression[index]);
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
console.log('heap', heap);

let answer = 0;
let left = 0; let right = 1; let oper = 2;
while(heap.length) {

    // Если первый и второй аргумент являются числами, а третий - операцией
    if (Number.isInteger(heap[left]) && Number.isInteger(heap[right]) && priority[heap[oper]]) {
        
    }
}

// Вывод ответа
console.log('Answer:', answer);

/* Тесты

1. ( 8 + 2 * 5 ) / ( 1 + 3 * 2 - 4 ) - 5 + ( 9 / ( 1 + 2 ) + 1 ) * 3
2. ( 6 + 10 - 4 ) / ( 1 + 1 * 2 ) + 1
3. ( ( 7 - 6.35 ) / 6.5 + 9.9 ) / ( ( 1.2 / 36 + 1.2 / 0.25 - 21 / 16 ) / ( 169 / 24 ) )

*/