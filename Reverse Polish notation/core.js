const fs = require('fs');


/* Пример:
5 * 2                           --->       5 2 *                       ---> (10)
(5 + 2) * 5                     --->       5 2 + 5 *                   ---> (35)
(5 + 2 - 1) * (5 + 2)           --->       5 2 + 1 - 5 2 + *           ---> (42)
(2 + 5 * 2) * 5 + 2             --->       2 5 2 * + 5 * 2 +           ---> (62)
(5 * 3 + ( -5 * 5 ) * 7 + 5)    --->       5 3 * -5 5 * 7 * + 5 +     ---> (−155)
*/

/* Тесты

1. ( 6 + 10 - 4 ) / ( 1 + 1 * 2 ) + 1 = 5
2. ( ( 7 - 6.35 ) / 6.5 + 9.9 ) / ( ( 1.2 / 36 + 1.2 / 0.25 - 21 / 16 ) / ( 169 / 24 ) ) = 20

*/

let expression, heap = [], stack = [];
let threeArgv = process.argv[2];

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

function replaceAll(str, find, replace) { 
    return str.replace(new RegExp(find, 'g'), replace);
}

// Вызов справочника
if (!threeArgv) {
    console.log('------ HELP ------');
    console.log('#1 Usage example:');
    console.log('- You can specify an expression in the arguments in the terminal. Example: node core.js (2 + 5) * 10');
    console.log('------------------');
    console.log('#2 Usage example:');
    console.log('- You can specify an expression in the file that you will pass in the arguments. Example: node core.js exp.js');
    console.log('------ HELP ------');
    return;
}

// Если третий аргумент -> Файл
else if (threeArgv.endsWith('.txt')) {4
    threeArgv = threeArgv.toLowerCase();
    const contentFile = fs.readFileSync(threeArgv, 'utf8').toLowerCase();
    if (!contentFile.length) return console.log('The file is empty');
    expression = contentFile.replaceAll('(', ' ( ')
                            .replaceAll(')', ' ) ')
                            .replaceAll('+', ' + ')
                            .replaceAll('-', ' - ')
                            .replaceAll('*', ' * ')
                            .replaceAll('/', ' / ')
                            .replaceAll('^', ' ^ ')
                            .replaceAll('d', ' d ')
                            .replaceAll(',', '.')
                            .trim().split(' ');
}

// Если третий аргумент -> Выражение
else {
    threeArgv = threeArgv.toLowerCase();
    expression = threeArgv.replaceAll('(', ' ( ')
                          .replaceAll(')', ' ) ')
                          .replaceAll('+', ' + ')
                          .replaceAll('-', ' - ')
                          .replaceAll('*', ' * ')
                          .replaceAll('/', ' / ')
                          .replaceAll('^', ' ^ ')
                          .replaceAll('d', ' d ')
                          .replaceAll(',', '.')
                          .trim().split(' ');
}

expression = expression.filter(char => char.length);
if (expression.filter(chr => chr == '(').length != expression.filter(chr => chr == ')').length) return console.log('(0) The expression is incorrect');
// Проверка на корректное расположение операций
for(let index = 0; index < expression.length - 1; index++) {
    if ('-+*/d^'.includes(expression[index]) && '+*/d^'.includes(expression[index + 1]))
        return console.log('(*) The expression is incorrect');
}

for(let index = 0; index < expression.length; index++) {

    switch(expression[index]) {

        case '(': { // Встретилась открывающая скобка

            if (expression[index + 1] in priority && expression[index + 1] != '-' && expression[index + 1] != '(') return console.log('(1) The expression is incorrect');

            stack.push('('); // Добавляем в стэк скобку
            break;
        }
        case ')': { // Встретилась закрывающая скобка

            // Если кол-во открывающихся скобок в стеке равно нулю
            if (!stack.filter(chr => chr == '(').length) return console.log('(2) The expression is incorrect');

            if ((expression[index - 1] in priority && expression[index - 1] != '-') && expression[index - 1] != ')') return console.log('(3) The expression is incorrect');

            while(stack.length && stack[stack.length - 1] != '(') {
                heap.push(stack[stack.length - 1]); // Последний элемент стэка переносим в heap
                stack.pop(); // Удаляем последний элемент из стэка
            }
            stack.pop(); // Удаляем '(' из стэка
            break;
        }

        case '-': { // Встретился знак -
            // Если встретилось отрицательное число
            if (index == 0 || (isNaN(Number(expression[index - 1])) && !isNaN(Number(expression[index + 1])))) {
                heap.push(-1 * expression[index + 1]);
                index++;
                break;
            }
        }
        case '+': {} // Встретился знак +
        case '*': {} // Встретился знак *
        case '/': { // Встретился знак /
            // Если попалась операция, которая имеет выше приоритетом, чем последняя операци в стэке
            if (!stack.length || priority[expression[index]] > priority[stack[stack.length - 1]]) stack.push(expression[index]);
            // Если попалась операция, которая имеет не выше приоритет
            else {
                while(stack.length && stack[stack.length - 1] != '(' && priority[expression[index]] <= priority[stack[stack.length - 1]]) {
                    heap.push(stack[stack.length - 1]); // Последний элемент стэка переносим в heap
                    stack.pop(); // Удаляем последний элемент из стэка
                }
                stack.push(expression[index]); // Добавляем текущую операцию в стэк
            }
            break;
        }

        case '^': {} // Встретился знак ^
        case 'd': { // Встретился знак d (Аналог ^)
            stack.push(expression[index]);
            break;
        }

        default: { // Встретилась не операция (Сторонний символ или число)
            let number = Number(expression[index]);
            if (isNaN(number)) return console.log('(4) The expression is incorrect');
            heap.push(number);
            break;
        }
    }
}

while(stack.length) {
    heap.push(stack[stack.length - 1]);
    stack.pop();
}

console.log(':', heap.join(' '));

let index = 0; let result;
let leftNumber, rightNumber;
while(heap.length != 1) {
    leftNumber = heap[index]; rightNumber = heap[index + 1];
    if (!isNaN(Number(leftNumber)) && !isNaN(Number(rightNumber)) && (heap[index + 2] in priority)) {
        result = 0;
        switch(heap[index + 2]) {
            case '+': { result = leftNumber + rightNumber; break; };
            case '-': { result = leftNumber - rightNumber; break; };
            case '*': { result = leftNumber * rightNumber; break; };
            case '/': { result = leftNumber / rightNumber; break; };
            case '^': {}
            case 'd': { result = leftNumber ** rightNumber; break; };
        }
        heap[index] = result;
        heap = heap.slice(0, index + 1).concat(heap.slice(index + 3, heap.length));
        index = 0;
    } else {
        index++;
    }
}

console.log('Answer:', heap[0]);