const fs = require('fs');
const prompt = require('prompt-sync')();
const inputFile = process.argv[2];
if (!fs.existsSync(inputFile)) return console.log(`File ${inputFile} is not denied!\nFormat: [input file]`);
const content = fs.readFileSync(inputFile, 'utf-8');
var split = content.split('\n'); var data = [];
for (let i in split) if (split[i] != '\r' && split[i].length > 0) data.push(split[i].trim());
const lendata = data.length;
var indexCode = 0; // Номер строки
var section = data[0].trim(); // Секция кода.

while(data[indexCode] != 'end') {
    if (!data[indexCode].trim() || data[indexCode].trim().startsWith('//')) { indexCode++; continue; };
    var line = data[indexCode].trim();
    if (line[0] == ':') { indexCode++; continue };
    if (['.data', '.code'].indexOf(line) != -1) { section = line; indexCode++; continue; }
    //console.log(section);
    switch(section) {

        case '.data': { // Секция кода - Данные
            let [cell, arg] = line.split(' ');
            if (cell.startsWith('#')) { // Если начинается на # - Ячейка памяти
                cell = parseInt(cell.slice(1)); // Убираем '#' из номера ячейки памяти
                if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                data[lendata + cell + 1] = parseInt(arg); // Номер ячейка = Номер ячейки + длина кода + 1 (+1 делается для небольшого разделения между блоком кода и данных)
            } else { // Не ячейка памяти - Ошибка
                console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`)
                return;
            }
            indexCode++;
            break;
        }

        case '.code': { // Секция кода - Кода
            const command = line.split(' ')[0];
            //console.log('command:', command);
            switch(command) {

                case 'mov': { // Перемещения значения
                    let [cell, arg] = line.split(' ').slice(1);
                    if (cell.startsWith('#')) { // Если первым аргументом указана ячейка
                        cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                        if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                        if (isNaN(arg)) { // Если второй аргумент является ячейкой памяти
                            arg = parseInt(arg.slice(1)) // Берём именно номер ячейки памяти
                            if (arg < 0 || isNaN(arg)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                            data[lendata + cell + 1] = data[lendata + arg + 1]; // В ячейку с номером cell записываем значение из ячейки с номером arg;
                        } else { // Если второй аргумент значение
                            data[lendata + cell + 1] = parseInt(arg); // В ячейку с номером cell записываем значение arg;
                        }
                    } else { // Если первым аргументом указана не ячейка - Ошибка
                        console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`)
                        return;
                    }
                    indexCode++;
                    break;
                }
                
                case 'mul': { // Произведение
                    let [cell, arg] = line.split(' ').slice(1);
                    if (cell.startsWith('#')) { // Если первым аргументом указана ячейка памяти
                        cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                        if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                        if (arg.startsWith('#')) { // Если вторым аргументом указана ячейка памяти
                            arg = parseInt(arg.slice(1)); // Берём именно номер ячейки памяти
                            if (arg < 0 || isNaN(arg)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                            data[lendata + cell + 1] = (data[lendata + cell + 1] ?? 0) * (data[lendata + arg + 1] ?? 0);
                        } else if (!isNaN(Number(arg))) { // Если вторым аргументом указана число
                            data[lendata + cell + 1] = (data[lendata + cell + 1] ?? 0) * arg;
                        } else { // Если вторым указано не число и не ячейка памяти
                            console.log(`The second argument must be a memory location or an integer. (line: ${indexCode + 1})`);
                            return;
                        }
                    } else { // Если первым аргументом указана не ячейка памяти
                        console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                        return;
                    }
                    indexCode++;
                    break;
                }

                case 'add': { // Сложение аргументов
                    let [cell, ...argv] = line.split(' ').slice(1);
                    if (argv.length < 2) return console.log(`Less then two arguments (line: ${indexCode + 1})`);
                    if (cell.startsWith('#')) { // Если первым аргументом указана ячейка памяти
                        cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                        if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                        let sum = 0; // Результат сложения - 0
                        for (let elem of argv) { // вычисление
                            if (isNaN(elem)) { // Если элемент массива является ячейкой памяти
                                elem = parseInt(elem.slice(1)); // Берём именно номер ячейки памяти
                                if (elem < 0 || isNaN(elem)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                                sum += parseInt(data[lendata + elem + 1]);
                            } else { // Если элементь массива является значение
                                sum += parseInt(elem);
                            }
                        }
                        data[lendata + cell + 1] = sum; // Сохранение в ячейку памяти с номером cell результат сложения - sum
                    } else { // Если первым аргументом указана не ячейка памяти
                        console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                        return;
                    }
                    indexCode++;
                    break;
                }

                case 'diff': { // Разность аргументов
                    let [cell, ...argv] = line.split(' ').slice(1);
                    if (cell.startsWith('#')) { // Если первым аргументом указана ячейка памяти
                        cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                        if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                        let diff = 0; // Результат вычитания - 0
                        let firstArgv = argv[0];
                        if (firstArgv.startsWith('#')) {
                            number = parseInt(firstArgv.slice(1)); // Берём именно номер ячейки памяти
                            if (number < 0 || isNaN(number)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                            diff = data[lendata + 1 + number];
                        } else {
                            diff = parseInt(firstArgv);
                        }
                        for (let elem of argv.slice(1)) { // вычисление
                            if (isNaN(elem)) { // Если элемент массива является ячейкой памяти
                                elem = parseInt(elem.slice(1)); // Берём именно номер ячейки памяти
                                if (elem < 0 || isNaN(elem)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                                diff -= data[lendata + elem + 1];
                            } else { // Если элементь массива является значение
                                diff -= elem;
                            }
                        }
                        data[lendata + cell + 1] = diff; // Сохранение в ячейку памяти с номером cell результат вычитания - diff
                    } else { // Если первым аргументом указана не ячейка памяти
                        console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                        return;
                    }
                    indexCode++;
                    break;
                }

                case 'input': { // Ввод с консоли
                    let [cell] = line.split(' ').slice(1);
                    if (cell.startsWith('#')) { // Если аргумент является ячейка памяти
                        cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                        if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                        let input = prompt(': ');
                        data[lendata + cell + 1] = input;
                    } else { // Если аргумент не является ячейкой памяти
                        console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                        return;
                    }
                    indexCode++;
                    break;
                }

                case 'output': { // Вывод на консоль
                    let cell = line.split(' ')[1];
                    if (cell.startsWith('#')) { // Если аргументом указана ячейка памяти
                        cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                        if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                        console.log(data[lendata + cell + 1]);
                    } else { // Если аргументом указана не ячейка памяти
                        console.log(cell);
                    }
                    indexCode++;
                    break;
                }

                case 'cmp': { // Команда для сравнения
                    let [cell, arg1, arg2] = line.split(' ').slice(1);
                    if (cell.startsWith('#')) { // Если первым аргументом указана ячейка
                        cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                        if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                        
                        if (arg1.startsWith('#')) { // Если первый аргумент - Ячейка памяти
                            let cell = parseInt(arg1.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                            arg1 = data[lendata + cell + 1];
                        } else {
                            arg1 = parseInt(arg1);
                        }
                        if (arg2.startsWith('#')) { // Если второй аргумент - Ячейка памяти
                            let cell = parseInt(arg2.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                            arg2 = data[lendata + cell + 1];
                        } else {
                            arg2 = parseInt(arg2);
                        }
    
                        data[lendata + cell + 1] = 0;
                        if (arg1 < arg2) { // Если первый аргумент меньше второго -> -1
                            data[lendata + cell + 1] = -1;
                        } else if (arg1 == arg2) { // Если первый аргумент равно второму -> 0
                            data[lendata + cell + 1] = 0;
                        } else if (arg1 > arg2) { // Если первый аргумент больше второму -> 1
                            data[lendata + cell + 1] = 1;
                        }
                    } else { // Если первым аргументом указана не ячейка - Ошибка
                        return console.log(`The first argument must be a memory cell. (${indexCode + 1})`);
                    }
                    indexCode++;
                    break;
                }

                case 'jb': { // Переход указанная ячейка хранит -1 (первый аргумент меньше второго)
                    let [cell, point] = line.split(' ').slice(1);
                    if (cell.startsWith('#')) { // Если аргумент является ячейка памяти
                        cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                        if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                        if (data[lendata + cell + 1] == -1) {
                            if (data.indexOf(point) != -1) indexCode = data.indexOf(point); // Если метка найдена
                            else return console.log(`The specified tag "${point}" was not found. (line: ${indexCode + 1})`); // Если метка не найдена
                        } else { // Если аргументы равны
                            indexCode++;
                        }
                    } else { // Если аргумент не является ячейкой памяти
                        console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                        return;
                    }
                    break;
                }

                case 'je': { // Переход указанная ячейка хранит 0 (первый аргумент равен второму)
                    let [cell, point] = line.split(' ').slice(1);
                    if (cell.startsWith('#')) { // Если аргумент является ячейка памяти
                        cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                        if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                        if (!data[lendata + cell + 1]) {
                            if (data.indexOf(point) != -1) indexCode = data.indexOf(point); // Если метка найдена
                            else return console.log(`The specified tag "${point}" was not found. (line: ${indexCode + 1})`); // Если метка не найдена
                        } else { // Если аргументы равны
                            indexCode++;
                        }
                    } else { // Если аргумент не является ячейкой памяти
                        console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                        return;
                    }
                    break;
                }

                case 'ja': { // Переход указанная ячейка хранит 1 (первый аргумент больше второго)
                    let [cell, point] = line.split(' ').slice(1);
                    if (cell.startsWith('#')) { // Если аргумент является ячейка памяти
                        cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                        if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                        if (data[lendata + cell + 1]) {
                            if (data.indexOf(point) != -1) indexCode = data.indexOf(point); // Если метка найдена
                            else return console.log(`The specified tag "${point}" was not found. (line: ${indexCode + 1})`); // Если метка не найдена
                        } else { // Если аргументы равны
                            indexCode++;
                        }
                    } else { // Если аргумент не является ячейкой памяти
                        console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                        return;
                    }
                    break;
                }

                case 'jmp': { // Переход
                    let point = line.split(' ')[1];
                    if (data.indexOf(point) != -1) indexCode = data.indexOf(point); // Если метка найдена
                    else return console.log(`The specified tag "${point}" was not found. (line: ${indexCode + 1})`); // Если метка не найдена
                    break;
                }

                default: { // Ошибка
                    console.log(`Command ${command} is not defined. (line: ${indexCode + 1})`);
                    return;
                }
            }
            break;
        }

        default: { // Ошибка
            console.log(`Section ${section} is not defined. (line: ${indexCode + 1})`);
            return;
        }
    }
}
console.log('Process exited normally.');