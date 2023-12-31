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

// Функция для замены
function ReplaceAll(str, finds, replaces) {
    if (finds.length != replaces.length) return console.log('Number of substitutions less than found');
    for(let i = 0; i < finds.length; i++) {
        str = str.replaceAll(finds[i], replaces[i]);
    }
    return str.trim().split(' ');
}

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
else if (threeArgv.endsWith('.txt')) {
    if (!fs.existsSync(threeArgv)) return console.log('The file is not find');
    threeArgv = threeArgv.toLowerCase();
    const contentFile = fs.readFileSync(threeArgv, 'utf8').toLowerCase();
    if (!contentFile.length) return console.log('The file is empty');
    expression = ReplaceAll(contentFile,['(', ')', '+', '-', '*', '/', '^', 'd', ','], [' ( ', ' ) ', ' + ', ' - ', ' * ', ' / ', ' ^ ', ' d ', '.']);
}

// Если третий аргумент -> Выражение
else {
    threeArgv = threeArgv.toLowerCase();
    expression = ReplaceAll(threeArgv,['(', ')', '+', '-', '*', '/', '^', 'd', ','], [' ( ', ' ) ', ' + ', ' - ', ' * ', ' / ', ' ^ ', ' d ', '.']);
}

expression = expression.filter(char => char.length);
if (expression.filter(chr => chr == '(').length != expression.filter(chr => chr == ')').length)
    return console.log('(0) The expression is incorrect');

// Проверка на корректное расположение операций
for(let index = 0; index < expression.length - 1; index++) {
    if ('-+*/d^'.includes(expression[index]) && '-+*/d^'.includes(expression[index + 1]))
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
                heap.push(stack.pop()); // Последний элемент стэка переносим в heap
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
                    heap.push(stack.pop()); // Последний элемент стэка переносим в heap
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
    heap.push(stack.pop());
}

console.log(':', heap.join(' '));

while(heap.length) {
    let elem = heap.shift();

    if (!isNaN(Number(elem))) {
        stack.push(elem);
        continue;
    }

    switch(elem) {
        case '+': { // Если встретилась операция "+"
            stack.push(stack.pop() + stack.pop());
            break;
        }
        case '-': { // Если встретилась операция "-"
            stack.push(-1 * stack.pop() + stack.pop());
            break;
        }
        case '*': { // Если встретилась операция "*"
            stack.push(stack.pop() * stack.pop());
            break;
        }
        case '/': { // Если встретилась операция "/"
            let two = stack.pop();
            let one = stack.pop();
            stack.push(one / two);
            break;
        }
        case '^': {}
        case 'd': { // Если встретилась операция "^"/"d"
            let two = stack.pop();
            let one = stack.pop();
            stack.push(one ** two);
            break;
        }
    }
}

console.log(stack[0]);