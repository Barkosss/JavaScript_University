const fs = require('fs');
const prompt = require('prompt-sync')();

/*
--- Синтаксис языка --


*/

const inputFile = process.argv[2];
const content = fs.readFileSync(inputFile, 'utf-8');
var lines = content.split('\n'); // Делаю массив
for (let i in lines) if (lines[i].length > 1) lines[i] = lines[i].trim(); // Убираю лишние пробелы в строке (В начале и в конце)
const map = { '.code': [], '.data': { 'eax': 0, 'ebx': 0, 'ecx': 0, 'edx': 0, 'esp': 0, 'ebp': 0, 'esi': 0, 'edi': 0, 'eip': 0, 'eflags': 0 } };
var indexCode = 0;
var section = lines[0].trim();

// Пробегаемся по массиву
(async () => {
    while (lines[indexCode] != 'end') {
        if (!lines[indexCode].trim() || lines[indexCode].trim().startsWith('//')) { indexCode++; continue; };
        var line = lines[indexCode].trim();
        if (line[0] == ':') { indexCode++; continue; }
        if (['.data', '.code'].indexOf(line) != -1) { section = line; indexCode++; continue; }
        //console.log(lines, line.startsWith(':start'));
        /*
        if (line.startsWith(':start')) { // Реагирование на метки
            const command = line.split('_').slice(1);
            map[line] = indexCode;
            map[':end_' + command] = lines.indexOf(':end_' + command);
            indexCode++;
            //continue;
        }*/
        switch (section) {
            case '.data': {
                var [variable, value] = line.split(' ');
                map['.data'][variable] = ((value) ? (parseInt(value)) : (0));
                indexCode++;
                break;
            }

            case '.code': {
                const command = line.split(' ')[0];
                //console.log(map, 'command:', command);
                switch (command) {

                    case 'mov': { // Перемещение значений
                        const [register, value] = line.split(' ').slice(1) // register - регистр, value - значение
                        if (isNaN(value)) {
                            if (value in map['.data']) {
                                map['.data'][register] = map['.data'][value];
                            } else {
                                console.log(`Variable ${value} is not defined.`);
                                return;
                            }
                        } else {
                            map['.data'][register] = parseInt(value);
                        }
                        indexCode++;
                        break;
                    }

                    case 'and': {
                        var [oneVariable, twoVariable] = line.split(' ').slice(1);
                        map['.data'][oneVariable] = (map['.data'][oneVariable] * map['.data'][twoVariable]);
                        indexCode++;
                        break;
                    }

                    case 'max': { // Максимальное значение
                        let variable = line.split(' ')[1];
                        let variables = [];
                        line.split(' ').slice(2).filter((elem) => {
                            if (isNaN(elem)) {
                                if (elem in map['.data']) {
                                    variables.push(map['.data'][elem]);
                                } else {
                                    console.log(`Variable ${value} is not defined.`);
                                    return;
                                }
                            } else {
                                variables.push(parseInt(elem));
                            }
                        });
                        let maxValue = Math.max.apply(null, variables);
                        map['.data'][variable] = maxValue;
                        indexCode++;
                        break;
                    }

                    case 'min': { // Минимальное значение
                        let variable = line.split(' ')[1];
                        let variables = [];
                        line.split(' ').slice(2).filter((elem) => {
                            if (isNaN(elem)) {
                                if (elem in map['.data']) {
                                    variables.push(map['.data'][elem]);
                                } else {
                                    console.log(`Variable ${value} is not defined.`);
                                    return;
                                }
                            } else {
                                variables.push(parseInt(elem));
                            }
                        });
                        let minValue = Math.min.apply(null, variables);
                        map['.data'][variable] = minValue;
                        indexCode++;
                        break;
                    }

                    case 'abs': { // Модуль числа
                        let variable = line.split(' ')[1];
                        map['.data'][variable] = Math.abs(map['.data'][variable]);
                        indexCode++;
                        break;
                    }

                    case 'diff': {
                        let variable = line.split(' ')[1];
                        let oneVariable = line.split(' ')[2];
                        let twoVariable = line.split(' ')[3];
                        if (isNaN(oneVariable)) {
                            if (oneVariable in map['.data']) {
                                oneVariable = map['.data'][oneVariable];
                            } else {
                                console.log(`Variable ${oneVariable} is not defined.`);
                                return;
                            }
                        } else {
                            oneVariable = parseInt(oneVariable);
                        }
                        if (isNaN(twoVariable)) {
                            if (twoVariable in map['.data']) {
                                twoVariable = map['.data'][twoVariable];
                            } else {
                                console.log(`Variable ${twoVariable} is not defined.`);
                                return;
                            }
                        } else {
                            twoVariable = parseInt(twoVariable);
                        }
                        map['.data'][variable] = oneVariable - twoVariable;
                        indexCode++;
                        break;
                    }

                    case 'input': { // Ввод значения с консоли
                        let variable = line.split(' ')[1];
                        let input = parseInt(prompt(': '));
                        map['.data'][variable] = input;
                        indexCode++;
                        break;
                    }

                    case 'output': { // Вывести результат
                        const variable = line.split(' ')[1];
                        let output;
                        if (map['.data'][variable]) { // Если указан регистр
                            output = map['.data'][variable];
                        }
                        else if (map['.data'][variable]) { // Если указана инициализированная переменная
                            output = map['data'][variable];
                        } else { // Если указана неинициализированная переменная
                            output = undefined;
                        }

                        console.log(output); // Вывести значение в консоль
                        indexCode++;
                        break;
                    }

                    case 'mod': { // Деление с остатком
                        const variable = line.split(' ')[1]; // Переменная, куда надо сохранить результат. Первое слагаемое
                        const summand = line.split(' ')[2]; // Второе слагаемое.
                        //console.log('After:', map['.data'][variable], map['.data'][summand], (map['.data'][variable] % map['.data'][summand]))
                        if (isNaN(summand)) {
                            if (summand in map['.data']) {
                                map['.data'][variable] = (map['.data'][variable] % map['.data'][summand]);
                            } else {
                                console.log(`Variable ${summand} is not defined.`);
                                return;
                            }
                        } else {
                            map['.data'][variable] = map['.data'][variable] % parseInt(summand);
                        }
                        //console.log('Before:', map['.data'][variable], map['.data'][summand], (map['.data'][variable] % map['.data'][summand]))
                        indexCode++;
                        break;
                    }

                    case 'add': { // Сложение
                        const variable = line.split(' ')[1]; // Переменная, куда надо сохранить результат. Первое слагаемое
                        const summand = line.split(' ')[2]; // Второе слагаемое.

                        if (isNaN(summand)) {
                            if (summand in map['.data']) {
                                map['.data'][variable] += parseInt(map['.data'][summand]);
                            } else {
                                console.log(`Variable ${summand} is not defined.`);
                                return;
                            }
                        } else {
                            map['.data'][variable] += parseInt(summand);
                        }

                        indexCode++;
                        break;
                    }

                    case 'cmp': { // Сравнение (Перепрыгнуть)
                        indexCode++;
                        break;
                    }

                    case 'je': { // Переход, если первый аргумент РАВЕН второму аргументу
                        let prevLine = lines[indexCode - 1].trim();
                        let oneVariable = prevLine.split(' ')[1];
                        let twoVariable = prevLine.split(' ')[2];
                        if (isNaN(oneVariable)) {
                            if (oneVariable in map['.data']) {
                                oneVariable = parseInt(map['.data'][oneVariable]);
                            } else {
                                console.log(`Variable ${oneVariable} is not defined.`);
                                return;
                            }
                        } else {
                            oneVariable = parseInt(oneVariable);
                        }
                        if (isNaN(twoVariable)) {
                            if (twoVariable in map['.data']) {
                                twoVariable = parseInt(map['.data'][twoVariable]);
                            } else {
                                console.log(`Variable ${twoVariable} is not defined.`);
                                return;
                            }
                        } else {
                            twoVariable = parseInt(twoVariable);
                        }

                        if (oneVariable == twoVariable) {
                            const point = line.split(' ')[1];
                            indexCode = lines.indexOf(point) + 1;
                        } else {
                            indexCode++;
                        }
                        break;
                    }

                    case 'jge': { // Переход, если больше или равно (Чекать прошлую строку)
                        let prevLine = lines[indexCode - 1].trim();
                        let oneVariable = prevLine.split(' ')[1];
                        let twoVariable = prevLine.split(' ')[2];
                        if (map['.data'][oneVariable] >= map['.data'][twoVariable]) {
                            const point = line.split(' ')[1];
                            indexCode = lines.indexOf(point) + 1;
                        } else {
                            indexCode++;
                        }
                        break;
                    }

                    case 'jne': { // Переход, если не равно
                        let prevLine = lines[indexCode - 1].trim();
                        let oneVariable = prevLine.split(' ')[1];
                        let twoVariable = prevLine.split(' ')[2];

                        if (map['.data'][oneVariable] != map['.data'][twoVariable]) {
                            const point = line.split(' ')[1];
                            indexCode = lines.indexOf(point) + 1;
                        } else {
                            indexCode++;
                        }
                        break;
                    }

                    case 'jmp': { // Переход
                        const point = line.split(' ')[1];
                        indexCode = lines.indexOf(point) + 1;
                        break;
                    }
                    
                    default: {
                        console.log(`Command ${command} is not defined.`);
                        return;
                    }
                }
                break;
            }

            default: {
                console.log(`Section ${section} is not defined.`);
                return;
            }
        }
    }

    console.log('The process is over');
})();