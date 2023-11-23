const fs = require('fs');
const prompt = require('prompt-sync');

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
        if (['.data', '.code'].indexOf(line) != -1) { section = line; indexCode++; continue; }
        if (line.startsWith(':start')) { // Реагирование на метки
            const command = line.split('_').slice(1);
            map[line] = indexCode;
            map[':end_' + command] = lines.indexOf(':end_' + command);
            indexCode++;
            continue;
        }
        switch (section) {
            case '.data': {
                var [variable, value] = line.split(' ');
                map['.data'][variable] = ((value) ? (parseInt(value)) : (0));
                indexCode++;
                break;
            }

            case '.code': {
                const command = line.split(' ')[0];
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

                    case 'input': { // Ввод значения с консоли

                        indexCode++;
                        break;
                    }

                    case 'output': {
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

                    case 'min': { // Минимальное значение
                        const variable = line.split(' ')[1]; // Переменная, куда надо сохранить результат. Первое слагаемое
                        const summand = line.split(' ')[2]; // Второе слагаемое.

                        if (isNaN(summand)) {
                            if (summand in map['.data']) {
                                map['.data'][variable] = Math.min(map['.data'][variable], map['.data'][summand]);
                            } else {
                                console.log(`Variable ${summand} is not defined.`);
                                return;
                            }
                        } else {
                            map['.data'][variable] = Math.min(map['.data'][variable], parseInt(summand));
                        }
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

                    case 'jge': { // Переход, если больше или равно (Чекать прошлую строку)
                        let prevLine = lines[indexCode - 1].trim();
                        let oneVariable = prevLine.split(' ')[1];
                        let twoVariable = prevLine.split(' ')[2];
                        if (map['.data'][oneVariable] >= map['.data'][twoVariable]) {
                            const point = line.split(' ')[1];
                            indexCode = map[point] + 1;
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
                            indexCode = map[point] + 1;
                        } else {
                            indexCode++;
                        }
                        break;
                    }

                    case 'jmp': { // Переход
                        const point = line.split(' ')[1];
                        indexCode = map[point] + 1;
                        break;
                    }
                    /*
                                        case 'begin_if': { // Начало if
                                            map[command] = indexCode;
                                            map['end_if'] = lines.indexOf('end_if');
                                            indexCode++;
                                            break;
                                        }*/
                    /*
                                        case 'for_start': { // Начало цикла
                                            map[command] = indexCode;
                                            map['for_end'] = lines.indexOf('for_end');
                                            indexCode++;
                                            break;
                                        }*/

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