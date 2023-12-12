// 0 - низкий приоритет (+ | -)
// 1 - средний приоритет (* | /)
// 2 - высокий приоритет (^)
const priority = { '+': 0, '-': 0, '/': 1, '*': 1, 'd': 2, '^': 2 };
const expression = process.argv.slice(2).join('');
const stack = [];
const heap = [];

// Формарование стэка и выходных данных
for(let index = 0; index < expression.length; index++) {
    switch(expression[index]) {

        case '(': { // Открывающая скобка

            break;
        }

        case ')': { // Закрывающая скобка

            break;
        }

        case '+': { // Сложение
            // ...
            stack.push('+');
            break;
        }

        case '-': { // Вычитание
            // ...
            stack.push('-');
            break;
        }

        case 'd': {}
        case '^': { // Степень
            // ...
            stack.push('^');
            break;
        }

        case '*': { // Умножение
            // ...
            stack.push('*');
            break;
        }

        case '/': { // Деление
            // ...
            stack.push('/');
            break;
        }

        default: { // Числа
            let number = parseInt(expression[index]);
            if (isNaN(number)) return console.log(`Unknown element: ${expression[index]}`);
            heap.push(number);
            break;
        }
    }  
}

for(let i = stack.length - 1; i >= 0; i--) heap.push(stack[i]);

// Выисление
let index = 0
for(; index < heap.length; index += 2) {
    let oneVariable = heap[index]; // Первая переменная
    let twoVariable = heap[index + 1]; // Вторая переменная
    let operation = heap[index + 2]; // Операция

    switch(operation) {
        case '+': { // Сложение
            heap[index] = null;
            heap[index + 1] = null;
            heap[index + 2] = oneVariable + twoVariable;
            break;
        }

        case '-': { // Вычитание
            heap[index] = null;
            heap[index + 1] = null;
            heap[index + 2] = oneVariable - twoVariable;
            break;
        }

        case 'd': {}
        case '^': { // Степень
            heap[index] = null;
            heap[index + 1] = null;
            heap[index + 2] = oneVariable ** twoVariable;
            break;
        }

        case '*': { // Умножение
            heap[index] = null;
            heap[index + 1] = null;
            heap[index + 2] = oneVariable * twoVariable;
            break;
        }

        case '/': { // Деление
            heap[index] = null;
            heap[index + 1] = null;
            heap[index + 2] = oneVariable / twoVariable;
            break;
        }
    }
}


console.log('Answer: ', heap[index]);